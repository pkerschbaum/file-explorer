import { Event } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { app } from 'electron';

export type PlatformNativeHost = {
  app: {
    getPath: (args: { name: Parameters<typeof app.getPath>[0] }) => Promise<UriComponents>;
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
