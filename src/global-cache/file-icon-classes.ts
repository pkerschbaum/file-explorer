import { useQuery } from 'react-query';

import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fileIconThemeRef } from '@app/operations/global-modules';

export declare namespace IconClassesQuery {
  export type Args = { uri: UriComponents; fileKind: FileKind };
  export type ReturnType = string[];
}

export function useFileIconClasses({ uri, fileKind }: IconClassesQuery.Args) {
  const file = { uri: URI.from(uri).toJSON(), fileKind };
  return useQuery(QUERY_KEYS.FILE_ICON_CLASSES(file), () => fetchIconClasses(file), {});
}

async function fetchIconClasses(file: IconClassesQuery.Args): Promise<IconClassesQuery.ReturnType> {
  return await fileIconThemeRef.current.loadIconClasses(URI.from(file.uri), file.fileKind);
}
