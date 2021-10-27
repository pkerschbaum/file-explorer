import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as React from 'react';
import { useQuery, UseQueryOptions } from 'react-query';

import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fileIconThemeRef, nativeHostRef } from '@app/operations/global-modules';

export declare namespace IconClassesQuery {
  export type Args = { uri: UriComponents; fileKind: FileKind };
  export type Result = string[] | undefined;
}

export function useFileIconClasses({
  uri,
  fileKind,
}: IconClassesQuery.Args): IconClassesQuery.Result {
  const file = { uri: URI.from(uri).toJSON(), fileKind };

  const [syncLoadedIconClasses] = React.useState(() => {
    const fetchIconClassesResult = fetchIconClasses(file);
    if (Array.isArray(fetchIconClassesResult)) {
      return fetchIconClassesResult;
    } else {
      return undefined;
    }
  });
  const iconClassesQuery = useQuery<string[]>(QUERY_KEYS.FILE_ICON_CLASSES(file), () =>
    fetchIconClasses(file),
  );

  return iconClassesQuery.data ?? syncLoadedIconClasses;
}

function fetchIconClasses(file: IconClassesQuery.Args) {
  return fileIconThemeRef.current.loadIconClasses(URI.from(file.uri), file.fileKind);
}

export declare namespace NativeIconDataURLQuery {
  export type Args = { fsPath: string };
  export type Result = string | undefined;
}

export function useNativeFileIconDataURL(
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
  return await nativeHostRef.current.getNativeFileIconDataURL(args);
}
