import * as React from 'react';
import { useQuery } from 'react-query';

import { loadIconClasses } from '#pkg/base/file-icon-theme/load-icon-classes';
import type { FileKind } from '#pkg/base/files';
import type { UriComponents } from '#pkg/base/uri';
import { QUERY_KEYS } from '#pkg/global-cache/query-keys';

export declare namespace IconClassesQuery {
  export type Args = { uri?: UriComponents; resourceKind: FileKind };
  export type Result = string[] | undefined;
}

export function useResourceIconClasses({
  uri,
  resourceKind,
}: IconClassesQuery.Args): IconClassesQuery.Result {
  const resource = {
    uri,
    resourceKind,
  };

  const [syncLoadedIconClasses] = React.useState(() => {
    const fetchIconClassesResult = fetchIconClasses(resource);
    return Array.isArray(fetchIconClassesResult) ? fetchIconClassesResult : undefined;
  });
  const iconClassesQuery = useQuery<string[]>(QUERY_KEYS.RESOURCE_ICON_CLASSES(resource), () =>
    fetchIconClasses(resource),
  );

  return iconClassesQuery.data ?? syncLoadedIconClasses;
}

function fetchIconClasses(resource: IconClassesQuery.Args) {
  return loadIconClasses(resource.uri, resource.resourceKind);
}
