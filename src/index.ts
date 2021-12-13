import { isWindows } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import { app, BrowserWindow, protocol } from 'electron';
import Store from 'electron-store';
import invariant from 'tiny-invariant';

import { config } from '@app/config';
import { registerListeners as registerAppListeners } from '@app/platform/electron/ipc/electron-main/app';
import { registerListeners as registerFileDragStartListeners } from '@app/platform/electron/ipc/electron-main/file-drag-start';
import { registerListeners as registerPersistentStoreListeners } from '@app/platform/electron/ipc/electron-main/persistent-store';
import { registerListeners as registerShellListeners } from '@app/platform/electron/ipc/electron-main/shell';
import { registerListeners as registerWindowListeners } from '@app/platform/electron/ipc/electron-main/window';
import { NATIVE_FILE_ICON_PROTOCOL_SCHEME } from '@app/platform/electron/protocol/common/app';
import { registerProtocols as registerAppProtocols } from '@app/platform/electron/protocol/electron-main/app';
import type { StorageState } from '@app/platform/persistent-storage.types';
import { AvailableTheme, defaultTheme, THEMES } from '@app/ui/components-library';

// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

export type WindowRef = { current?: BrowserWindow };
const mainWindowRef: WindowRef = { current: undefined };

// In production, allow only one instance of the app to run at any moment (https://www.electronjs.org/docs/latest/api/app#apprequestsingleinstancelock)
if (!config.isDevEnviroment) {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
  }

  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (!mainWindowRef.current) {
      return;
    }

    if (mainWindowRef.current.isMinimized()) {
      mainWindowRef.current.restore();
    }
    mainWindowRef.current.focus();
  });
}

// Register native-file-icon protocol as privileged
protocol.registerSchemesAsPrivileged([
  {
    scheme: NATIVE_FILE_ICON_PROTOCOL_SCHEME,
    privileges: { bypassCSP: true },
  },
]);

// Boot application
const store = new Store();
const activeTheme: AvailableTheme =
  (store.store as StorageState).userState?.preferences.activeTheme ?? defaultTheme;
app.on('ready', () => {
  async function bootstrap() {
    if (config.isDevEnviroment && !process.argv.includes('--noDevServer')) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      await require('./electron-devtools').installExtensions();
    }

    // register IPC handlers
    registerFileDragStartListeners();
    registerAppListeners();
    registerPersistentStoreListeners(store);
    registerShellListeners();
    registerWindowListeners(mainWindowRef);

    // register custom protocols
    registerAppProtocols();

    // create and show window
    mainWindowRef.current = createMainWindow();
    mainWindowRef.current.once('ready-to-show', () => {
      invariant(mainWindowRef.current);
      mainWindowRef.current.maximize();
      mainWindowRef.current.show();
    });
  }

  void bootstrap();
});

function createMainWindow(): BrowserWindow {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    height: 768,
    width: 1366,
    // https://stackoverflow.com/a/62468670/1700319
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: false,
    },
    backgroundColor: THEMES[activeTheme].background[0],
    show: false,
    titleBarStyle: isWindows ? 'hidden' : undefined,
  });
  mainWindow.setMenuBarVisibility(false);

  // Load the index.html of the app.
  void mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (config.isDevEnviroment) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindowRef.current = createMainWindow();
  }
});
