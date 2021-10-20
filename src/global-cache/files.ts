import { useQuery } from 'react-query';

import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { File } from '@app/domain/types';
import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fileSystemRef, queryClientRef } from '@app/operations/global-modules';
import { fetchFiles } from '@app/platform/file-system';

export function useFiles(
  {
    directory,
    resolveMetadata,
  }: {
    directory: UriComponents;
    resolveMetadata: boolean;
  },
  queryOptions?: { enabled?: boolean },
) {
  const filesQuery = useQuery(
    QUERY_KEYS.FILES_WITH_OPTIONS(URI.from(directory).toString(), { resolveMetadata }),
    () => fetchFiles(fileSystemRef.current, directory, resolveMetadata),
    queryOptions,
  );

  return filesQuery;
}

export async function refreshFiles(directory: UriComponents) {
  await queryClientRef.current.refetchQueries(QUERY_KEYS.FILES(URI.from(directory).toString()));
}

export function getCachedQueryData(file: File) {
  return queryClientRef.current.getQueryData(
    QUERY_KEYS.FILES_WITH_OPTIONS(URI.from(file.uri).toString(), {}),
    {
      exact: false,
    },
  );
}

export function setCachedQueryData(file: File, contents: File[]) {
  return queryClientRef.current.setQueryData(
    QUERY_KEYS.FILES_WITH_OPTIONS(URI.from(file.uri).toString(), { resolveMetadata: false }),
    contents,
  );
}
