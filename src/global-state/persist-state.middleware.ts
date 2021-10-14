import { PayloadAction } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import type { RootState } from '@app/global-state/store';

const logger = createLogger('store-persist-middleware');

export const persistMiddleware = (store: any) => (next: any) => (action: PayloadAction) => {
  const result = next(action);
  const { persistedSlice } = store.getState() as RootState;
  logger.debug('persisting state...', { persistedSlice });
  window.preload.persistData(persistedSlice);
  logger.debug('state persisted!');
  return result;
};
