import { nanoid } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import { objects } from '@app/base/utils/objects.util';
import { Tag } from '@app/domain/types';
import { actions, STORAGE_KEY } from '@app/global-state/slices/persisted.slice';
import { dispatchRef, storeRef } from '@app/operations/global-modules';

const logger = createLogger('tag.hooks');

export function addTag(tagData: Omit<Tag, 'id'>): Tag {
  logger.debug(`adding tag to storage...`, { tagData });

  const tags = objects.deepCopyJson(storeRef.current.getState().persistedSlice.tags);
  const id = nanoid();
  tags[id] = tagData;
  dispatchRef.current(actions.storeValue({ key: STORAGE_KEY.TAGS, value: tags }));

  const tag = { ...tagData, id };
  logger.debug(`tag added to storage!`, { tag });
  return tag;
}

export function getTags() {
  const tags = storeRef.current.getState().persistedSlice.tags;
  logger.debug(`got tags from storage`, { tags });
  return tags;
}

export function removeTags(tagIds: Tag['id'][]) {
  logger.debug(`removing tags from storage...`, { tagIds });

  const tags = objects.deepCopyJson(storeRef.current.getState().persistedSlice.tags);
  for (const tagId of tagIds) {
    delete tags[tagId];
  }
  dispatchRef.current(actions.storeValue({ key: STORAGE_KEY.TAGS, value: tags }));

  logger.debug(`tags removed from storage!`);
}
