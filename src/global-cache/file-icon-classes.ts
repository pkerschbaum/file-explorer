import { useQueries, UseQueryResult } from 'react-query';

import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fileIconThemeRef } from '@app/operations/global-modules';

export declare namespace IconClassesQuery {
  export type Args = { uri: UriComponents; fileKind: FileKind };
  export type ReturnType = { uri: UriComponents; iconClasses: string[] };
}

export function useFileIconClasses(files: IconClassesQuery.Args[]) {
  const queries = useQueries(
    files.map((file) => ({
      queryKey: QUERY_KEYS.FILE_ICON_CLASSES(file),
      queryFn: () => fetchIconClasses(file),
    })),
  );

  return queries as UseQueryResult<IconClassesQuery.ReturnType>[];
}

async function fetchIconClasses(file: IconClassesQuery.Args): Promise<IconClassesQuery.ReturnType> {
  const iconClasses = await fileIconThemeRef.current.loadIconClasses(
    URI.from(file.uri),
    file.fileKind,
  );
  return {
    uri: file.uri,
    iconClasses,
  };
}
