import { ipcMain, IpcMainInvokeEvent } from 'electron';
import invariant from 'tiny-invariant';

import type { WindowRef } from '@app/index';
import { IpcWindow, WINDOW_CHANNEL } from '@app/ipc/common/window';

export function registerListeners(windowRef: WindowRef): void {
  const minimizeHandler = createWindowMinimizeHandler(windowRef);
  const toggleMaximizeHandler = createWindowToggleMaximizeHandler(windowRef);
  const closeHandler = createWindowCloseHandler(windowRef);
  ipcMain.handle(WINDOW_CHANNEL.MINIMIZE, minimizeHandler);
  ipcMain.handle(WINDOW_CHANNEL.TOGGLE_MAXIMIZE, toggleMaximizeHandler);
  ipcMain.handle(WINDOW_CHANNEL.CLOSE, closeHandler);
}

function createWindowMinimizeHandler(windowRef: WindowRef) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: IpcWindow.Minimize.Args,
  ): Awaited<IpcWindow.Minimize.ReturnValue> {
    invariant(windowRef.current);
    windowRef.current.minimize();
  };
}

function createWindowToggleMaximizeHandler(windowRef: WindowRef) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: IpcWindow.ToggleMaximize.Args,
  ): Awaited<IpcWindow.ToggleMaximize.ReturnValue> {
    invariant(windowRef.current);
    windowRef.current.isMaximized() ? windowRef.current.unmaximize() : windowRef.current.maximize();
  };
}

function createWindowCloseHandler(windowRef: WindowRef) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: IpcWindow.Close.Args,
  ): Awaited<IpcWindow.Close.ReturnValue> {
    invariant(windowRef.current);
    windowRef.current.close();
  };
}
