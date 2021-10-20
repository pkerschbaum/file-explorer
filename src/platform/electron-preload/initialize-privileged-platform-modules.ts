import { clipboard, ipcRenderer, shell } from 'electron';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { VSBuffer } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/buffer';
import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';

import { config } from '@app/config';
import { FileDragStart, FILEDRAGSTART_CHANNEL } from '@app/ipc/common/file-drag-start';
import { GetNativeFileIconDataURL, NATIVEFILEICON_CHANNEL } from '@app/ipc/common/native-file-icon';
import { PERSISTDATA_CHANNEL, READPERSISTEDDATA_CHANNEL } from '@app/ipc/common/persistent-store';
import { TRASHITEM_CHANNEL } from '@app/ipc/common/trash-item';
import {
  bootstrapModule as bootstrapFileIconThemeModule,
  PlatformFileIconTheme,
} from '@app/platform/file-icon-theme';
import {
  bootstrapModule as bootstrapFileServiceModule,
  PlatformFileService,
} from '@app/platform/file-service';

declare global {
  interface Window {
    privileged: Privileged;
  }
}

type Privileged = {
  fileService: PlatformFileService;
  fileIconTheme: PlatformFileIconTheme;
  webContents: {
    fileDragStart: (args: FileDragStart.Args) => FileDragStart.ReturnValue;
  };
  shell: {
    openPath: typeof shell.openPath;
    trashItem: typeof shell.trashItem;
    revealResourcesInOS: (resources: URI[]) => void;
    getNativeFileIconDataURL: (
      args: GetNativeFileIconDataURL.Args,
    ) => GetNativeFileIconDataURL.ReturnValue;
  };
  clipboard: {
    readResources: () => URI[];
    writeResources: (resources: URI[]) => void;
  };
  persistentDataStorage: {
    write: (entireValue: Record<string, unknown>) => Promise<void>;
    read: () => Promise<Record<string, unknown>>;
  };
};

const CLIPBOARD_FILELIST_FORMAT = `${config.productName}/file-list`;

export async function initializePrivilegedPlatformModules() {
  const { fileService } = bootstrapFileServiceModule();
  const fileIconTheme = await bootstrapFileIconThemeModule();

  window.privileged = {
    fileService,
    fileIconTheme,
    webContents: {
      fileDragStart: (args) => {
        ipcRenderer.send(FILEDRAGSTART_CHANNEL, args);
      },
    },
    shell: {
      openPath: (...args) => shell.openPath(...args),
      trashItem: (...args) => ipcRenderer.invoke(TRASHITEM_CHANNEL, ...args),
      revealResourcesInOS: (resources) => {
        for (const r of resources) {
          if (r.scheme === Schemas.file || r.scheme === Schemas.userData) {
            shell.showItemInFolder(r.fsPath);
          }
        }
      },
      getNativeFileIconDataURL: (...args) => ipcRenderer.invoke(NATIVEFILEICON_CHANNEL, ...args),
    },
    clipboard: {
      readResources: () => bufferToResources(clipboard.readBuffer(CLIPBOARD_FILELIST_FORMAT)),
      writeResources: (resources) =>
        clipboard.writeBuffer(
          CLIPBOARD_FILELIST_FORMAT,
          Buffer.from(resourcesToBuffer(resources)),
          undefined,
        ),
    },
    persistentDataStorage: {
      write: (...args) => ipcRenderer.invoke(PERSISTDATA_CHANNEL, ...args),
      read: (...args) => ipcRenderer.invoke(READPERSISTEDDATA_CHANNEL, ...args),
    },
  };
}

function bufferToResources(buffer: Uint8Array): URI[] {
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

function resourcesToBuffer(resources: URI[]): Uint8Array {
  return VSBuffer.fromString(resources.map((r) => r.toString()).join('\n')).buffer;
}
