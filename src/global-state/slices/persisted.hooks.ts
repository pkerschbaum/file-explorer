import { FileForUI } from '@app/domain/types';
import { useSelector } from '@app/global-state/store';
import { getTagsOfFile } from '@app/operations/file.operations';

export function useEnrichFilesWithTags(files: FileForUI[]) {
  const enrichedFiles = useSelector((state) => {
    return files.map((file) => ({
      ...file,
      tags:
        file.ctime === undefined ? [] : getTagsOfFile(state, { uri: file.uri, ctime: file.ctime }),
    }));
  });

  return enrichedFiles;
}

export function useTags() {
  return useSelector((state) => state.persistedSlice.tags);
}
