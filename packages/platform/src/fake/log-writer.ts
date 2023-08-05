import { functions } from '@file-explorer/commons-ecma/util/functions.util';

import type { PlatformLogWriter } from '#pkg/log-writer.types';

export const createNoopLogWriter = () => {
  const instance: PlatformLogWriter = {
    debug: functions.noop,
    info: functions.noop,
    warn: functions.noop,
    error: functions.noop,
    group: functions.noop,
    groupEnd: functions.noop,
  };

  return instance;
};
