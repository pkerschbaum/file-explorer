import { PayloadAction } from '@reduxjs/toolkit';

import { JsonObject } from '@app/base/utils/types.util';
import { createLogger } from '@app/operations/create-logger';

const logger = createLogger('store-logger-middleware');

const loggerMiddleware = (store: any) => (next: any) => (action: PayloadAction) => {
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

export default loggerMiddleware;
