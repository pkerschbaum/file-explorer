import * as React from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { URI, UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from 'code-oss-file-service/out/vs/platform/files/common/files';
import { getIconClasses } from 'code-oss-file-icon-theme/out/vs/editor/common/services/getIconClasses';

import { createLogger } from '@app/base/logger/logger';
import { useNexFileSystem } from '@app/ui/NexFileSystem.context';
import { useSelector } from '@app/platform/store/store';
import { File, FILE_TYPE, PASTE_PROCESS_STATUS, PROCESS_TYPE, Tag } from '@app/platform/file-types';
import { mapFileStatToFile, NexFileSystem } from '@app/platform/logic/file-system';
import { uriHelper } from '@app/base/utils/uri-helper';
import { objects } from '@app/base/utils/objects.util';

const logger = createLogger('file-provider.hooks');

export const useFileProviderExplorers = () =>
  Object.entries(useSelector((state) => state.fileProvider.explorers)).map(
    ([explorerId, value]) => ({
      explorerId,
      ...value,
    }),
  );

export const useFileProviderCwd = (explorerId: string) =>
  useSelector((state) => state.fileProvider.explorers[explorerId].cwd);

export const useFileProviderFocusedExplorerId = () =>
  useSelector((state) => state.fileProvider.focusedExplorerId);

export const useFileProviderDraftPasteState = () =>
  useSelector((state) => state.fileProvider.draftPasteState);

export const useFileProviderProcesses = () =>
  useSelector((state) => state.fileProvider.processes).map((process) => {
    if (process.type === PROCESS_TYPE.PASTE) {
      return {
        ...process,
        bytesProcessed:
          process.status === PASTE_PROCESS_STATUS.SUCCESS
            ? process.totalSize
            : process.bytesProcessed,
      };
    }

    return process;
  });

export const QUERY_KEYS = {
  FILES: (directory: string, options: { resolveMetadata?: boolean }) => [
    'files',
    directory,
    options,
  ],
};

async function fetchFiles(
  fileSystem: NexFileSystem,
  directory: UriComponents,
  resolveMetadata: boolean,
) {
  const statsWithMetadata = await fileSystem.resolve(URI.from(directory), { resolveMetadata });

  if (!statsWithMetadata.children) {
    return [];
  }
  return statsWithMetadata.children.map(mapFileStatToFile);
}

function useFiles(
  {
    directory,
    resolveMetadata,
  }: {
    directory: UriComponents;
    resolveMetadata: boolean;
  },
  queryOptions?: { disabled?: boolean },
) {
  const fileSystem = useNexFileSystem();

  const filesQuery = useQuery(
    QUERY_KEYS.FILES(URI.from(directory).toString(), { resolveMetadata }),
    () => fetchFiles(fileSystem, directory, resolveMetadata),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      ...queryOptions,
    },
  );

  return filesQuery;
}

export function useRefreshFiles() {
  const queryClient = useQueryClient();
  return React.useCallback(
    async (directory: UriComponents) => {
      await queryClient.refetchQueries(['files', URI.from(directory).toString()]);
    },
    [queryClient],
  );
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
export const useFileProviderFiles = (explorerId: string): FilesLoadingResult => {
  const fileSystem = useNexFileSystem();
  const queryClient = useQueryClient();

  const cwd = useSelector((state) => state.fileProvider.explorers[explorerId].cwd);
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

      async function doPreloadContents() {
        await Promise.all(
          filesQueryWithMetadataData!
            .filter((file) => file.fileType === FILE_TYPE.DIRECTORY)
            .filter((file) => {
              const cachedQueryData = queryClient.getQueryData(
                QUERY_KEYS.FILES(URI.from(file.uri).toString(), {}),
                { exact: false },
              );
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

              const contents = await fetchFiles(fileSystem, file.uri, false);

              const cachedQueryData = queryClient.getQueryData(
                QUERY_KEYS.FILES(URI.from(file.uri).toString(), {}),
                { exact: false },
              );
              if (cachedQueryData) {
                // in the meantime, some data for this query got loaded --> don't alter that data
                return;
              }

              queryClient.setQueryData(
                QUERY_KEYS.FILES(URI.from(file.uri).toString(), { resolveMetadata: false }),
                contents,
              );
            }),
        );
      }

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
    [filesQueryWithMetadataData, filesQueryWithMetadataIsFetching, cwd, fileSystem, queryClient],
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

      const iconClasses = window.preload.fileIconTheme.getIconClasses(URI.from(file.uri), fileType);

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
