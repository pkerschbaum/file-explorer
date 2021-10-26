import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';

import { Awaited } from '@app/base/utils/types.util';
import {
  WindowClose,
  WindowMinimize,
  WindowToggleMaximize,
  WINDOW_CLOSE_CHANNEL,
  WINDOW_MINIMIZE_CHANNEL,
  WINDOW_TOGGLEMAXIMIZE_CHANNEL,
} from '@app/ipc/common/window';

export function registerListeners(window: BrowserWindow): void {
  const minimizeHandler = createWindowMinimizeHandler(window);
  const toggleMaximizeHandler = createWindowToggleMaximizeHandler(window);
  const closeHandler = createWindowCloseHandler(window);
  ipcMain.handle(WINDOW_MINIMIZE_CHANNEL, minimizeHandler);
  ipcMain.handle(WINDOW_TOGGLEMAXIMIZE_CHANNEL, toggleMaximizeHandler);
  ipcMain.handle(WINDOW_CLOSE_CHANNEL, closeHandler);
}

function createWindowMinimizeHandler(window: BrowserWindow) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: WindowMinimize.Args,
  ): Awaited<WindowMinimize.ReturnValue> {
    window.minimize();
  };
}

function createWindowToggleMaximizeHandler(window: BrowserWindow) {
  return function (
    _1: IpcMainInvokeEvent,
    _2: WindowToggleMaximize.Args,
  ): Awaited<WindowToggleMaximize.ReturnValue> {
    window.isMaximized() ? window.unmaximize() : window.maximize();
  };
}

function createWindowCloseHandler(window: BrowserWindow) {
  return function (_1: IpcMainInvokeEvent, _2: WindowClose.Args): Awaited<WindowClose.ReturnValue> {
    window.close();
  };
}
