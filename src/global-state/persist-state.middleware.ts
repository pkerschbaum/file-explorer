import { PayloadAction } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import type { RootState } from '@app/global-state/store';
import { persistentStorageRef } from '@app/operations/global-modules';
import type { StorageState } from '@app/platform/persistent-storage';

const logger = createLogger('store-persist-middleware');

export const persistMiddleware = (store: any) => (next: any) => (action: PayloadAction) => {
  const result = next(action);
  const currentState = store.getState() as RootState;
  const storageState = mapStorageStateFromGlobalState(currentState);
  logger.debug('persisting state (asynchronously)...', { storageState });
  void persistentStorageRef.current
    .write(storageState)
    .then(() => logger.debug('state persisted!'));
  return result;
};

function mapStorageStateFromGlobalState(state: RootState): StorageState {
  return {
    activeExplorerPanels: Object.entries(state.explorersSlice.explorerPanels).map(
      ([id, panel]) => ({ id, cwd: panel.cwd }),
    ),
    focusedExplorerPanelId: state.explorersSlice.focusedExplorerPanelId,
    tagsState: state.tagsSlice,
  };
}
