import { useQuery } from 'react-query';

import { CustomError } from '#pkg/base/custom-error';
import type { IFileStat } from '#pkg/base/files';
import type { UriComponents } from '#pkg/base/uri';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import type { ResourceStat } from '#pkg/domain/types';
import { RESOURCE_TYPE } from '#pkg/domain/types';
import { QUERY_KEYS } from '#pkg/global-cache/query-keys';

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
      const statsWithMetadata = await globalThis.modules.fileSystem.resolve(directory, {
        resolveMetadata,
      });

      if (!statsWithMetadata.isDirectory) {
        throw new CustomError(
          `could not resolve children of directory, reason: resolved resource is not a directory`,
          {
            directory,
            statsWithMetadata,
          },
        );
      }

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
  await globalThis.modules.queryClient.refetchQueries(
    QUERY_KEYS.RESOURCES_OF_DIRECTORY({ directoryId: uriHelper.getComparisonKey(directory) }),
    {
      exact: false,
      active: filter?.active,
    },
  );
}

export function getCachedResourcesOfDirectory(directory: ResourcesQuery['directory']) {
  return globalThis.modules.queryClient.getQueryData(
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
  return globalThis.modules.queryClient.setQueryData(
    QUERY_KEYS.RESOURCES_OF_DIRECTORY({
      directoryId: uriHelper.getComparisonKey(directory),
      resolveMetadata,
    }),
    resources.map(mapFileStatToResource),
  );
}

export function mapFileStatToResource(resource: IFileStat): ResourceStat {
  const resourceType = resource.isDirectory
    ? RESOURCE_TYPE.DIRECTORY
    : resource.isSymbolicLink
    ? RESOURCE_TYPE.SYMBOLIC_LINK
    : resource.isFile
    ? RESOURCE_TYPE.FILE
    : RESOURCE_TYPE.UNKNOWN;

  return {
    key: uriHelper.getComparisonKey(resource.resource),
    uri: resource.resource,
    resourceType,
    size: resource.size,
    mtime: resource.mtime,
    ctime: resource.ctime,
  };
}
