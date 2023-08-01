import type { IpcMainInvokeEvent } from 'electron';
import { ipcMain } from 'electron';
import type Store from 'electron-store';

import type { IpcPersistentStore } from '#pkg/platform/electron/ipc/common/persistent-store';
import { PERSISTENT_STORE_CHANNEL } from '#pkg/platform/electron/ipc/common/persistent-store';

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
