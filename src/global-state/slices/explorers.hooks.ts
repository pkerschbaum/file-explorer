import { ExplorerPanel } from '@app/global-state/slices/explorers.slice';
import { useSelector } from '@app/global-state/store';

export type ExplorerPanelEntry = ExplorerPanel & {
  explorerId: string;
};

export const useExplorerPanels: () => ExplorerPanelEntry[] = () =>
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
