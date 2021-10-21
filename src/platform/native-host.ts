import { Emitter, Event } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { check } from '@app/base/utils/assert.util';
import { FileDragStart } from '@app/ipc/common/file-drag-start';

export type PlatformNativeHost = {
  clipboard: {
    readResources(): URI[];
    writeResources(resources: URI[]): void;
    onClipboardChanged: Event<void>;
  };
  revealResourcesInOS(resources: UriComponents[]): void;
  openPath: (path: string) => Promise<void>;
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
    revealResourcesInOS: window.privileged.shell.revealResourcesInOS,
    openPath: async (path) => {
      const errorMessage = await window.privileged.shell.openPath(path);
      if (check.isNonEmptyString(errorMessage)) {
        throw new Error(`Could not open path, reason: ${errorMessage}`);
      }
    },
    getNativeFileIconDataURL: window.privileged.shell.getNativeFileIconDataURL,
    startNativeFileDnD: window.privileged.webContents.fileDragStart,
  };

  return instance;
};
