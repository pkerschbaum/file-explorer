import { ipcRenderer } from 'electron';

import type {
  CHANNEL_NATIVE_DND_BACK_TO_MAIN,
  CHANNEL_NATIVE_DND_TO_RENDERER,
} from '#pkg/file-explorer-agent/native-dnd-procedures/constants';

// just a handler running in the electron window starting a drag
ipcRenderer.on(
  'native-dnd-to-renderer' satisfies CHANNEL_NATIVE_DND_TO_RENDERER,
  (_e, ...args: unknown[]) => {
    ipcRenderer.send('native-dnd-back-to-main' satisfies CHANNEL_NATIVE_DND_BACK_TO_MAIN, ...args);
  },
);
