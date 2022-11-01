import { nanoid } from '@reduxjs/toolkit';

import { objects } from '@app/base/utils/objects.util';
import type { Tag } from '@app/domain/types';
import { actions } from '@app/global-state/slices/tags.slice';
import { createLogger } from '@app/operations/create-logger';

const logger = createLogger('tag.hooks');

export function addTag(tagData: Omit<Tag, 'id'>): Tag {
  logger.debug(`adding tag to storage...`, { tagData });

  const tags = objects.deepCopyJson(globalThis.modules.store.getState().tagsSlice.tags);
  const id = nanoid();
  tags[id] = tagData;
  globalThis.modules.dispatch(actions.storeTags({ tags }));

  const tag = { ...tagData, id };
  logger.debug(`tag added to storage!`, { tag });
  return tag;
}

export function getTags() {
  const tags = globalThis.modules.store.getState().tagsSlice.tags;
  logger.debug(`got tags from storage`, { tags });
  return tags;
}

export function removeTags(tagIds: Tag['id'][]) {
  logger.debug(`removing tags from storage...`, { tagIds });

  const tags = objects.deepCopyJson(globalThis.modules.store.getState().tagsSlice.tags);
  for (const tagId of tagIds) {
    delete tags[tagId];
  }
  globalThis.modules.dispatch(actions.storeTags({ tags }));

  logger.debug(`tags removed from storage!`);
}
