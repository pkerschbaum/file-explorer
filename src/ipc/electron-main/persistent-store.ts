import { ipcMain, IpcMainInvokeEvent } from 'electron';
import Store from 'electron-store';

import {
  PersistData,
  PERSISTDATA_CHANNEL,
  ReadPersistedData,
  READPERSISTEDDATA_CHANNEL,
} from '@app/ipc/common/persistent-store';

const store = new Store();

export function registerListeners(): void {
  ipcMain.handle(READPERSISTEDDATA_CHANNEL, readPersistedData);
  ipcMain.handle(PERSISTDATA_CHANNEL, persistData);
}

function persistData(_1: IpcMainInvokeEvent, data: PersistData.Args): PersistData.ReturnValue {
  store.store = data;
}

function readPersistedData(
  _1: IpcMainInvokeEvent,
  _2: ReadPersistedData.Args,
): ReadPersistedData.ReturnValue {
  return store.store;
}
