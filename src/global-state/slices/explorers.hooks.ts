import { useSelector } from '@app/global-state/store';

export const useExplorers = () =>
  Object.entries(useSelector((state) => state.explorersSlice.explorers)).map(
    ([explorerId, value]) => ({
      explorerId,
      ...value,
    }),
  );

export const useCwd = (explorerId: string) =>
  useSelector((state) => state.explorersSlice.explorers[explorerId].cwd);

export const useFocusedExplorerId = () =>
  useSelector((state) => state.explorersSlice.focusedExplorerId);
