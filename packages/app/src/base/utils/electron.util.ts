import { assertIsUnreachable } from '#pkg/base/utils/assert.util';

export const safe_process = (function safe_readVariable() {
  try {
    return process;
  } catch (error) {
    if (error instanceof ReferenceError) {
      // process is not defined in the renderer process outside of the preload script --> return undefined
      return undefined;
    } else {
      throw error;
    }
  }
})();

export const safe_window = (function safe_readVariable() {
  try {
    return window;
  } catch (error) {
    if (error instanceof ReferenceError) {
      // window is not defined in the main process --> return undefined
      return undefined;
    } else {
      throw error;
    }
  }
})();

export enum ELECTRON_PROCESS_TYPE {
  MAIN = 'MAIN',
  RENDERER = 'RENDERER',
  WORKER = 'WORKER',
  UTILITY = 'UTILITY',
}

// https://www.electronjs.org/docs/latest/api/process#processtype-readonly
export const typeOfActiveElectronProcess: ELECTRON_PROCESS_TYPE =
  safe_process?.type === undefined || safe_process.type === 'renderer'
    ? ELECTRON_PROCESS_TYPE.RENDERER
    : safe_process.type === 'browser'
    ? ELECTRON_PROCESS_TYPE.MAIN
    : safe_process.type === 'worker'
    ? ELECTRON_PROCESS_TYPE.WORKER
    : safe_process.type === 'utility'
    ? ELECTRON_PROCESS_TYPE.UTILITY
    : assertIsUnreachable(safe_process.type);
