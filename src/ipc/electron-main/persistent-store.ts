import { ipcMain, IpcMainInvokeEvent } from 'electron';
import type Store from 'electron-store';

import { IpcPersistentStore, PERSISTENT_STORE_CHANNEL } from '@app/ipc/common/persistent-store';

export function registerListeners(store: Store): void {
  const readPersistedData = createReadPersistedDataHandler(store);
  const persistData = createPersistDataHandler(store);
  ipcMain.handle(PERSISTENT_STORE_CHANNEL.READ_PERSISTED_DATA, readPersistedData);
  ipcMain.handle(PERSISTENT_STORE_CHANNEL.PERSIST_DATA, persistData);
}

function createReadPersistedDataHandler(store: Store) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: IpcPersistentStore.ReadPersistedData.Args,
  ): IpcPersistentStore.ReadPersistedData.ReturnValue {
    return store.store;
  };
}

function createPersistDataHandler(store: Store) {
  return function (
    _1: IpcMainInvokeEvent,
    data: IpcPersistentStore.PersistData.Args,
  ): IpcPersistentStore.PersistData.ReturnValue {
    store.store = data;
  };
}
