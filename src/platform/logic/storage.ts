import { Emitter, Event } from 'code-oss-file-service/out/vs/base/common/event';

import { FileToTags, Tag } from '@app/platform/file-types';

export enum STORAGE_KEY {
  TAGS = 'tags',
  RESOURCES_TO_TAGS = 'resourcesToTags',
}

type STORAGE_TYPE = {
  tags?: { [id in Tag['id']]: Omit<Tag, 'id'> };
  resourcesToTags?: FileToTags;
};

export type NexStorage = {
  store: <T extends STORAGE_KEY>(key: T, value: STORAGE_TYPE[T]) => void;
  get: <T extends STORAGE_KEY>(key: T) => STORAGE_TYPE[T];
  onDataChanged: Event<STORAGE_KEY>;
};

export class NexStorageImpl implements NexStorage {
  private readonly _onDataChanged = new Emitter<STORAGE_KEY>();

  public store = <T extends STORAGE_KEY>(key: T, value: STORAGE_TYPE[T]) => {
    window.preload.storeSet(key, value);
    this._onDataChanged.fire(key);
  };

  public get = <T extends STORAGE_KEY>(key: T): STORAGE_TYPE[T] => {
    return window.preload.storeGet(key) as STORAGE_TYPE[T];
  };

  public onDataChanged = this._onDataChanged.event;
}
