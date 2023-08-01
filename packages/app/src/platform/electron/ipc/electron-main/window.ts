import type { IpcMainInvokeEvent } from 'electron';
import { ipcMain } from 'electron';
import invariant from 'tiny-invariant';

import type { WindowRef } from '#pkg/index';
import type { IpcWindow } from '#pkg/platform/electron/ipc/common/window';
import { WINDOW_CHANNEL } from '#pkg/platform/electron/ipc/common/window';

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
