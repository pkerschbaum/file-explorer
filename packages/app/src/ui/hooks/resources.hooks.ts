import type { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as React from 'react';

import { uriHelper } from '@app/base/utils/uri-helper';
import { config } from '@app/config';
import type { ResourceStat, ResourceForUI } from '@app/domain/types';
import { RESOURCE_TYPE } from '@app/domain/types';
import { useResourceIconClasses } from '@app/global-cache/resource-icons';
import { useResources } from '@app/global-cache/resources';
import { useResourcesToTags } from '@app/global-state/slices/tags.hooks';
import { createLogger } from '@app/operations/create-logger';
import { getTagsOfResource } from '@app/operations/resource.operations';

const logger = createLogger('resources.hooks');

type ResourcesLoadingResult = {
  resources?: ResourceForUI[];
  isLoading: boolean;
  error?: unknown;
};
export const useResourcesOfDirectory = (
  directory: UriComponents,
  queryOptions?: { enabled?: boolean },
): ResourcesLoadingResult => {
  const resourcesQueryWithMetadata = useResources(
    { directory, resolveMetadata: true },
    queryOptions,
  );
  const resourcesQueryWithoutMetadata = useResources(
    { directory, resolveMetadata: false },
    { enabled: resourcesQueryWithMetadata.data === undefined, ...queryOptions },
  );

  let resourcesToUse: undefined | ResourceStat[];
  let isLoading: boolean;
  let error: undefined | unknown;
  if (resourcesQueryWithMetadata.data !== undefined) {
    resourcesToUse = resourcesQueryWithMetadata.data;
    isLoading = resourcesQueryWithMetadata.isLoading;
    error = resourcesQueryWithMetadata.error;
  } else if (resourcesQueryWithoutMetadata.data !== undefined) {
    resourcesToUse = resourcesQueryWithoutMetadata.data;
    isLoading = resourcesQueryWithoutMetadata.isLoading;
    error = resourcesQueryWithoutMetadata.error;
  } else {
    // files queries do not have any (possibly cached) data yet
    isLoading = resourcesQueryWithMetadata.isLoading || resourcesQueryWithoutMetadata.isLoading;
    error = resourcesQueryWithMetadata.error ?? resourcesQueryWithoutMetadata.error;
  }

  const resourcesForUI = React.useMemo(
    () =>
      resourcesToUse === undefined
        ? undefined
        : resourcesToUse.map((resource) => {
            const basename = uriHelper.extractBasename(resource.uri);
            const extension = uriHelper.extractExtension(resource.uri);

            const resourceForUI: ResourceForUI = {
              ...resource,
              basename,
              extension,
              tags: [],
            };
            return resourceForUI;
          }),
    [resourcesToUse],
  );

  return { resources: resourcesForUI, isLoading, error };
};

export function useEnrichResourcesWithTags(resources: ResourceForUI[]) {
  const resourcesToTags = useResourcesToTags();
  const enrichedResources = React.useMemo(
    () =>
      resources.map((resource) => ({
        ...resource,
        tags:
          resource.ctime === undefined
            ? []
            : getTagsOfResource(resourcesToTags, { uri: resource.uri, ctime: resource.ctime }),
      })),
    [resources, resourcesToTags],
  );

  return enrichedResources;
}

export function useThemeResourceIconClasses(resource: ResourceForUI) {
  let uri: UriComponents | undefined = resource.uri;
  if (
    !config.featureFlags.specificIconsForDirectories &&
    resource.resourceType === RESOURCE_TYPE.DIRECTORY
  ) {
    /**
     * if no specific icons for directories should be used, and the resource is a directory, don't query a resource icon via URI,
     * only by fileKind
     */
    uri = undefined;
  }

  const iconClasses = useResourceIconClasses({
    uri,
    resourceKind: mapResourceTypeToFileKind(resource.resourceType),
  });

  return iconClasses?.join(' ');
}

function mapResourceTypeToFileKind(resourceType: RESOURCE_TYPE) {
  if (resourceType === RESOURCE_TYPE.FILE) {
    return FileKind.FILE;
  } else if (resourceType === RESOURCE_TYPE.DIRECTORY) {
    return FileKind.FOLDER;
  } else {
    logger.warn(`could not map RESOURCE_TYPE to FileKind, fallback to FileKind.FILE`, {
      resourceType,
    });
    return FileKind.FILE;
  }
}
