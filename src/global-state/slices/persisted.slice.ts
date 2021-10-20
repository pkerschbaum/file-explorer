import { createAction, createReducer } from '@reduxjs/toolkit';

import { assertThat } from '@app/base/utils/assert.util';
import { FileToTags, Tag } from '@app/domain/types';

export enum STORAGE_KEY {
  TAGS = 'tags',
  RESOURCES_TO_TAGS = 'resourcesToTags',
}

export type StorageState = {
  [STORAGE_KEY.TAGS]: { [id in Tag['id']]: Omit<Tag, 'id'> };
  [STORAGE_KEY.RESOURCES_TO_TAGS]: FileToTags;
};

type StoreValuePayload =
  | {
      key: STORAGE_KEY.TAGS;
      value: StorageState[STORAGE_KEY.TAGS];
    }
  | {
      key: STORAGE_KEY.RESOURCES_TO_TAGS;
      value: StorageState[STORAGE_KEY.RESOURCES_TO_TAGS];
    };

export const actions = {
  storeValue: createAction<StoreValuePayload>('VALUE_STORED'),
};

const INITIAL_STATE: StorageState = {
  tags: {},
  resourcesToTags: {},
};

export const reducer = createReducer(INITIAL_STATE, (builder) =>
  builder.addCase(actions.storeValue, (state, action) => {
    if (action.payload.key === STORAGE_KEY.TAGS) {
      state[action.payload.key] = action.payload.value;
    } else if (action.payload.key === STORAGE_KEY.RESOURCES_TO_TAGS) {
      state[action.payload.key] = action.payload.value;
    } else {
      assertThat.isUnreachable(action.payload);
    }
  }),
);
