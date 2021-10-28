import type { IconClassesQuery, NativeIconDataURLQuery } from '@app/global-cache/file-icons';

export const DIRECTORY_CONTENT_KEY_PREFIX = 'directory-content';

export const QUERY_KEYS = {
  DIRECTORY_CONTENT: (options: { directoryId?: string; resolveMetadata?: boolean }) => [
    DIRECTORY_CONTENT_KEY_PREFIX,
    options,
  ],
  FILE_ICON_CLASSES: (options: IconClassesQuery.Args) => ['file-icon-classes', options],
  NATIVE_ICON_DATA_URL: (options: NativeIconDataURLQuery.Args) => [
    'native-file-icon-data-url',
    options,
  ],
};
