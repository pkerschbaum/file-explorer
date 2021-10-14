import { useSelector } from '@app/global-state/store';

export const useExplorerPanels = () =>
  Object.entries(useSelector((state) => state.explorersSlice.explorerPanels)).map(
    ([explorerId, value]) => ({
      explorerId,
      ...value,
    }),
  );

export const useCwd = (explorerId: string) =>
  useSelector((state) => state.explorersSlice.explorerPanels[explorerId].cwd);

export const useIdOfFocusedExplorerPanel = () =>
  useSelector((state) => state.explorersSlice.focusedExplorerPanelId);
