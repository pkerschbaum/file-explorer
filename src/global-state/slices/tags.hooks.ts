import * as React from 'react';

import { ResourceForUI } from '@app/domain/types';
import { useSelector } from '@app/global-state/store';
import { getTagsOfResource } from '@app/operations/resource.operations';

export function useEnrichResourcesWithTags(resources: ResourceForUI[]) {
  const resourcesToTags = useSelector((state) => state.tagsSlice.resourcesToTags);
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

export function useTags() {
  return useSelector((state) => state.tagsSlice.tags);
}
