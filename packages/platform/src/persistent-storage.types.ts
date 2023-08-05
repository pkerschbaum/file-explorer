export type PlatformPersistentStorage = {
  write: (entireValue: Record<string, unknown>) => Promise<void>;
  read: () => Promise<Record<string, unknown>>;
};
