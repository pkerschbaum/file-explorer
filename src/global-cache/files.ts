import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { useQuery } from 'react-query';

import { uriHelper } from '@app/base/utils/uri-helper';
import { File } from '@app/domain/types';
import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fileSystemRef, queryClientRef } from '@app/operations/global-modules';
import { fetchFiles } from '@app/platform/file-system';

type FilesQuery = {
  directory: UriComponents;
  resolveMetadata: boolean;
};

export function useFiles(
  { directory, resolveMetadata }: FilesQuery,
  queryOptions?: { enabled?: boolean },
) {
  const filesQuery = useQuery(
    QUERY_KEYS.DIRECTORY_CONTENT({
      directoryId: uriHelper.getComparisonKey(directory),
      resolveMetadata,
    }),
    () => fetchFiles(fileSystemRef.current, { directory, resolveMetadata }),
    queryOptions,
  );

  return filesQuery;
}

export async function refreshDirectoryContent(
  { directory }: Omit<FilesQuery, 'resolveMetadata'>,
  filter?: { active?: boolean },
) {
  await queryClientRef.current.refetchQueries(
    QUERY_KEYS.DIRECTORY_CONTENT({ directoryId: uriHelper.getComparisonKey(directory) }),
    {
      exact: false,
      active: filter?.active,
    },
  );
}

export function getCachedQueryData({ directory }: Omit<FilesQuery, 'resolveMetadata'>) {
  return queryClientRef.current.getQueryData(
    QUERY_KEYS.DIRECTORY_CONTENT({ directoryId: uriHelper.getComparisonKey(directory) }),
    {
      exact: false,
    },
  );
}

export function setCachedQueryData({ directory, resolveMetadata }: FilesQuery, contents: File[]) {
  return queryClientRef.current.setQueryData(
    QUERY_KEYS.DIRECTORY_CONTENT({
      directoryId: uriHelper.getComparisonKey(directory),
      resolveMetadata,
    }),
    contents,
  );
}
