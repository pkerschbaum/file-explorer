import type { IconClassesQuery, NativeIconDataURLQuery } from '@app/global-cache/resource-icons';

export const RESOURCES_OF_DIRECTORY_KEY_PREFIX = 'resources-of-directory';
type ResourcesOfDirectoryOptions = { directoryId: string; resolveMetadata?: boolean };
export type ResourcesOfDirectoryKey = [
  typeof RESOURCES_OF_DIRECTORY_KEY_PREFIX,
  ResourcesOfDirectoryOptions,
];

export const QUERY_KEYS = {
  RESOURCES_OF_DIRECTORY: (options: ResourcesOfDirectoryOptions) =>
    [RESOURCES_OF_DIRECTORY_KEY_PREFIX, options] as ResourcesOfDirectoryKey,
  RESOURCE_ICON_CLASSES: (options: IconClassesQuery.Args) => ['resource-icon-classes', options],
  NATIVE_ICON_DATA_URL: (options: NativeIconDataURLQuery.Args) => ['native-icon-data-url', options],
};

export function isResourcesOfDirectoryQueryKey(
  something: unknown,
): something is ResourcesOfDirectoryKey {
  return (
    Array.isArray(something) &&
    something.length === 2 &&
    something[0] === RESOURCES_OF_DIRECTORY_KEY_PREFIX &&
    typeof something[1] === 'object' &&
    typeof (something[1] as ResourcesOfDirectoryOptions).directoryId === 'string'
  );
}
