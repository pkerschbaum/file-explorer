import * as React from 'react';

import { storageRef } from '@app/operations/global-modules';
import { STORAGE_KEY } from '@app/platform/storage';
import { useRerenderOnEventFire } from '@app/ui/utils/react.util';
import { getTagsOfFile } from '@app/operations/file.hooks';
import { FileForUI } from '@app/operations/explorer.hooks';
import { getTags } from '@app/operations/tag.hooks';

export function useEnrichFilesWithTags(files: FileForUI[]) {
  useRerenderOnEventFire(
    storageRef.current.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.TAGS, []),
  );

  useRerenderOnEventFire(
    storageRef.current.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.RESOURCES_TO_TAGS, []),
  );

  const enrichedFiles = files.map((file) => ({
    ...file,
    tags: file.ctime === undefined ? [] : getTagsOfFile({ uri: file.uri, ctime: file.ctime }),
  }));

  return enrichedFiles;
}

export function useGetTags() {
  useRerenderOnEventFire(
    storageRef.current.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.TAGS, []),
  );

  return { getTags };
}
