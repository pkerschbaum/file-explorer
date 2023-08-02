import { ipcRenderer } from 'electron';

import type { IpcFileDragStart } from '#pkg/platform/electron/ipc/common/file-drag-start';
import { FILEDRAGSTART_CHANNEL } from '#pkg/platform/electron/ipc/common/file-drag-start';

declare global {
  interface Window {
    privileged: Privileged;
  }
}

type Privileged = {
  processEnv: NodeJS.ProcessEnv;
  webContents: {
    fileDragStart: (args: IpcFileDragStart.Args) => IpcFileDragStart.ReturnValue;
  };
};

export function initializePrivilegedPlatformModules() {
  window.privileged = {
    // eslint-disable-next-line node/no-process-env
    processEnv: process.env,
    webContents: {
      fileDragStart: (args) => {
        ipcRenderer.send(FILEDRAGSTART_CHANNEL, args);
      },
    },
  };
}
