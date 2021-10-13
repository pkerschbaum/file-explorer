import { PayloadAction } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import { JsonObject } from '@app/base/utils/types.util';

const logger = createLogger('store-logger-middleware');

const loggerMiddleware = (store: any) => (next: any) => (action: PayloadAction) => {
  logger.group(action.type);
  logger.debug(
    'dispatching action...',
    { actionType: action.type },
    { actionPayload: action.payload as any as JsonObject<any> },
  );
  const result = next(action);
  logger.debug('next state got computed!', undefined, store.getState());
  logger.groupEnd();
  return result;
};

export default loggerMiddleware;
