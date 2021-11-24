/* eslint-disable no-console */

export type PlatformLogWriter = {
  debug(...args: LogFnArgs): void;
  info(...args: LogFnArgs): void;
  warn(...args: LogFnArgs): void;
  error(message: string, error?: unknown, ...additionalArgs: unknown[]): void;
  group(groupName: string): void;
  groupEnd(): void;
};

type LogFnArgs = [message: string, ...additionalArgs: unknown[]];

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
