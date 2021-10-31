import { ipcMain, IpcMainInvokeEvent } from 'electron';
import Store from 'electron-store';

import { IpcPersistentStore, PERSISTENT_STORE_CHANNEL } from '@app/ipc/common/persistent-store';

const store = new Store();

export function registerListeners(): void {
  ipcMain.handle(PERSISTENT_STORE_CHANNEL.READ_PERSISTED_DATA, readPersistedData);
  ipcMain.handle(PERSISTENT_STORE_CHANNEL.PERSIST_DATA, persistData);
}

function persistData(
  _1: IpcMainInvokeEvent,
  data: IpcPersistentStore.PersistData.Args,
): IpcPersistentStore.PersistData.ReturnValue {
  store.store = data;
}

function readPersistedData(
  _1: IpcMainInvokeEvent,
  _2: IpcPersistentStore.ReadPersistedData.Args,
): IpcPersistentStore.ReadPersistedData.ReturnValue {
  return store.store;
}
