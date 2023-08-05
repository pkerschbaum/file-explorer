import * as React from 'react';
import { useQuery } from 'react-query';

import { loadIconClasses } from '@file-explorer/code-oss-ecma/file-icon-theme/load-icon-classes';
import type { FileKind } from '@file-explorer/code-oss-ecma/files';
import type { UriComponents } from '@file-explorer/code-oss-ecma/uri';

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
