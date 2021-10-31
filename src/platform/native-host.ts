import { Emitter, Event } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

export type PlatformNativeHost = {
  app: {
    getNativeFileIconDataURL: (args: { fsPath: string }) => Promise<string | undefined>;
  };
  shell: {
    revealResourcesInOS(resources: UriComponents[]): Promise<void>;
    openPath: (resources: UriComponents[]) => Promise<void>;
  };
  window: {
    minimize: () => Promise<void>;
    toggleMaximized: () => Promise<void>;
    close: () => Promise<void>;
  };
  clipboard: {
    readResources(): UriComponents[];
    writeResources(resources: UriComponents[]): void;
    onClipboardChanged: Event<void>;
  };
  webContents: {
    startNativeFileDnD: (resource: UriComponents) => void;
  };
};

export const createNativeHost = () => {
  const onClipboardChanged = new Emitter<void>();

  const instance: PlatformNativeHost = {
    app: {
      getNativeFileIconDataURL: window.privileged.app.getNativeFileIconDataURL,
    },
    shell: {
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
    },
    window: {
      minimize: window.privileged.window.minimize,
      toggleMaximized: window.privileged.window.toggleMaximized,
      close: window.privileged.window.close,
    },
    clipboard: {
      readResources: window.privileged.clipboard.readResources,
      writeResources: (resources) => {
        if (resources.length) {
          window.privileged.clipboard.writeResources(resources.map((r) => URI.from(r)));
          onClipboardChanged.fire();
        }
      },
      onClipboardChanged: onClipboardChanged.event,
    },
    webContents: {
      startNativeFileDnD: (resource) =>
        window.privileged.webContents.fileDragStart({ fsPath: URI.from(resource).fsPath }),
    },
  };

  return instance;
};
