import * as React from 'react';

import * as resources from 'code-oss-file-service/out/vs/base/common/resources';
import * as uuid from 'code-oss-file-service/out/vs/base/common/uuid';
import { extname, basename } from 'code-oss-file-service/out/vs/base/common/path';
import type { ProgressCbArgs } from 'code-oss-file-service/out/vs/base/common/resources';
import { Constants } from 'code-oss-file-service/out/vs/base/common/uint';
import { isLinux } from 'code-oss-file-service/out/vs/base/common/platform';
import { URI, UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';
import { CancellationTokenSource } from 'code-oss-file-service/out/vs/base/common/cancellation';
import { Schemas } from 'code-oss-file-service/out/vs/base/common/network';
import { IFileStat, FileKind } from 'code-oss-file-service/out/vs/platform/files/common/files';

import { actions as explorerActions } from '@app/global-state/slices/explorers.slice';
import { actions as processesActions } from '@app/global-state/slices/processes.slice';
import {
  clipboardRef,
  dispatchRef,
  fileIconThemeRef,
  fileSystemRef,
  nativeHostRef,
  storeRef,
} from '@app/operations/global-modules';
import { fetchFiles } from '@app/platform/file-system';
import { File, FILE_TYPE, PASTE_PROCESS_STATUS, Tag } from '@app/domain/types';
import { createLogger } from '@app/base/logger/logger';
import { CustomError } from '@app/base/custom-error';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import {
  useFiles,
  refreshFiles,
  getCachedQueryData,
  setCachedQueryData,
} from '@app/global-cache/files';
import { executeCopyOrMove, resolveDeep } from '@app/operations/file.hooks';
import { uriHelper } from '@app/base/utils/uri-helper';
import { objects } from '@app/base/utils/objects.util';

const UPDATE_INTERVAL_MS = 500;
const logger = createLogger('explorer.hooks');

export async function changeDirectory(explorerId: string, newDir: string) {
  const parsedUri = uriHelper.parseUri(Schemas.file, newDir);

  // check if the directory is a valid directory (i.e., is a URI-parsable string, and the directory is accessible)
  if (!parsedUri) {
    throw Error(
      `could not change directory, reason: path is not a valid directory. path: ${newDir}`,
    );
  }
  const stats = await fileSystemRef.current.resolve(parsedUri);
  if (!stats.isDirectory) {
    throw Error(
      `could not change directory, reason: uri is not a valid directory. uri: ${parsedUri.toString()}`,
    );
  }

  // change to the new directory and reload files
  const newCwd = parsedUri.toJSON();
  dispatchRef.current(explorerActions.changeCwd({ explorerId, newCwd }));
  await refreshFiles(newCwd);
}

export async function pasteFiles(explorerId: string) {
  const clipboardResources = clipboardRef.current.readResources();
  const draftPasteState = storeRef.current.getState().processesSlice.draftPasteState;
  if (clipboardResources.length === 0 || draftPasteState === undefined) {
    return;
  }

  const cwd = storeRef.current.getState().explorersSlice.explorers[explorerId].cwd;
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
      destinationFolder: destinationFolder.toJSON(),
      cancellationTokenSource,
    }),
  );

  // register listener on cancellation token so that if cancellation gets requested, "ABORT_REQUESTED" state gets dispatched
  cancellationTokenSource.token.onCancellationRequested(() => {
    dispatchRef.current(
      processesActions.updatePasteProcess({ id, status: PASTE_PROCESS_STATUS.ABORT_REQUESTED }),
    );
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
          sourceFileStat = await fileSystemRef.current.resolve(sourceFileURI, {
            resolveMetadata: true,
          });
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
      statusPerFile[progressArgs.forSource.toString()].bytesProcessed += progressArgs.newBytesRead;
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
          refreshFiles,
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
  const cwd = storeRef.current.getState().explorersSlice.explorers[explorerId].cwd;

  // create folder
  const folderUri = URI.joinPath(URI.from(cwd), folderName);
  await fileSystemRef.current.createFolder(folderUri);

  // invalidate files of the target directory
  await refreshFiles(cwd);
}

export function revealCwdInOSExplorer(explorerId: string) {
  const cwd = storeRef.current.getState().explorersSlice.explorers[explorerId].cwd;
  nativeHostRef.current.revealResourcesInOS([cwd]);
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

  // eslint-disable-next-line no-constant-condition
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

export type FileForUI = File & {
  name: string;
  extension?: string;
  tags: Tag[];
  iconClasses: string[];
};
type FilesLoadingResult =
  | {
      dataAvailable: false;
      files: FileForUI[];
    }
  | {
      dataAvailable: true;
      files: FileForUI[];
    };
export const useFilesForUI = (explorerId: string): FilesLoadingResult => {
  const cwd = useCwd(explorerId);
  const { data: filesQueryWithMetadataData, isFetching: filesQueryWithMetadataIsFetching } =
    useFiles({ directory: cwd, resolveMetadata: true });
  const { data: filesQueryWithoutMetadataData } = useFiles(
    { directory: cwd, resolveMetadata: false },
    { disabled: filesQueryWithMetadataData !== undefined },
  );

  React.useEffect(
    function preloadContentOfAllSubDirectories() {
      if (filesQueryWithMetadataData === undefined || filesQueryWithMetadataIsFetching) {
        return;
      }

      const doPreloadContents = async () => {
        await Promise.all(
          filesQueryWithMetadataData
            .filter((file) => file.fileType === FILE_TYPE.DIRECTORY)
            .filter((file) => {
              const cachedQueryData = getCachedQueryData(file);
              if (cachedQueryData) {
                logger.debug(
                  `some data is already cached --> skip preloading of directory content`,
                  {
                    fileUri: URI.from(file.uri).toString(),
                  },
                );
                return false;
              }
              return true;
            })
            .map(async (file) => {
              logger.debug(`start preloading of directory content`, {
                fileUri: URI.from(file.uri).toString(),
              });

              const contents = await fetchFiles(fileSystemRef.current, file.uri, false);

              const cachedQueryData = getCachedQueryData(file);
              if (cachedQueryData) {
                // in the meantime, some data for this query got loaded --> don't alter that data
                return;
              }

              setCachedQueryData(file, contents);
            }),
        );
      };

      let preloadingIsNotNeccessaryAnymore = false;
      requestIdleCallback(() => {
        if (preloadingIsNotNeccessaryAnymore) {
          logger.debug(`skipped preloading contents of sub directories`, {
            uriContentsGetPreloadedFor: URI.from(cwd).toString(),
          });
        }

        logger.debug(`preloading contents of sub directories`, {
          uriContentsGetPreloadedFor: URI.from(cwd).toString(),
        });
        void doPreloadContents();
      });

      return () => {
        preloadingIsNotNeccessaryAnymore = true;
      };
    },
    [filesQueryWithMetadataData, filesQueryWithMetadataIsFetching, cwd],
  );

  let filesToUse;
  if (filesQueryWithMetadataData !== undefined) {
    filesToUse = filesQueryWithMetadataData;
  }

  if (filesToUse === undefined && filesQueryWithoutMetadataData !== undefined) {
    filesToUse = filesQueryWithoutMetadataData;
  }

  if (filesToUse === undefined) {
    // files queries do not have any (possibly cached) data yet
    return { dataAvailable: false, files: [] };
  }

  const filesForUI = Object.values(filesToUse)
    .filter(objects.isNotNullish)
    .map((file) => {
      const { fileName, extension } = uriHelper.extractNameAndExtension(file.uri);
      const fileType = mapFileTypeToFileKind(file.fileType);

      const iconClasses = fileIconThemeRef.current.getIconClasses(URI.from(file.uri), fileType);

      const fileForUI: FileForUI = {
        ...file,
        extension,
        iconClasses,
        name: fileName,
        tags: [],
      };
      return fileForUI;
    });

  return { dataAvailable: true, files: filesForUI };
};

function mapFileTypeToFileKind(fileType: FILE_TYPE) {
  if (fileType === FILE_TYPE.FILE) {
    return FileKind.FILE;
  } else if (fileType === FILE_TYPE.DIRECTORY) {
    return FileKind.FOLDER;
  } else {
    return undefined;
  }
}
