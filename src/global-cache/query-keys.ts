export const QUERY_KEYS = {
  FILES: (directoryId: string) => ['files', directoryId],
  FILES_WITH_OPTIONS: (directoryId: string, options: { resolveMetadata?: boolean }) => [
    ...QUERY_KEYS.FILES(directoryId),
    options,
  ],
};
