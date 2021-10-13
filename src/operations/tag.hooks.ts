import * as React from 'react';
import { nanoid } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import { useNexStorage } from '@app/ui/NexStorage.context';
import { STORAGE_KEY } from '@app/platform/storage';
import { Tag } from '@app/domain/types';
import { useRerenderOnEventFire } from '@app/ui/utils/react.util';

const logger = createLogger('tag.hooks');

export function useAddTag() {
  const storage = useNexStorage();

  useRerenderOnEventFire(
    storage.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.TAGS, []),
  );

  return {
    addTag: (tagData: Omit<Tag, 'id'>): Tag => {
      logger.debug(`adding tag to storage...`, { tagData });

      const tags = storage.get(STORAGE_KEY.TAGS) ?? {};
      const id = nanoid();
      tags[id] = tagData;
      storage.store(STORAGE_KEY.TAGS, tags);

      const tag = { ...tagData, id };
      logger.debug(`tag added to storage!`, { tag });
      return tag;
    },
  };
}

export function useGetTags() {
  const storage = useNexStorage();

  useRerenderOnEventFire(
    storage.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.TAGS, []),
  );

  const getTags = React.useCallback(() => {
    const tags = storage.get(STORAGE_KEY.TAGS) ?? {};
    logger.debug(`got tags from storage`, { tags });
    return tags;
  }, [storage]);

  return {
    getTags,
  };
}

export function useRemoveTags() {
  const storage = useNexStorage();

  useRerenderOnEventFire(
    storage.onDataChanged,
    React.useCallback((storageKey) => storageKey === STORAGE_KEY.TAGS, []),
  );

  return {
    removeTags: (tagIds: Tag['id'][]) => {
      logger.debug(`removing tags from storage...`, { tagIds });

      const tags = storage.get(STORAGE_KEY.TAGS) ?? {};
      for (const tagId of tagIds) {
        delete tags[tagId];
      }
      storage.store(STORAGE_KEY.TAGS, tags);

      logger.debug(`tags removed from storage!`);
    },
  };
}
