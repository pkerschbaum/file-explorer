import * as React from 'react';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { createLogger } from '@app/base/logger/logger';
import { uriHelper } from '@app/base/utils/uri-helper';
import { FileForUI, FILE_TYPE } from '@app/domain/types';
import { useFiles, getCachedQueryData, setCachedQueryData } from '@app/global-cache/files';
import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { fileIconThemeRef, fileSystemRef } from '@app/operations/global-modules';
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

  const filesForUI = filesToUse.map((file) => {
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
