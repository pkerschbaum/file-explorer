import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { CombinedState, PreloadedState } from '@reduxjs/toolkit';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';

import { extractCwdFromExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { ExplorersMap } from '@app/global-state/slices/explorers.slice';
import type { RootState } from '@app/global-state/store';
import { createLogger } from '@app/operations/create-logger';
import { fileSystemRef, persistentStorageRef } from '@app/operations/global-modules';
import { StorageState } from '@app/platform/persistent-storage.types';

const logger = createLogger('storage-state.operations');

export async function readStorageState(): Promise<StorageState> {
  return await persistentStorageRef.current.read();
}

export async function reviveGlobalStateFromStorageState(
  storageState: Partial<StorageState>,
): Promise<PreloadedState<CombinedState<NoInfer<RootState>>>> {
  const explorers: ExplorersMap = {};

  if (storageState.activeExplorerPanels) {
    await Promise.allSettled(
      storageState.activeExplorerPanels.map(async (panel) => {
        try {
          // make sure the CWD is still present and reachable
          await fileSystemRef.current.resolve(URI.from(extractCwdFromExplorerPanel(panel)), {
            resolveMetadata: false,
          });
          explorers[panel.id] = { cwdSegments: panel.cwdSegments };
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
    userSlice: storageState.userState,
  };
}
