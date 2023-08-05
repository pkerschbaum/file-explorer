import { useQuery } from 'react-query';

import type { IFileStat } from '@file-explorer/code-oss-ecma/files';
import type { ResourceStat } from '@file-explorer/code-oss-ecma/types';
import { RESOURCE_TYPE } from '@file-explorer/code-oss-ecma/types';
import type { UriComponents } from '@file-explorer/code-oss-ecma/uri';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';
import { CustomError } from '@file-explorer/commons-ecma/util/custom-error';

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
