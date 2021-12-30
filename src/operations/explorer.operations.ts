import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import { extname, basename } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { isLinux } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import type { ProgressCbArgs } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { Constants } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uint';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as uuid from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uuid';
import { IFileStat } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { CustomError } from '@app/base/custom-error';
import { check } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { PASTE_PROCESS_STATUS, ResourceForUI, RESOURCE_TYPE, UpdateFn } from '@app/domain/types';
import { refreshResourcesOfDirectory } from '@app/global-cache/resources';
import { extractCwdFromExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import {
  actions as explorerActions,
  RenameHistoryKeys,
  ResourcesView,
} from '@app/global-state/slices/explorers.slice';
import { actions as processesActions } from '@app/global-state/slices/processes.slice';
import { createLogger } from '@app/operations/create-logger';
import {
  dispatchRef,
  fileSystemRef,
  nativeHostRef,
  storeRef,
} from '@app/operations/global-modules';
import { executeCopyOrMove, openFiles, resolveDeep } from '@app/operations/resource.operations';

const UPDATE_INTERVAL_MS = 500;
const logger = createLogger('explorer.hooks');

export async function openResources(explorerId: string, resources: ResourceForUI[]) {
  if (resources.length === 1 && resources[0].resourceType === RESOURCE_TYPE.DIRECTORY) {
    await changeDirectory(explorerId, URI.from(resources[0].uri));
  } else {
    await openFiles(
      resources
        .filter((resource) => resource.resourceType === RESOURCE_TYPE.FILE)
        .map((resource) => resource.uri),
    );
  }
}

export async function changeDirectory(explorerId: string, newCwd: UriComponents) {
  const stats = await fileSystemRef.current.resolve(URI.from(newCwd));
  if (!stats.isDirectory) {
    throw Error(
      `could not change directory, reason: uri is not a valid directory. uri: ${formatter.resourcePath(
        newCwd,
      )}`,
    );
  }

  // change to the new directory and refresh resources of that directory
  dispatchRef.current(explorerActions.changeCwd({ explorerId, newCwd }));
  await refreshResourcesOfDirectory({ directory: newCwd });
}

export async function pasteResources(explorerId: string) {
  const clipboardResources = nativeHostRef.current.clipboard
    .readResources()
    .map((r) => URI.from(r));
  const draftPasteState = storeRef.current.getState().processesSlice.draftPasteState;
  if (clipboardResources.length === 0 || draftPasteState === undefined) {
    return;
  }

  const cwd = extractCwdFromExplorerPanel(
    storeRef.current.getState().explorersSlice.explorerPanels[explorerId],
  );
  const destinationFolder = URI.from(cwd);
  const destinationFolderStat = await fileSystemRef.current.resolve(destinationFolder);
  const id = uuid.generateUuid();
  const cancellationTokenSource = new CancellationTokenSource();

  // clear draft paste state (neither cut&paste nor copy&paste is designed to be repeatable)
  dispatchRef.current(processesActions.clearDraftPasteState());

  // add the paste process about to start
  dispatchRef.current(
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
    dispatchRef.current(
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
          fileStatOfSourceResource = await fileSystemRef.current.resolve(uriOfSourceResource, {
            resolveMetadata: true,
          });
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
    dispatchRef.current(
      processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }),
    );
    return;
  }

  // after target URI got prepared, initialize paste status fields and gather totalSize
  let totalSize = 0;
  let bytesProcessed = 0;
  let progressOfAtLeastOneSourceIsIndeterminate = false;
  const statusPerFile: {
    [uri: string]: { bytesProcessed: number };
  } = {};

  await Promise.all(
    pasteInfos.map(async (pasteInfo) => {
      const { sourceResource } = pasteInfo;

      const fileStatMap = await resolveDeep(sourceResource.uri, sourceResource.fileStat);

      Object.entries(fileStatMap).forEach(([uri, fileStat]) => {
        totalSize += fileStat.size;
        statusPerFile[uri] = { bytesProcessed: 0 };
      });
    }),
  );

  // if cancellation was requested in the meantime, abort paste process
  if (cancellationTokenSource.token.isCancellationRequested) {
    dispatchRef.current(
      processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }),
    );
    return;
  }

  dispatchRef.current(
    processesActions.updatePasteProcess({
      id,
      status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
      totalSize,
      bytesProcessed,
      progressOfAtLeastOneSourceIsIndeterminate,
    }),
  );
  dispatchRef.current(
    processesActions.updatePasteProcess({
      id,
      status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
    }),
  );

  // perform paste
  function progressCb(progressArgs: ProgressCbArgs) {
    if ('newBytesRead' in progressArgs && progressArgs.newBytesRead !== undefined) {
      bytesProcessed += progressArgs.newBytesRead;
      statusPerFile[uriHelper.getComparisonKey(progressArgs.forSource)].bytesProcessed +=
        progressArgs.newBytesRead;
    }
    if ('progressIsIndeterminate' in progressArgs && progressArgs.progressIsIndeterminate) {
      progressOfAtLeastOneSourceIsIndeterminate = true;
    }
  }
  const intervalId = setInterval(function dispatchProgress() {
    dispatchRef.current(
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
          progressCb,
        }),
      ),
    );

    if (!cancellationTokenSource.token.isCancellationRequested) {
      dispatchRef.current(
        processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.SUCCESS }),
      );
    } else {
      dispatchRef.current(
        processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }),
      );
    }
  } catch (err: unknown) {
    dispatchRef.current(
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

export async function createFolder(explorerId: string, folderName: string) {
  const cwd = extractCwdFromExplorerPanel(
    storeRef.current.getState().explorersSlice.explorerPanels[explorerId],
  );
  const folderUri = URI.joinPath(URI.from(cwd), folderName);
  await fileSystemRef.current.createFolder(folderUri);

  // refresh resources of the target directory
  await refreshResourcesOfDirectory({ directory: cwd });
}

export async function revealCwdInOSExplorer(explorerId: string) {
  const cwd = extractCwdFromExplorerPanel(
    storeRef.current.getState().explorersSlice.explorerPanels[explorerId],
  );
  await nativeHostRef.current.shell.revealResourcesInOS([cwd]);
}

export function setFilterInput(explorerId: string, segmentIdx: number, newValue: string): void {
  dispatchRef.current(
    explorerActions.updateCwdSegment({ explorerId, segmentIdx, filterInput: newValue }),
  );
}

export function setKeysOfSelectedResources(
  explorerId: string,
  segmentIdx: number,
  newValueOrUpdateFn: RenameHistoryKeys[] | UpdateFn<RenameHistoryKeys[]>,
): void {
  const currentSelection =
    storeRef.current.getState().explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx]
      .selection;

  let newValue;
  if (typeof newValueOrUpdateFn === 'function') {
    newValue = newValueOrUpdateFn(currentSelection.keysOfSelectedResources);
  } else {
    newValue = newValueOrUpdateFn;
  }

  dispatchRef.current(
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
    storeRef.current.getState().explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx]
      .activeResourcesView;

  let newValue;
  if (typeof newValueOrUpdateFn === 'function') {
    newValue = newValueOrUpdateFn(currentValue);
  } else {
    newValue = newValueOrUpdateFn;
  }

  dispatchRef.current(
    explorerActions.updateCwdSegment({ explorerId, segmentIdx, activeResourcesView: newValue }),
  );
}

export function setScrollTop(
  explorerId: string,
  segmentIdx: number,
  newValue: undefined | number,
): void {
  dispatchRef.current(
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
