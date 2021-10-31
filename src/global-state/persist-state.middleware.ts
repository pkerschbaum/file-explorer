import { PayloadAction } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import type { RootState } from '@app/global-state/store';
import { persistentStorageRef } from '@app/operations/global-modules';

const logger = createLogger('store-persist-middleware');

export const persistMiddleware = (store: any) => (next: any) => (action: PayloadAction) => {
  const result = next(action);
  const { tagsSlice } = store.getState() as RootState;
  logger.debug('persisting state (asynchronously)...', { tagsSlice });
  void persistentStorageRef.current.write(tagsSlice).then(() => logger.debug('state persisted!'));
  return result;
};
