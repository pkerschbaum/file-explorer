import { useSelector } from '@app/global-state/store';

export function useResourcesToTags() {
  return useSelector((state) => state.tagsSlice.resourcesToTags);
}

export function useTags() {
  return useSelector((state) => state.tagsSlice.tags);
}
