import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStat } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import { useQuery } from 'react-query';

import { uriHelper } from '@app/base/utils/uri-helper';
import { Resource, RESOURCE_TYPE } from '@app/domain/types';
import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fileSystemRef, queryClientRef } from '@app/operations/global-modules';

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
    async () => {
      const statsWithMetadata = await fileSystemRef.current.resolve(URI.from(directory), {
        resolveMetadata,
      });

      if (!statsWithMetadata.children) {
        return [];
      }
      return statsWithMetadata.children.map(mapFileStatToResource);
    },
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

export function getCachedResourcesOfDirectory(directory: ResourcesQuery['directory']) {
  return queryClientRef.current.getQueryData(
    QUERY_KEYS.RESOURCES_OF_DIRECTORY({ directoryId: uriHelper.getComparisonKey(directory) }),
    {
      exact: false,
    },
  );
}

export function setCachedResourcesOfDirectory(
  { directory, resolveMetadata }: ResourcesQuery,
  resources: IFileStat[],
) {
  return queryClientRef.current.setQueryData(
    QUERY_KEYS.RESOURCES_OF_DIRECTORY({
      directoryId: uriHelper.getComparisonKey(directory),
      resolveMetadata,
    }),
    resources.map(mapFileStatToResource),
  );
}

function mapFileStatToResource(resource: IFileStat): Resource {
  const resourceType = resource.isDirectory
    ? RESOURCE_TYPE.DIRECTORY
    : resource.isSymbolicLink
    ? RESOURCE_TYPE.SYMBOLIC_LINK
    : resource.isFile
    ? RESOURCE_TYPE.FILE
    : RESOURCE_TYPE.UNKNOWN;

  return {
    key: uriHelper.getComparisonKey(resource.resource),
    resourceType,
    uri: resource.resource.toJSON(),
    size: resource.size,
    mtime: resource.mtime,
    ctime: resource.ctime,
  };
}
