import { UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';

import { strings } from '@app/base/utils/strings.util';
import { FileDragStart } from '@app/ipc/common/file-drag-start';

export type NexNativeHost = {
  revealResourcesInOS(resources: UriComponents[]): void;
  openPath: (path: string) => Promise<void>;
  getNativeFileIconDataURL: (args: { fsPath: string }) => Promise<string | undefined>;
  startNativeFileDnD: (args: FileDragStart.Args) => FileDragStart.ReturnValue;
};

export const createNexNativeHost = () => {
  const instance: NexNativeHost = {
    revealResourcesInOS: window.preload.revealResourcesInOS,
    openPath: async (path) => {
      const errorMessage = await window.preload.shellOpenPath(path);
      if (strings.isNotNullishOrEmpty(errorMessage)) {
        throw new Error(`Could not open path, reason: ${errorMessage}`);
      }
    },
    getNativeFileIconDataURL: window.preload.getNativeFileIconDataURL,
    startNativeFileDnD: window.preload.startNativeFileDnD,
  };

  return instance;
};
