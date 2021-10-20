import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { check } from '@app/base/utils/assert.util';
import { FileDragStart } from '@app/ipc/common/file-drag-start';

export type PlatformNativeHost = {
  revealResourcesInOS(resources: UriComponents[]): void;
  openPath: (path: string) => Promise<void>;
  getNativeFileIconDataURL: (args: { fsPath: string }) => Promise<string | undefined>;
  startNativeFileDnD: (args: FileDragStart.Args) => FileDragStart.ReturnValue;
};

export const createNativeHost = () => {
  const instance: PlatformNativeHost = {
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
