import * as React from 'react';

import { FileForUI } from '@app/domain/types';
import { useSelector } from '@app/global-state/store';
import { getTagsOfFile } from '@app/operations/file.operations';

export function useEnrichFilesWithTags(files: FileForUI[]) {
  const resourcesToTags = useSelector((state) => state.tagsSlice.resourcesToTags);
  const enrichedFiles = React.useMemo(
    () =>
      files.map((file) => ({
        ...file,
        tags:
          file.ctime === undefined
            ? []
            : getTagsOfFile(resourcesToTags, { uri: file.uri, ctime: file.ctime }),
      })),
    [files, resourcesToTags],
  );

  return enrichedFiles;
}

export function useTags() {
  return useSelector((state) => state.tagsSlice.tags);
}
