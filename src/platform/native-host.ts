import { Emitter, Event } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { FileDragStart } from '@app/ipc/common/file-drag-start';
import { WindowClose, WindowMinimize, WindowToggleMaximize } from '@app/ipc/common/window';

export type PlatformNativeHost = {
  clipboard: {
    readResources(): URI[];
    writeResources(resources: URI[]): void;
    onClipboardChanged: Event<void>;
  };
  window: {
    minimize: (args: WindowMinimize.Args) => WindowMinimize.ReturnValue;
    toggleMaximized: (args: WindowToggleMaximize.Args) => WindowToggleMaximize.ReturnValue;
    close: (args: WindowClose.Args) => WindowClose.ReturnValue;
  };
  revealResourcesInOS(resources: UriComponents[]): Promise<void>;
  openPath: (resources: UriComponents[]) => Promise<void>;
  getNativeFileIconDataURL: (args: { fsPath: string }) => Promise<string | undefined>;
  startNativeFileDnD: (args: FileDragStart.Args) => FileDragStart.ReturnValue;
};

export const createNativeHost = () => {
  const onClipboardChanged = new Emitter<void>();

  const instance: PlatformNativeHost = {
    clipboard: {
      readResources: window.privileged.clipboard.readResources,
      writeResources: (resources) => {
        if (resources.length) {
          window.privileged.clipboard.writeResources(resources);
          onClipboardChanged.fire();
        }
      },
      onClipboardChanged: onClipboardChanged.event,
    },
    window: {
      minimize: window.privileged.window.minimize,
      toggleMaximized: window.privileged.window.toggleMaximized,
      close: window.privileged.window.close,
    },
    revealResourcesInOS: async (resources) => {
      for (const resource of resources) {
        await window.privileged.shell.revealResourcesInOS({ fsPath: URI.from(resource).fsPath });
      }
    },
    openPath: async (resources) => {
      for (const resource of resources) {
        await window.privileged.shell.openPath({ fsPath: URI.from(resource).fsPath });
      }
    },
    getNativeFileIconDataURL: window.privileged.shell.getNativeFileIconDataURL,
    startNativeFileDnD: window.privileged.webContents.fileDragStart,
  };

  return instance;
};
