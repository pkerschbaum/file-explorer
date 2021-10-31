import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';

import { Awaited } from '@app/base/utils/types.util';
import { IpcWindow, WINDOW_CHANNEL } from '@app/ipc/common/window';

export function registerListeners(window: BrowserWindow): void {
  const minimizeHandler = createWindowMinimizeHandler(window);
  const toggleMaximizeHandler = createWindowToggleMaximizeHandler(window);
  const closeHandler = createWindowCloseHandler(window);
  ipcMain.handle(WINDOW_CHANNEL.MINIMIZE, minimizeHandler);
  ipcMain.handle(WINDOW_CHANNEL.TOGGLE_MAXIMIZE, toggleMaximizeHandler);
  ipcMain.handle(WINDOW_CHANNEL.CLOSE, closeHandler);
}

function createWindowMinimizeHandler(window: BrowserWindow) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: IpcWindow.Minimize.Args,
  ): Awaited<IpcWindow.Minimize.ReturnValue> {
    window.minimize();
  };
}

function createWindowToggleMaximizeHandler(window: BrowserWindow) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: IpcWindow.ToggleMaximize.Args,
  ): Awaited<IpcWindow.ToggleMaximize.ReturnValue> {
    window.isMaximized() ? window.unmaximize() : window.maximize();
  };
}

function createWindowCloseHandler(window: BrowserWindow) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: IpcWindow.Close.Args,
  ): Awaited<IpcWindow.Close.ReturnValue> {
    window.close();
  };
}
