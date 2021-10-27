import type { IconClassesQuery, NativeIconDataURLQuery } from '@app/global-cache/file-icons';

export const QUERY_KEYS = {
  FILES: (directoryId: string) => ['files', directoryId],
  FILES_WITH_OPTIONS: (directoryId: string, options: { resolveMetadata?: boolean }) => [
    ...QUERY_KEYS.FILES(directoryId),
    options,
  ],
  FILE_ICON_CLASSES: (options: IconClassesQuery.Args) => ['file-icon-classes', options],
  NATIVE_ICON_DATA_URL: (options: NativeIconDataURLQuery.Args) => [
    'native-file-icon-data-url',
    options,
  ],
};
