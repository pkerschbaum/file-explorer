import { clipboard, ipcRenderer } from 'electron';

import { VSBuffer } from '@app/base/buffer';
import { fileServiceUriInstancesToComponents, PlatformFileService } from '@app/base/fileService';
import { URI, UriComponents } from '@app/base/uri';
import { config } from '@app/config';
import { bootstrapDiskFileService } from '@app/platform/electron/electron-preload/bootstrap-disk-file-service';
import type { IpcApp } from '@app/platform/electron/ipc/common/app';
import { APP_CHANNEL } from '@app/platform/electron/ipc/common/app';
import type { IpcFileDragStart } from '@app/platform/electron/ipc/common/file-drag-start';
import { FILEDRAGSTART_CHANNEL } from '@app/platform/electron/ipc/common/file-drag-start';
import { PERSISTENT_STORE_CHANNEL } from '@app/platform/electron/ipc/common/persistent-store';
import type { IpcShell } from '@app/platform/electron/ipc/common/shell';
import { SHELL_CHANNEL } from '@app/platform/electron/ipc/common/shell';
import type { IpcWindow } from '@app/platform/electron/ipc/common/window';
import { WINDOW_CHANNEL } from '@app/platform/electron/ipc/common/window';

declare global {
  interface Window {
    privileged: Privileged;
  }
}

type Privileged = {
  processEnv: NodeJS.ProcessEnv;
  fileService: PlatformFileService;
  app: {
    getPath: (args: IpcApp.GetPath.Args) => IpcApp.GetPath.ReturnValue;
  };
  shell: {
    openPath: (args: IpcShell.OpenPath.Args) => IpcShell.OpenPath.ReturnValue;
    trashItem: (args: IpcShell.TrashItem.Args) => IpcShell.TrashItem.ReturnValue;
    revealResourcesInOS: (
      args: IpcShell.ShowItemInFolder.Args,
    ) => IpcShell.ShowItemInFolder.ReturnValue;
  };
  window: {
    minimize: (args: IpcWindow.Minimize.Args) => IpcWindow.Minimize.ReturnValue;
    toggleMaximized: (args: IpcWindow.ToggleMaximize.Args) => IpcWindow.ToggleMaximize.ReturnValue;
    close: (args: IpcWindow.Close.Args) => IpcWindow.Close.ReturnValue;
  };
  clipboard: {
    readText: () => string;
    writeText: (value: string) => void;
    readResources: () => UriComponents[];
    writeResources: (resources: UriComponents[]) => void;
  };
  webContents: {
    fileDragStart: (args: IpcFileDragStart.Args) => IpcFileDragStart.ReturnValue;
  };
  persistentDataStorage: {
    write: (entireValue: Record<string, unknown>) => Promise<void>;
    read: () => Promise<Record<string, unknown>>;
  };
};

const CLIPBOARD_FILELIST_FORMAT = `${config.productName}/file-list`;

export function initializePrivilegedPlatformModules() {
  const fileService = bootstrapDiskFileService();

  window.privileged = {
    // eslint-disable-next-line node/no-process-env
    processEnv: process.env,
    fileService: fileServiceUriInstancesToComponents(fileService),
    app: {
      getPath: (...args) => ipcRenderer.invoke(APP_CHANNEL.GET_PATH, ...args),
    },
    shell: {
      openPath: (...args) => ipcRenderer.invoke(SHELL_CHANNEL.OPEN_PATH, ...args),
      trashItem: (...args) => ipcRenderer.invoke(SHELL_CHANNEL.TRASH_ITEM, ...args),
      revealResourcesInOS: (...args) =>
        ipcRenderer.invoke(SHELL_CHANNEL.SHOW_ITEM_IN_FOLDER, ...args),
    },
    window: {
      minimize: (...args) => ipcRenderer.invoke(WINDOW_CHANNEL.MINIMIZE, ...args),
      toggleMaximized: (...args) => ipcRenderer.invoke(WINDOW_CHANNEL.TOGGLE_MAXIMIZE, ...args),
      close: (...args) => ipcRenderer.invoke(WINDOW_CHANNEL.CLOSE, ...args),
    },
    clipboard: {
      readText: () => clipboard.readText(),
      writeText: (value) => clipboard.writeText(value),
      readResources: () => bufferToResources(clipboard.readBuffer(CLIPBOARD_FILELIST_FORMAT)),
      writeResources: (resources) =>
        clipboard.writeBuffer(
          CLIPBOARD_FILELIST_FORMAT,
          Buffer.from(resourcesToBuffer(resources)),
          undefined,
        ),
    },
    webContents: {
      fileDragStart: (args) => {
        ipcRenderer.send(FILEDRAGSTART_CHANNEL, args);
      },
    },
    persistentDataStorage: {
      write: (...args) => ipcRenderer.invoke(PERSISTENT_STORE_CHANNEL.PERSIST_DATA, ...args),
      read: (...args) => ipcRenderer.invoke(PERSISTENT_STORE_CHANNEL.READ_PERSISTED_DATA, ...args),
    },
  };
}

function bufferToResources(buffer: Uint8Array): UriComponents[] {
  if (!buffer) {
    return [];
  }

  const bufferValue = VSBuffer.wrap(buffer).toString();
  if (!bufferValue) {
    return [];
  }

  try {
    return bufferValue.split('\n').map((f) => URI.parse(f));
  } catch {
    return []; // do not trust clipboard data
  }
}

function resourcesToBuffer(resources: UriComponents[]): Uint8Array {
  return VSBuffer.fromString(resources.map((r) => r.toString()).join('\n')).buffer;
}
