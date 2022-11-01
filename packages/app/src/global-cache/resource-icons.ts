import type { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import type { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as React from 'react';
import { useQuery } from 'react-query';

import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { loadIconClasses } from '@app/operations/file-icon-theme.operations';

export declare namespace IconClassesQuery {
  export type Args = { uri?: UriComponents; resourceKind: FileKind };
  export type Result = string[] | undefined;
}

export function useResourceIconClasses({
  uri,
  resourceKind,
}: IconClassesQuery.Args): IconClassesQuery.Result {
  const resource = {
    uri: uri === undefined ? undefined : URI.from(uri).toJSON(),
    resourceKind,
  };

  const [syncLoadedIconClasses] = React.useState(() => {
    const fetchIconClassesResult = fetchIconClasses(resource);
    if (Array.isArray(fetchIconClassesResult)) {
      return fetchIconClassesResult;
    } else {
      return undefined;
    }
  });
  const iconClassesQuery = useQuery<string[]>(QUERY_KEYS.RESOURCE_ICON_CLASSES(resource), () =>
    fetchIconClasses(resource),
  );

  return iconClassesQuery.data ?? syncLoadedIconClasses;
}

function fetchIconClasses(resource: IconClassesQuery.Args) {
  return loadIconClasses(
    resource.uri === undefined ? undefined : URI.from(resource.uri),
    resource.resourceKind,
  );
}
