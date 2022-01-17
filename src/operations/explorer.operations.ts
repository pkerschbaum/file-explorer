import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import { extname, basename } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { isLinux } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import type { ReportProgressArgs } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { Constants } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uint';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as uuid from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uuid';
import { IFileStat } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import invariant from 'tiny-invariant';

import { CustomError } from '@app/base/custom-error';
import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { PASTE_PROCESS_STATUS, ResourceForUI, RESOURCE_TYPE, UpdateFn } from '@app/domain/types';
import { mapFileStatToResource, refreshResourcesOfDirectory } from '@app/global-cache/resources';
import { extractCwdFromExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import {
  actions as explorerActions,
  REASON_FOR_SELECTION_CHANGE,
  RenameHistoryKeys,
  ResourcesView,
} from '@app/global-state/slices/explorers.slice';
import { actions as processesActions } from '@app/global-state/slices/processes.slice';
import { createLogger } from '@app/operations/create-logger';
import { executeCopyOrMove, openFiles, resolveDeep } from '@app/operations/resource.operations';

const UPDATE_INTERVAL_MS = 500;
const logger = createLogger('explorer.hooks');

export async function openResources(explorerId: string, resources: ResourceForUI[]) {
  if (resources.length === 1 && resources[0].resourceType === RESOURCE_TYPE.DIRECTORY) {
    await changeCwd({
      explorerId,
      newCwd: URI.from(resources[0].uri),
      keepExistingCwdSegments: true,
    });
  } else {
    await openFiles(
      resources
        .filter((resource) => resource.resourceType === RESOURCE_TYPE.FILE)
        .map((resource) => resource.uri),
    );
  }
}

export function copyCwdIntoClipboard(explorerId: string) {
  const cwdUri = extractCwdFromExplorerPanel(
    globalThis.modules.store.getState().explorersSlice.explorerPanels[explorerId],
  );
  invariant(cwdUri);
  globalThis.modules.nativeHost.clipboard.writeText(formatter.resourcePath(cwdUri));
}

export async function changeCwd({
  explorerId,
  newCwd,
  keepExistingCwdSegments,
}: {
  explorerId: string;
  newCwd: UriComponents;
  keepExistingCwdSegments: boolean;
}) {
  const newCwdUri = URI.from(newCwd);
  const stats = await globalThis.modules.fileSystem.resolve(newCwdUri);
  if (!stats.isDirectory) {
    throw Error(
      `could not change directory, reason: uri is not a valid directory. uri: ${formatter.resourcePath(
        newCwd,
      )}`,
    );
  }

  // change to the new directory and refresh resources of that directory
  globalThis.modules.dispatch(
    explorerActions.changeCwd({ explorerId, newCwd: newCwdUri.toJSON(), keepExistingCwdSegments }),
  );
  await refreshResourcesOfDirectory({ directory: newCwd });
}

export async function pasteResources(explorerId: string) {
  const clipboardResources = globalThis.modules.nativeHost.clipboard
    .readResources()
    .map((r) => URI.from(r));
  const draftPasteState = globalThis.modules.store.getState().processesSlice.draftPasteState;
  if (clipboardResources.length === 0 || draftPasteState === undefined) {
    return;
  }

  const cwd = extractCwdFromExplorerPanel(
    globalThis.modules.store.getState().explorersSlice.explorerPanels[explorerId],
  );
  const destinationFolder = URI.from(cwd);
  const destinationFolderStat = await globalThis.modules.fileSystem.resolve(destinationFolder);
  const id = uuid.generateUuid();
  const cancellationTokenSource = new CancellationTokenSource();

  // clear draft paste state (neither cut&paste nor copy&paste is designed to be repeatable)
  globalThis.modules.dispatch(processesActions.clearDraftPasteState());

  // add the paste process about to start
  globalThis.modules.dispatch(
    processesActions.addPasteProcess({
      id,
      pasteShouldMove: draftPasteState.pasteShouldMove,
      sourceUris: clipboardResources.map((resource) => resource.toJSON()),
      destinationDirectory: destinationFolder.toJSON(),
      cancellationTokenSource,
    }),
  );

  // register listener on cancellation token so that if cancellation gets requested, "ABORT_REQUESTED" state gets dispatched
  cancellationTokenSource.token.onCancellationRequested(() => {
    globalThis.modules.dispatch(
      processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_REQUESTED }),
    );
  });

  // for each resource to paste, check for some required conditions and prepare target URI
  const pasteInfos = (
    await Promise.all(
      clipboardResources.map(async (uriOfSourceResource) => {
        // Destination folder must not be a subfolder of any source resource. Imagine copying
        // a folder "test" and paste it (and its content) *into* itself, that would not work.
        if (
          uriHelper.getComparisonKey(destinationFolder) !==
            uriHelper.getComparisonKey(uriOfSourceResource) &&
          resources.isEqualOrParent(
            destinationFolder,
            uriOfSourceResource,
            !isLinux /* ignorecase */,
          )
        ) {
          throw new CustomError('The destination folder is a subfolder of the source resource', {
            destinationFolder,
            uriOfSourceResource,
          });
        }

        let fileStatOfSourceResource;
        try {
          fileStatOfSourceResource = await globalThis.modules.fileSystem.resolve(
            uriOfSourceResource,
            {
              resolveMetadata: true,
            },
          );
        } catch (err: unknown) {
          logger.error(
            'error during paste process, source resource was probably deleted or moved meanwhile',
            err,
          );
          return;
        }

        const uriOfTargetResource = findValidPasteTarget(destinationFolderStat, {
          resource: uriOfSourceResource,
          isDirectory: fileStatOfSourceResource.isDirectory,
          allowOverwrite: false,
        });

        return {
          sourceResource: { uri: uriOfSourceResource, fileStat: fileStatOfSourceResource },
          targetResource: { uri: uriOfTargetResource },
        };
      }),
    )
  ).filter(check.isNotNullish);

  // if cancellation was requested in the meantime, abort paste process
  if (cancellationTokenSource.token.isCancellationRequested) {
    globalThis.modules.dispatch(
      processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }),
    );
    return;
  }

  // after target URI got prepared, initialize paste status fields and gather totalSize
  let totalSize = 0;
  let bytesProcessed = 0;
  let progressOfAtLeastOneSourceIsIndeterminate = false;
  const statusPerResource: {
    [keyOfResource: string]:
      | {
          type: RESOURCE_TYPE.FILE;
          progressDeterminateType: 'DETERMINATE' | 'INDETERMINATE';
          bytesProcessed: number;
        }
      | {
          type: RESOURCE_TYPE.DIRECTORY | RESOURCE_TYPE.SYMBOLIC_LINK | RESOURCE_TYPE.UNKNOWN;
        };
  } = {};

  await Promise.all(
    pasteInfos.map(async (pasteInfo) => {
      const { sourceResource } = pasteInfo;

      const resourceStatMap = await resolveDeep(sourceResource.uri, sourceResource.fileStat);

      Object.entries(resourceStatMap).forEach(([keyOfResource, statOfResource]) => {
        totalSize += statOfResource.size;
        const resourceType = mapFileStatToResource(statOfResource).resourceType;
        if (resourceType === RESOURCE_TYPE.FILE) {
          statusPerResource[keyOfResource] = {
            type: resourceType,
            progressDeterminateType: 'INDETERMINATE',
            bytesProcessed: 0,
          };
        } else {
          statusPerResource[keyOfResource] = {
            type: resourceType,
          };
        }
      });
    }),
  );

  // if cancellation was requested in the meantime, abort paste process
  if (cancellationTokenSource.token.isCancellationRequested) {
    globalThis.modules.dispatch(
      processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }),
    );
    return;
  }

  globalThis.modules.dispatch(
    processesActions.updatePasteProcess({
      id,
      status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
      totalSize,
      bytesProcessed,
      progressOfAtLeastOneSourceIsIndeterminate,
    }),
  );
  globalThis.modules.dispatch(
    processesActions.updatePasteProcess({
      id,
      status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
    }),
  );

  // perform paste
  function reportProgress(progressArgs: ReportProgressArgs) {
    const keyOfResource = uriHelper.getComparisonKey(progressArgs.forSource);
    const statusOfResource = statusPerResource[keyOfResource];

    if ('newBytesRead' in progressArgs && progressArgs.newBytesRead !== undefined) {
      if (statusOfResource.type !== RESOURCE_TYPE.FILE) {
        throw new CustomError(`"newBytesRead" were reported for a resource which is not a file!`, {
          keyOfResource,
          statusOfResource,
        });
      }

      bytesProcessed += progressArgs.newBytesRead;
      statusOfResource.bytesProcessed += progressArgs.newBytesRead;
    }
    if ('progressDeterminateType' in progressArgs && progressArgs.progressDeterminateType) {
      // we only track determinate type for files
      if (statusOfResource.type === RESOURCE_TYPE.FILE) {
        statusOfResource.progressDeterminateType = progressArgs.progressDeterminateType;
        progressOfAtLeastOneSourceIsIndeterminate = Object.values(statusPerResource).some(
          (status) =>
            status.type === RESOURCE_TYPE.FILE &&
            status.progressDeterminateType === 'INDETERMINATE',
        );
      }
    }
  }
  const intervalId = setInterval(function dispatchProgress() {
    globalThis.modules.dispatch(
      processesActions.updatePasteProcess({
        id,
        bytesProcessed,
        progressOfAtLeastOneSourceIsIndeterminate,
      }),
    );
  }, UPDATE_INTERVAL_MS);

  try {
    cancellationTokenSource.token.onCancellationRequested(() => {
      clearInterval(intervalId);
    });

    await Promise.all(
      pasteInfos.map((pasteInfo) =>
        executeCopyOrMove({
          ...pasteInfo,
          pasteShouldMove: draftPasteState.pasteShouldMove,
          cancellationTokenSource,
          reportProgress,
        }),
      ),
    );

    if (!cancellationTokenSource.token.isCancellationRequested) {
      globalThis.modules.dispatch(
        processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.SUCCESS }),
      );
    } else {
      globalThis.modules.dispatch(
        processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }),
      );
    }
  } catch (err: unknown) {
    globalThis.modules.dispatch(
      processesActions.updatePasteProcess({
        id,
        status: PASTE_PROCESS_STATUS.FAILURE,
        error: err instanceof Error ? err.message : `Unknown error occured`,
      }),
    );
  } finally {
    clearInterval(intervalId);
    cancellationTokenSource.dispose();
  }
}

export async function createFolder(explorerId: string, folderName: string): Promise<UriComponents> {
  const cwd = extractCwdFromExplorerPanel(
    globalThis.modules.store.getState().explorersSlice.explorerPanels[explorerId],
  );
  const uriOfFolderToCreate = URI.joinPath(URI.from(cwd), folderName);
  await globalThis.modules.fileSystem.createFolder(uriOfFolderToCreate);

  // refresh resources of the target directory
  await refreshResourcesOfDirectory({ directory: cwd });

  return uriOfFolderToCreate;
}

export async function revealCwdInOSExplorer(explorerId: string) {
  const cwd = extractCwdFromExplorerPanel(
    globalThis.modules.store.getState().explorersSlice.explorerPanels[explorerId],
  );
  await globalThis.modules.nativeHost.shell.revealResourcesInOS([cwd]);
}

export function setFilterInput(explorerId: string, segmentIdx: number, newValue: string): void {
  globalThis.modules.dispatch(
    explorerActions.updateCwdSegment({ explorerId, segmentIdx, filterInput: newValue }),
  );
}

export function setReasonForLastSelectionChange(
  explorerId: string,
  segmentIdx: number,
  newValueOrUpdateFn:
    | REASON_FOR_SELECTION_CHANGE
    | undefined
    | UpdateFn<REASON_FOR_SELECTION_CHANGE | undefined>,
): void {
  const currentValue =
    globalThis.modules.store.getState().explorersSlice.explorerPanels[explorerId].cwdSegments[
      segmentIdx
    ].selection.reasonForLastSelectionChange;

  let newValue;
  if (typeof newValueOrUpdateFn === 'function') {
    newValue = newValueOrUpdateFn(currentValue);
  } else {
    newValue = newValueOrUpdateFn;
  }

  globalThis.modules.dispatch(
    explorerActions.updateCwdSegment({
      explorerId,
      segmentIdx,
      selection: {
        reasonForLastSelectionChange: newValue,
      },
    }),
  );
}

export function setKeysOfSelectedResources(
  explorerId: string,
  segmentIdx: number,
  newValueOrUpdateFn: RenameHistoryKeys[] | UpdateFn<RenameHistoryKeys[]>,
): void {
  const currentSelection =
    globalThis.modules.store.getState().explorersSlice.explorerPanels[explorerId].cwdSegments[
      segmentIdx
    ].selection;

  let newValue;
  if (typeof newValueOrUpdateFn === 'function') {
    newValue = newValueOrUpdateFn(currentSelection.keysOfSelectedResources);
  } else {
    newValue = newValueOrUpdateFn;
  }

  globalThis.modules.dispatch(
    explorerActions.updateCwdSegment({
      explorerId,
      segmentIdx,
      selection: {
        keysOfSelectedResources: newValue,
        keyOfResourceSelectionGotStartedWith:
          newValue.length === 1
            ? newValue[0]
            : currentSelection.keyOfResourceSelectionGotStartedWith,
      },
    }),
  );
}

export function setActiveResourcesView(
  explorerId: string,
  segmentIdx: number,
  newValueOrUpdateFn: ResourcesView | UpdateFn<ResourcesView>,
): void {
  const currentValue =
    globalThis.modules.store.getState().explorersSlice.explorerPanels[explorerId].cwdSegments[
      segmentIdx
    ].activeResourcesView;

  let newValue;
  if (typeof newValueOrUpdateFn === 'function') {
    newValue = newValueOrUpdateFn(currentValue);
  } else {
    newValue = newValueOrUpdateFn;
  }

  globalThis.modules.dispatch(
    explorerActions.updateCwdSegment({ explorerId, segmentIdx, activeResourcesView: newValue }),
  );
}

export function setScrollTop(
  explorerId: string,
  segmentIdx: number,
  newValue: undefined | number,
): void {
  globalThis.modules.dispatch(
    explorerActions.updateCwdSegment({ explorerId, segmentIdx, scrollTop: newValue }),
  );
}

function findValidPasteTarget(
  targetFolder: IFileStat,
  resourceToPaste: { resource: UriComponents; isDirectory?: boolean; allowOverwrite: boolean },
): URI {
  let name = resources.basenameOrAuthority(URI.from(resourceToPaste.resource));
  let candidate = resources.joinPath(targetFolder.resource, name);

  if (
    resourceToPaste.allowOverwrite ||
    !targetFolder.children ||
    targetFolder.children.length === 0
  ) {
    return candidate;
  }

  const cmpFunction = (child: IFileStat) =>
    uriHelper.getComparisonKey(child.resource) === uriHelper.getComparisonKey(candidate);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const conflict = targetFolder.children.find(cmpFunction);
    if (!conflict) {
      break;
    }

    name = incrementResourceName(name, !!resourceToPaste.isDirectory);
    candidate = resources.joinPath(targetFolder.resource, name);
  }

  return candidate;
}

function incrementResourceName(name: string, isFolder: boolean): string {
  let namePrefix = name;
  let extSuffix = '';
  if (!isFolder) {
    extSuffix = extname(name);
    namePrefix = basename(name, extSuffix);
  }

  // name copy 5(.txt) => name copy 6(.txt)
  // name copy(.txt) => name copy 2(.txt)
  const suffixRegex = /^(.+ copy)( \d+)?$/;
  if (suffixRegex.test(namePrefix)) {
    return (
      namePrefix.replace(suffixRegex, (_, g1?, g2?: string) => {
        const number = g2 ? parseInt(g2) : 1;
        return number === 0
          ? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${g1}`
          : number < Constants.MAX_SAFE_SMALL_INTEGER
          ? // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${g1} ${number + 1}`
          : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `${g1}${g2} copy`;
      }) + extSuffix
    );
  }

  // name(.txt) => name copy(.txt)
  return `${namePrefix} copy${extSuffix}`;
}
