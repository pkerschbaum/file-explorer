import { PayloadAction } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import type { RootState } from '@app/global-state/store';

const logger = createLogger('store-persist-middleware');

export const persistMiddleware = (store: any) => (next: any) => (action: PayloadAction) => {
  const result = next(action);
  const { persistedSlice } = store.getState() as RootState;
  logger.debug('persisting state (asynchronously)...', { persistedSlice });
  void window.preload.persistData(persistedSlice).then(() => logger.debug('state persisted!'));
  return result;
};
