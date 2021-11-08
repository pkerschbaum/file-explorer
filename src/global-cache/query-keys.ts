import type { IconClassesQuery, NativeIconDataURLQuery } from '@app/global-cache/resource-icons';

export const DIRECTORY_CONTENT_KEY_PREFIX = 'directory-content';
type DirectoryContentOptions = { directoryId: string; resolveMetadata?: boolean };
export type DirectoryContentKey = [typeof DIRECTORY_CONTENT_KEY_PREFIX, DirectoryContentOptions];

export const QUERY_KEYS = {
  RESOURCES_OF_DIRECTORY: (options: DirectoryContentOptions) =>
    [DIRECTORY_CONTENT_KEY_PREFIX, options] as DirectoryContentKey,
  RESOURCE_ICON_CLASSES: (options: IconClassesQuery.Args) => ['resource-icon-classes', options],
  NATIVE_ICON_DATA_URL: (options: NativeIconDataURLQuery.Args) => ['native-icon-data-url', options],
};
