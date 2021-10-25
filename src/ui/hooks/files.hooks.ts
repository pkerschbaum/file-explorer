import * as React from 'react';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { createLogger } from '@app/base/logger/logger';
import { uriHelper } from '@app/base/utils/uri-helper';
import { File, FileForUI, FILE_TYPE } from '@app/domain/types';
import { useFileIconClasses } from '@app/global-cache/file-icon-classes';
import { useFiles, getCachedQueryData, setCachedQueryData } from '@app/global-cache/files';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { fileSystemRef } from '@app/operations/global-modules';
import { fetchFiles } from '@app/platform/file-system';

const logger = createLogger('files.hooks');

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
    { enabled: filesQueryWithMetadataData === undefined },
  );

  React.useEffect(
    function preloadContentOfParentAndAllSubDirectories() {
      if (filesQueryWithMetadataData === undefined || filesQueryWithMetadataIsFetching) {
        return;
      }

      const doPreloadContents = async () => {
        const parentDirectoryUri = URI.joinPath(URI.from(cwd), '..');
        const subDirectoriesUris = filesQueryWithMetadataData
          .filter((file) => file.fileType === FILE_TYPE.DIRECTORY)
          .map((file) => file.uri);
        const allDirectoriesUris = [parentDirectoryUri, ...subDirectoriesUris];

        await Promise.all(
          allDirectoriesUris
            .filter((uri) => {
              const cachedQueryData = getCachedQueryData(uri);
              if (cachedQueryData) {
                logger.debug(
                  `some data is already cached --> skip preloading of directory content`,
                  {
                    fileUri: URI.from(uri).toString(),
                  },
                );
                return false;
              }
              return true;
            })
            .map(async (uri) => {
              logger.debug(`start preloading of directory content`, {
                fileUri: URI.from(uri).toString(),
              });

              const contents = await fetchFiles(fileSystemRef.current, uri, false);

              const cachedQueryData = getCachedQueryData(uri);
              if (cachedQueryData) {
                // in the meantime, some data for this query got loaded --> don't alter that data
                return;
              }

              setCachedQueryData(uri, contents);
            }),
        );
      };

      let preloadingIsNotNeccessaryAnymore = false;
      requestIdleCallback(() => {
        if (preloadingIsNotNeccessaryAnymore) {
          logger.debug(`skipped preloading contents of parent and sub directories`, {
            uriContentsGetPreloadedFor: URI.from(cwd).toString(),
          });
        }

        logger.debug(`preloading contents of parent and sub directories`, {
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

  let dataAvailable: boolean;
  let filesToUse: File[];
  if (filesQueryWithMetadataData !== undefined) {
    dataAvailable = true;
    filesToUse = filesQueryWithMetadataData;
  } else if (filesQueryWithoutMetadataData !== undefined) {
    dataAvailable = true;
    filesToUse = filesQueryWithoutMetadataData;
  } else {
    // files queries do not have any (possibly cached) data yet
    dataAvailable = false;
    filesToUse = [];
  }

  const filesForUI = React.useMemo(
    () =>
      filesToUse.map((file) => {
        const { fileName, extension } = uriHelper.extractNameAndExtension(file.uri);

        const fileForUI: FileForUI = {
          ...file,
          extension,
          name: fileName,
          tags: [],
        };
        return fileForUI;
      }),
    [filesToUse],
  );

  return { dataAvailable, files: filesForUI };
};

export function useThemeFileIconClasses(file: FileForUI) {
  const iconClasses = useFileIconClasses({
    uri: file.uri,
    fileKind: mapFileTypeToFileKind(file.fileType),
  });

  return iconClasses?.join(' ');
}

function mapFileTypeToFileKind(fileType: FILE_TYPE) {
  if (fileType === FILE_TYPE.FILE) {
    return FileKind.FILE;
  } else if (fileType === FILE_TYPE.DIRECTORY) {
    return FileKind.FOLDER;
  } else {
    logger.warn(`could not map FILE_TYPE to FileKind, fallback to FileKind.FILE`, { fileType });
    return FileKind.FILE;
  }
}
