import { Emitter, Event } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';

import { FileToTags, Tag } from '@app/domain/types';

export enum STORAGE_KEY {
  TAGS = 'tags',
  RESOURCES_TO_TAGS = 'resourcesToTags',
}

type STORAGE_TYPE = {
  tags?: { [id in Tag['id']]: Omit<Tag, 'id'> };
  resourcesToTags?: FileToTags;
};

export type PlatformStorage = {
  store: <T extends STORAGE_KEY>(key: T, value: STORAGE_TYPE[T]) => void;
  get: <T extends STORAGE_KEY>(key: T) => STORAGE_TYPE[T];
  onDataChanged: Event<STORAGE_KEY>;
};

export const createStorage = () => {
  const onDataChanged = new Emitter<STORAGE_KEY>();

  const instance: PlatformStorage = {
    store: (key, value) => {
      window.preload.storeSet(key, value);
      onDataChanged.fire(key);
    },
    get: (key) => {
      return window.preload.storeGet(key) as any;
    },
    onDataChanged: onDataChanged.event,
  };

  return instance;
};
