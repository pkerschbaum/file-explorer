import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { useQuery } from 'react-query';

import { uriHelper } from '@app/base/utils/uri-helper';
import { Resource } from '@app/domain/types';
import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fileSystemRef, queryClientRef } from '@app/operations/global-modules';
import { fetchResources } from '@app/platform/file-system';

type ResourcesQuery = {
  directory: UriComponents;
  resolveMetadata: boolean;
};

export function useResources(
  { directory, resolveMetadata }: ResourcesQuery,
  queryOptions?: { enabled?: boolean },
) {
  const resourcesQuery = useQuery(
    QUERY_KEYS.RESOURCES_OF_DIRECTORY({
      directoryId: uriHelper.getComparisonKey(directory),
      resolveMetadata,
    }),
    () => fetchResources(fileSystemRef.current, { directory, resolveMetadata }),
    queryOptions,
  );

  return resourcesQuery;
}

export async function refreshResourcesOfDirectory(
  { directory }: Omit<ResourcesQuery, 'resolveMetadata'>,
  filter?: { active?: boolean },
) {
  await queryClientRef.current.refetchQueries(
    QUERY_KEYS.RESOURCES_OF_DIRECTORY({ directoryId: uriHelper.getComparisonKey(directory) }),
    {
      exact: false,
      active: filter?.active,
    },
  );
}

export function getCachedResourcesOfDirectory({
  directory,
}: Omit<ResourcesQuery, 'resolveMetadata'>) {
  return queryClientRef.current.getQueryData(
    QUERY_KEYS.RESOURCES_OF_DIRECTORY({ directoryId: uriHelper.getComparisonKey(directory) }),
    {
      exact: false,
    },
  );
}

export function setCachedResourcesOfDirectory(
  { directory, resolveMetadata }: ResourcesQuery,
  resources: Resource[],
) {
  return queryClientRef.current.setQueryData(
    QUERY_KEYS.RESOURCES_OF_DIRECTORY({
      directoryId: uriHelper.getComparisonKey(directory),
      resolveMetadata,
    }),
    resources,
  );
}
