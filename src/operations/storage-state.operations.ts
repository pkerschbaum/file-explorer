import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { CombinedState, PreloadedState } from '@reduxjs/toolkit';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';

import { createLogger } from '@app/base/logger/logger';
import { ExplorersMap } from '@app/global-state/slices/explorers.slice';
import type { RootState } from '@app/global-state/store';
import { fileSystemRef } from '@app/operations/global-modules';
import { StorageState } from '@app/platform/persistent-storage';

const logger = createLogger('storage-state.operations');

export async function reviveGlobalStateFromStorageState(
  storageState: Partial<StorageState>,
): Promise<PreloadedState<CombinedState<NoInfer<RootState>>>> {
  const explorers: ExplorersMap = {};

  if (storageState.activeExplorerPanels) {
    await Promise.allSettled(
      storageState.activeExplorerPanels.map(async (panel) => {
        try {
          // make sure the CWD is still present and reachable
          await fileSystemRef.current.resolve(URI.from(panel.cwd), { resolveMetadata: false });
          explorers[panel.id] = { cwd: panel.cwd };
        } catch (error) {
          logger.error(`could not revive a explorer panel`, error, { panel });
        }
      }),
    );
  }

  return {
    explorersSlice: {
      explorerPanels: explorers,
      focusedExplorerPanelId: storageState.focusedExplorerPanelId,
    },
    tagsSlice: storageState.tagsState,
  };
}
