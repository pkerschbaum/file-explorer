/* eslint-disable no-console */

import type { PlatformLogWriter } from '#pkg/log-writer.types';

export const createLogWriter = () => {
  const instance: PlatformLogWriter = {
    debug: console.debug.bind(console),
    info: console.info.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    group: console.group.bind(console),
    groupEnd: console.groupEnd.bind(console),
  };

  return instance;
};
