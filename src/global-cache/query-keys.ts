import type { IconClassesQuery } from '@app/global-cache/file-icon-classes';

export const QUERY_KEYS = {
  FILES: (directoryId: string) => ['files', directoryId],
  FILES_WITH_OPTIONS: (directoryId: string, options: { resolveMetadata?: boolean }) => [
    ...QUERY_KEYS.FILES(directoryId),
    options,
  ],
  FILE_ICON_CLASSES: (options: IconClassesQuery.Args) => ['file-icon-classes', options],
};
