import { functions } from '@app/base/utils/functions.util';
import type { PlatformLogWriter } from '@app/platform/log-writer';

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
