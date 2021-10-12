import { app, clipboard, ipcRenderer, shell } from 'electron';
import Store from 'electron-store';

import { URI } from 'code-oss-file-service/out/vs/base/common/uri';
import { VSBuffer } from 'code-oss-file-service/out/vs/base/common/buffer';
import { Schemas } from 'code-oss-file-service/out/vs/base/common/network';

import { bootstrapModule as bootstrapFileServiceModule } from '@app/platform/logic/file-service/file-service';
import {
  bootstrapModule as bootstrapFileIconThemeModule,
  FileIconTheme,
} from '@app/platform/logic/file-icon-theme/file-icon-theme';
import { FileDragStart, FILEDRAGSTART_CHANNEL } from '@app/ipc/common/file-drag-start';
import { TRASHITEM_CHANNEL } from '@app/ipc/common/trash-item';

declare global {
  interface Window {
    preload: {
      initializationPromise: Promise<void>;
      fileService: ReturnType<typeof bootstrapFileServiceModule>['fileService'];
      fileIconTheme: FileIconTheme;
      startNativeFileDnD: (args: FileDragStart.Args) => FileDragStart.ReturnValue;
      getNativeFileIconDataURL: (args: { fsPath: string }) => Promise<string | undefined>;
      shellOpenPath: typeof shell.openPath;
      shellTrashItem: typeof shell.trashItem;
      clipboardReadResources: () => URI[];
      clipboardWriteResources: (resources: URI[]) => void;
      storeSet: (key: string, value: unknown) => void;
      storeGet: (key: string) => unknown;
      revealResourcesInOS: (resources: URI[]) => void;
    };
  }
}

const CLIPBOARD_FILELIST_FORMAT = 'nex/file-list';

const store = new Store();

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
    getNativeFileIconDataURL: async ({ fsPath }) => {
      const icon = await app.getFileIcon(fsPath, { size: 'large' });
      return icon.toDataURL();
    },
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
    storeSet: (...args) => store.set(...args),
    storeGet: (...args) => store.get(...args),
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
