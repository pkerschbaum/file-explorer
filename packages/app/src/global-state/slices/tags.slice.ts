import { createAction, createReducer } from '@reduxjs/toolkit';

import type { ResourcesToTags, Tag } from '@app/domain/types';

type TagsMap = {
  [id in Tag['id']]: Omit<Tag, 'id'>;
};

export type TagsState = {
  tags: TagsMap;
  resourcesToTags: ResourcesToTags;
};

type StoreTagsPayload = {
  tags: TagsMap;
};

type StoreResourcesToTagsPayload = {
  resourcesToTags: ResourcesToTags;
};

export const actions = {
  storeTags: createAction<StoreTagsPayload>('TAGS_STORED'),
  storeResourcesToTags: createAction<StoreResourcesToTagsPayload>('RESOURCES_TO_TAGS_STORED'),
};

const INITIAL_STATE: TagsState = {
  tags: {},
  resourcesToTags: {},
};

export const reducer = createReducer(INITIAL_STATE, (builder) =>
  builder
    .addCase(actions.storeTags, (state, action) => {
      state.tags = action.payload.tags;
    })
    .addCase(actions.storeResourcesToTags, (state, action) => {
      state.resourcesToTags = action.payload.resourcesToTags;
    }),
);
