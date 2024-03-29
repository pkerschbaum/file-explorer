import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState, StorageState } from '#pkg/global-state/store';
import { createLogger } from '#pkg/operations/create-logger';

const logger = createLogger('store-persist-middleware');

export const persistMiddleware = (store: any) => (next: any) => (action: PayloadAction) => {
  const result = next(action);
  const currentState = store.getState() as RootState;
  const storageState = mapStorageStateFromGlobalState(currentState);
  logger.debug('persisting state (asynchronously)...', { storageState });
  void globalThis.modules.persistentStorage
    .write(storageState)
    .then(() => logger.debug('state persisted!'));
  return result;
};

function mapStorageStateFromGlobalState(state: RootState): StorageState {
  return {
    activeExplorerPanels: Object.entries(state.explorersSlice.explorerPanels).map(
      ([id, panel]) => ({ id, cwdSegments: panel.cwdSegments }),
    ),
    focusedExplorerPanelId: state.explorersSlice.focusedExplorerPanelId,
    tagsState: state.tagsSlice,
    userState: state.userSlice,
  };
}
