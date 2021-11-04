import { assertThat } from '@app/base/utils/assert.util';

export enum ELECTRON_PROCESS_TYPE {
  MAIN = 'MAIN',
  RENDERER = 'RENDERER',
  WORKER = 'WORKER',
}

// https://www.electronjs.org/docs/latest/api/process#processtype-readonly
export let typeOfActiveElectronProcess: ELECTRON_PROCESS_TYPE;

try {
  typeOfActiveElectronProcess =
    process === undefined || process.type === undefined || process.type === 'renderer'
      ? ELECTRON_PROCESS_TYPE.RENDERER
      : process.type === 'browser'
      ? ELECTRON_PROCESS_TYPE.MAIN
      : process.type === 'worker'
      ? ELECTRON_PROCESS_TYPE.WORKER
      : assertThat.isUnreachable(process.type);
} catch (err) {
  if (err instanceof ReferenceError) {
    // process is not defined in the renderer process outside of the preload script --> should be the renderer process main_window script
    typeOfActiveElectronProcess = ELECTRON_PROCESS_TYPE.RENDERER;
  } else {
    throw err;
  }
}
