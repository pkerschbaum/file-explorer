import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import type { CombinedState, PreloadedState } from '@reduxjs/toolkit';
import type { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';

import { extractCwdFromExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import type { ExplorersMap } from '@app/global-state/slices/explorers.slice';
import type { RootState } from '@app/global-state/store';
import { createLogger } from '@app/operations/create-logger';
import type { StorageState } from '@app/platform/persistent-storage.types';

const logger = createLogger('storage-state.operations');

export async function readStorageState(): Promise<StorageState> {
  return await globalThis.modules.persistentStorage.read();
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
          await globalThis.modules.fileSystem.resolve(
            URI.from(extractCwdFromExplorerPanel(panel)),
            {
              resolveMetadata: false,
            },
          );
          explorers[panel.id] = { cwdSegments: panel.cwdSegments, version: 1 };
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