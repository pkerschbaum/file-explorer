import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as React from 'react';
import { useQuery, UseQueryOptions } from 'react-query';

import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { nativeHostRef } from '@app/operations/global-modules';
import { loadIconClasses } from '@app/platform/file-icon-theme';

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

export declare namespace NativeIconDataURLQuery {
  export type Args = { fsPath: string };
  export type Result = string | undefined;
}

export function useNativeIconDataURL(
  args: NativeIconDataURLQuery.Args,
  queryOptions?: UseQueryOptions<NativeIconDataURLQuery.Result>,
): NativeIconDataURLQuery.Result {
  const query = useQuery<string | undefined>(
    QUERY_KEYS.NATIVE_ICON_DATA_URL(args),
    () => fetchNativeIconDataURL(args),
    queryOptions,
  );
  return query.data;
}

async function fetchNativeIconDataURL(args: NativeIconDataURLQuery.Args) {
  return await nativeHostRef.current.app.getNativeFileIconDataURL(args);
}
