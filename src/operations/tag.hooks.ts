import { nanoid } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import { STORAGE_KEY } from '@app/platform/storage';
import { Tag } from '@app/domain/types';
import { storageRef } from '@app/operations/global-modules';

const logger = createLogger('tag.hooks');

export function addTag(tagData: Omit<Tag, 'id'>): Tag {
  logger.debug(`adding tag to storage...`, { tagData });

  const tags = storageRef.current.get(STORAGE_KEY.TAGS) ?? {};
  const id = nanoid();
  tags[id] = tagData;
  storageRef.current.store(STORAGE_KEY.TAGS, tags);

  const tag = { ...tagData, id };
  logger.debug(`tag added to storage!`, { tag });
  return tag;
}

export function getTags() {
  const tags = storageRef.current.get(STORAGE_KEY.TAGS) ?? {};
  logger.debug(`got tags from storage`, { tags });
  return tags;
}

export function removeTags(tagIds: Tag['id'][]) {
  logger.debug(`removing tags from storage...`, { tagIds });

  const tags = storageRef.current.get(STORAGE_KEY.TAGS) ?? {};
  for (const tagId of tagIds) {
    delete tags[tagId];
  }
  storageRef.current.store(STORAGE_KEY.TAGS, tags);

  logger.debug(`tags removed from storage!`);
}
