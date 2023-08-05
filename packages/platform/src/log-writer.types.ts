export type PlatformLogWriter = {
  debug(...args: LogFnArgs): void;
  info(...args: LogFnArgs): void;
  warn(...args: LogFnArgs): void;
  error(message: string, error?: unknown, ...additionalArgs: unknown[]): void;
  group(groupName: string): void;
  groupEnd(): void;
};

type LogFnArgs = [message: string, ...additionalArgs: unknown[]];
