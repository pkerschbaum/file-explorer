import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { CombinedState, PreloadedState } from '@reduxjs/toolkit';
import { NoInfer } from '@reduxjs/toolkit/dist/tsHelpers';

import { createLogger } from '@app/base/logger/logger';
import { check } from '@app/base/utils/assert.util';
import { ExplorersMap, generateExplorerId } from '@app/global-state/slices/explorers.slice';
import type { RootState } from '@app/global-state/store';
import { getDefaultExplorerCwd } from '@app/operations/app.operations';
import { fileSystemRef } from '@app/operations/global-modules';
import { StorageState } from '@app/platform/persistent-storage';

const logger = createLogger('storage-state.operations');

export async function reviveGlobalStateFromStorageState(
  storageState: Partial<StorageState>,
): Promise<PreloadedState<CombinedState<NoInfer<RootState>>>> {
  const explorers: ExplorersMap = {};
  let focusedExplorerPanelId = storageState.focusedExplorerPanelId;

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

  if (Object.keys(explorers).length < 1) {
    // no explorer present --> add default explorer panel
    const cwdOfNewExplorer = URI.from(await getDefaultExplorerCwd());
    const explorerId = generateExplorerId();
    explorers[explorerId] = { cwd: cwdOfNewExplorer };
  }

  if (
    check.isNullishOrEmptyString(focusedExplorerPanelId) ||
    explorers[focusedExplorerPanelId] === undefined
  ) {
    // no focusedExplorerPanelId is present or it refers to an invalid explorer id --> just focus first explorer
    focusedExplorerPanelId = Object.keys(explorers)[0];
  }

  return {
    explorersSlice: {
      explorerPanels: explorers,
      focusedExplorerPanelId,
    },
    tagsSlice: storageState.tagsState,
  };
}
