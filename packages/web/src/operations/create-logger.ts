import { loggerFactory } from '@file-explorer/commons-ecma/util/logger';

export const createLogger = loggerFactory(globalThis.modules.logWriter);
