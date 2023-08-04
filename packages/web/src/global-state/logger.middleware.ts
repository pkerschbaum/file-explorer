import type { PayloadAction } from '@reduxjs/toolkit';

import type { JsonObject } from '@file-explorer/commons-ecma/util/types.util';

import { createLogger } from '#pkg/operations/create-logger';

const logger = createLogger('store-logger-middleware');

export const loggerMiddleware = (store: any) => (next: any) => (action: PayloadAction) => {
  logger.group(action.type);
  logger.debug(
    'dispatching action...',
    { actionType: action.type },
    { actionPayload: action.payload as any as JsonObject<any> },
  );
  const result = next(action);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  logger.debug('next state got computed!', undefined, store.getState());
  logger.groupEnd();
  return result;
};
