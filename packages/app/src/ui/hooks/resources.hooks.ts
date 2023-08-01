import * as React from 'react';

import { FileKind } from '#pkg/base/files';
import type { UriComponents } from '#pkg/base/uri';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import { config } from '#pkg/config';
import type { ResourceStat, ResourceForUI } from '#pkg/domain/types';
import { RESOURCE_TYPE } from '#pkg/domain/types';
import { useResourceIconClasses } from '#pkg/global-cache/resource-icons';
import { useResources } from '#pkg/global-cache/resources';
import { useResourcesToTags } from '#pkg/global-state/slices/tags.hooks';
import { createLogger } from '#pkg/operations/create-logger';
import { getTagsOfResource } from '#pkg/operations/resource.operations';

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
