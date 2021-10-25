import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as React from 'react';
import { useQuery } from 'react-query';

import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { fileIconThemeRef } from '@app/operations/global-modules';

export declare namespace IconClassesQuery {
  export type Args = { uri: UriComponents; fileKind: FileKind };
  export type ReturnType = string[] | Promise<string[]>;
}

export function useFileIconClasses({ uri, fileKind }: IconClassesQuery.Args) {
  const file = { uri: URI.from(uri).toJSON(), fileKind };

  const [syncLoadedIconClasses] = React.useState(() => {
    const fetchIconClassesResult = fetchIconClasses(file);
    if (Array.isArray(fetchIconClassesResult)) {
      return fetchIconClassesResult;
    } else {
      return undefined;
    }
  });
  const iconClassesQuery = useQuery(QUERY_KEYS.FILE_ICON_CLASSES(file), () =>
    fetchIconClasses(file),
  );

  return iconClassesQuery.data ?? syncLoadedIconClasses;
}

function fetchIconClasses(file: IconClassesQuery.Args): IconClassesQuery.ReturnType {
  return fileIconThemeRef.current.loadIconClasses(URI.from(file.uri), file.fileKind);
}
