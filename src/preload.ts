import { clipboard, ipcRenderer, shell } from 'electron';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { VSBuffer } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/buffer';
import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';

import { config } from '@app/config';
import { bootstrapModule as bootstrapFileServiceModule } from '@app/platform/file-service';
import {
  bootstrapModule as bootstrapFileIconThemeModule,
  PlatformFileIconTheme,
} from '@app/platform/file-icon-theme';
import { FileDragStart, FILEDRAGSTART_CHANNEL } from '@app/ipc/common/file-drag-start';
import { GetNativeFileIconDataURL, NATIVEFILEICON_CHANNEL } from '@app/ipc/common/native-file-icon';
import { PERSISTDATA_CHANNEL, READPERSISTEDDATA_CHANNEL } from '@app/ipc/common/persistent-store';
import { TRASHITEM_CHANNEL } from '@app/ipc/common/trash-item';

declare global {
  interface Window {
    preload: {
      initializationPromise: Promise<void>;
      fileService: ReturnType<typeof bootstrapFileServiceModule>['fileService'];
      fileIconTheme: PlatformFileIconTheme;
      startNativeFileDnD: (args: FileDragStart.Args) => FileDragStart.ReturnValue;
      getNativeFileIconDataURL: (
        args: GetNativeFileIconDataURL.Args,
      ) => GetNativeFileIconDataURL.ReturnValue;
      shellOpenPath: typeof shell.openPath;
      shellTrashItem: typeof shell.trashItem;
      clipboardReadResources: () => URI[];
      clipboardWriteResources: (resources: URI[]) => void;
      persistData: (entireValue: Record<string, unknown>) => Promise<void>;
      readPersistedData: () => Promise<Record<string, unknown>>;
      revealResourcesInOS: (resources: URI[]) => void;
    };
  }
}

const CLIPBOARD_FILELIST_FORMAT = `${config.productName}/file-list`;

window.preload = {} as any;
window.preload.initializationPromise = (async function preloadScriptEntryPoint() {
  const { fileService } = bootstrapFileServiceModule();
  const fileIconTheme = await bootstrapFileIconThemeModule(fileService);

  window.preload = {
    ...window.preload,
    fileService,
    fileIconTheme,
    startNativeFileDnD: (args) => {
      ipcRenderer.send(FILEDRAGSTART_CHANNEL, args);
    },
    getNativeFileIconDataURL: (...args) => ipcRenderer.invoke(NATIVEFILEICON_CHANNEL, ...args),
    shellOpenPath: (...args) => shell.openPath(...args),
    shellTrashItem: (...args) => ipcRenderer.invoke(TRASHITEM_CHANNEL, ...args),
    clipboardReadResources: () =>
      bufferToResources(clipboard.readBuffer(CLIPBOARD_FILELIST_FORMAT)),
    clipboardWriteResources: (resources) =>
      clipboard.writeBuffer(
        CLIPBOARD_FILELIST_FORMAT,
        Buffer.from(resourcesToBuffer(resources)),
        undefined,
      ),
    persistData: (...args) => ipcRenderer.invoke(PERSISTDATA_CHANNEL, ...args),
    readPersistedData: (...args) => ipcRenderer.invoke(READPERSISTEDDATA_CHANNEL, ...args),
    revealResourcesInOS: (resources) => {
      for (const r of resources) {
        if (r.scheme === Schemas.file || r.scheme === Schemas.userData) {
          shell.showItemInFolder(r.fsPath);
        }
      }
    },
  };
})();

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
