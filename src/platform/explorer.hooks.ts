import * as resources from 'code-oss-file-service/out/vs/base/common/resources';
import * as uuid from 'code-oss-file-service/out/vs/base/common/uuid';
import { extname, basename } from 'code-oss-file-service/out/vs/base/common/path';
import type { ProgressCbArgs } from 'code-oss-file-service/out/vs/base/common/resources';
import { Constants } from 'code-oss-file-service/out/vs/base/common/uint';
import { isLinux } from 'code-oss-file-service/out/vs/base/common/platform';
import { URI, UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';
import { CancellationTokenSource } from 'code-oss-file-service/out/vs/base/common/cancellation';
import { Schemas } from 'code-oss-file-service/out/vs/base/common/network';
import { IFileStat } from 'code-oss-file-service/out/vs/platform/files/common/files';

import { actions } from '@app/platform/store/file-provider/file-provider.slice';
import { useNexFileSystem } from '@app/ui/NexFileSystem.context';
import { useClipboardResources } from '@app/ui/NexClipboard.context';
import { useDispatch } from '@app/platform/store/store';
import { PASTE_PROCESS_STATUS } from '@app/platform/file-types';
import { createLogger } from '@app/base/logger/logger';
import { CustomError } from '@app/base/custom-error';
import {
  useFileProviderCwd,
  useFileProviderDraftPasteState,
  useRefreshFiles,
} from '@app/platform/store/file-provider/file-provider.hooks';
import {
  executeCopyOrMove,
  useAddTags,
  useGetTagsOfFile,
  useRemoveTags,
  useResolveDeep,
} from '@app/platform/file.hooks';
import { uriHelper } from '@app/base/utils/uri-helper';
import { objects } from '@app/base/utils/objects.util';

const UPDATE_INTERVAL_MS = 500;
const logger = createLogger('explorer.hooks');

export function useChangeDirectory(explorerId: string) {
  const dispatch = useDispatch();
  const cwd = useFileProviderCwd(explorerId);

  const fileSystem = useNexFileSystem();

  const refreshFiles = useRefreshFiles();

  async function changeDirectory(newDir: string) {
    const parsedUri = uriHelper.parseUri(Schemas.file, newDir);

    // check if the directory is a valid directory (i.e., is a URI-parsable string, and the directory is accessible)
    if (!parsedUri) {
      throw Error(
        `could not change directory, reason: path is not a valid directory. path: ${newDir}`,
      );
    }
    const stats = await fileSystem.resolve(parsedUri);
    if (!stats.isDirectory) {
      throw Error(
        `could not change directory, reason: uri is not a valid directory. uri: ${parsedUri}`,
      );
    }

    // change to the new directory and reload files
    const newCwd = parsedUri.toJSON();
    dispatch(actions.changeCwd({ explorerId, newCwd }));
    await refreshFiles(cwd);
  }

  return {
    changeDirectory,
  };
}

export function usePasteFiles(explorerId: string) {
  const dispatch = useDispatch();
  const cwd = useFileProviderCwd(explorerId);
  const draftPasteState = useFileProviderDraftPasteState();

  const fileSystem = useNexFileSystem();
  const clipboardResources = useClipboardResources();

  const refreshFiles = useRefreshFiles();
  const { resolveDeep } = useResolveDeep();
  const { getTagsOfFile } = useGetTagsOfFile();
  const { addTags } = useAddTags();
  const { removeTags } = useRemoveTags();

  async function pasteFiles() {
    if (clipboardResources.length === 0 || draftPasteState === undefined) {
      return;
    }

    const destinationFolder = URI.from(cwd);
    const destinationFolderStat = await fileSystem.resolve(destinationFolder);
    const id = uuid.generateUuid();
    const cancellationTokenSource = new CancellationTokenSource();

    // clear draft paste state (neither cut&paste nor copy&paste is designed to be repeatable)
    dispatch(actions.clearDraftPasteState());

    // add the paste process about to start
    dispatch(
      actions.addPasteProcess({
        id,
        pasteShouldMove: draftPasteState.pasteShouldMove,
        sourceUris: clipboardResources.map((resource) => resource.toJSON()),
        destinationFolder: destinationFolder.toJSON(),
        cancellationTokenSource,
      }),
    );

    // register listener on cancellation token so that if cancellation gets requested, "ABORT_REQUESTED" state gets dispatched
    cancellationTokenSource.token.onCancellationRequested(() => {
      dispatch(actions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_REQUESTED }));
    });

    // for each file/folder to paste, check for some required conditions and prepare target URI
    const pasteInfos = (
      await Promise.all(
        clipboardResources.map(async (sourceFileURI) => {
          // Destination folder must not be a subfolder of any source file/folder. Imagine copying
          // a folder "test" and paste it (and its content) *into* itself, that would not work.
          if (
            destinationFolder.toString() !== sourceFileURI.toString() &&
            resources.isEqualOrParent(destinationFolder, sourceFileURI, !isLinux /* ignorecase */)
          ) {
            throw new CustomError('The destination folder is a subfolder of the source file', {
              destinationFolder,
              sourceFileURI,
            });
          }

          let sourceFileStat;
          try {
            sourceFileStat = await fileSystem.resolve(sourceFileURI, { resolveMetadata: true });
          } catch (err: unknown) {
            logger.error(
              'error during file paste process, source file was probably deleted or moved meanwhile',
              err,
            );
            return;
          }

          const targetFileURI = findValidPasteFileTarget(destinationFolderStat, {
            resource: sourceFileURI,
            isDirectory: sourceFileStat.isDirectory,
            allowOverwrite: false,
          });

          return { sourceFileURI, sourceFileStat, targetFileURI };
        }),
      )
    ).filter(objects.isNotNullish);

    // if cancellation was requested in the meantime, abort paste process
    if (cancellationTokenSource.token.isCancellationRequested) {
      dispatch(actions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }));
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
        const { sourceFileURI, sourceFileStat } = pasteInfo;

        const fileStatMap = await resolveDeep(sourceFileURI, sourceFileStat);

        Object.entries(fileStatMap).forEach(([uri, fileStat]) => {
          totalSize += fileStat.size;
          statusPerFile[uri] = { bytesProcessed: 0 };
        });
      }),
    );

    // if cancellation was requested in the meantime, abort paste process
    if (cancellationTokenSource.token.isCancellationRequested) {
      dispatch(actions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }));
      return;
    }

    dispatch(
      actions.updatePasteProcess({
        id,
        status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
        totalSize,
        bytesProcessed,
        progressOfAtLeastOneSourceIsIndeterminate,
      }),
    );
    dispatch(
      actions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE }),
    );

    // perform paste
    function progressCb(progressArgs: ProgressCbArgs) {
      if ('newBytesRead' in progressArgs && progressArgs.newBytesRead !== undefined) {
        bytesProcessed += progressArgs.newBytesRead;
        statusPerFile[progressArgs.forSource.toString()].bytesProcessed +=
          progressArgs.newBytesRead;
      }
      if ('progressIsIndeterminate' in progressArgs && progressArgs.progressIsIndeterminate) {
        progressOfAtLeastOneSourceIsIndeterminate = true;
      }
    }
    const intervalId = setInterval(function dispatchProgress() {
      dispatch(
        actions.updatePasteProcess({
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
            fileTagActions: { getTagsOfFile, addTags, removeTags },
            fileSystem,
            refreshFiles,
          }),
        ),
      );

      if (!cancellationTokenSource.token.isCancellationRequested) {
        dispatch(actions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.SUCCESS }));
      } else {
        dispatch(actions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_SUCCESS }));
      }
    } catch (err: unknown) {
      dispatch(
        actions.updatePasteProcess({
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

  return {
    pasteFiles,
  };
}

export function useCreateFolder(explorerId: string) {
  const cwd = useFileProviderCwd(explorerId);

  const fileSystem = useNexFileSystem();

  const refreshFiles = useRefreshFiles();

  async function createFolder(folderName: string) {
    // create folder
    const folderUri = URI.joinPath(URI.from(cwd), folderName);
    await fileSystem.createFolder(folderUri);

    // invalidate files of the target directory
    await refreshFiles(cwd);
  }

  return {
    createFolder,
  };
}

export function useRevealCwdInOSExplorer(explorerId: string) {
  const cwd = useFileProviderCwd(explorerId);

  const fileSystem = useNexFileSystem();

  function revealCwdInOSExplorer() {
    fileSystem.revealResourcesInOS([cwd]);
  }

  return {
    revealCwdInOSExplorer,
  };
}

function findValidPasteFileTarget(
  targetFolder: IFileStat,
  fileToPaste: { resource: UriComponents; isDirectory?: boolean; allowOverwrite: boolean },
): URI {
  let name = resources.basenameOrAuthority(URI.from(fileToPaste.resource));
  let candidate = resources.joinPath(targetFolder.resource, name);

  if (fileToPaste.allowOverwrite || !targetFolder.children || targetFolder.children.length === 0) {
    return candidate;
  }

  const cmpFunction = (child: IFileStat) => child.resource.toString() === candidate.toString();

  while (true) {
    const conflict = targetFolder.children.find(cmpFunction);
    if (!conflict) {
      break;
    }

    name = incrementFileName(name, !!fileToPaste.isDirectory);
    candidate = resources.joinPath(targetFolder.resource, name);
  }

  return candidate;
}

function incrementFileName(name: string, isFolder: boolean): string {
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
      namePrefix.replace(suffixRegex, (_, g1?, g2?) => {
        const number = g2 ? parseInt(g2) : 1;
        return number === 0
          ? `${g1}`
          : number < Constants.MAX_SAFE_SMALL_INTEGER
          ? `${g1} ${number + 1}`
          : `${g1}${g2} copy`;
      }) + extSuffix
    );
  }

  // name(.txt) => name copy(.txt)
  return `${namePrefix} copy${extSuffix}`;
}
