import * as React from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { URI, UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';

import { File } from '@app/domain/types';
import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fetchFiles } from '@app/platform/file-system';
import { useNexFileSystem } from '@app/ui/NexFileSystem.context';

export function useFiles(
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
    QUERY_KEYS.FILES_WITH_OPTIONS(URI.from(directory).toString(), { resolveMetadata }),
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
      await queryClient.refetchQueries(QUERY_KEYS.FILES(URI.from(directory).toString()));
    },
    [queryClient],
  );
}

export function useCachedQueryData() {
  const queryClient = useQueryClient();

  return React.useMemo(
    () => ({
      getCachedQueryData: (file: File) =>
        queryClient.getQueryData(QUERY_KEYS.FILES_WITH_OPTIONS(URI.from(file.uri).toString(), {}), {
          exact: false,
        }),
      setCachedQueryData: (file: File, contents: File[]) =>
        queryClient.setQueryData(
          QUERY_KEYS.FILES_WITH_OPTIONS(URI.from(file.uri).toString(), { resolveMetadata: false }),
          contents,
        ),
    }),
    [queryClient],
  );
}
