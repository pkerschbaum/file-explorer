import { assertThat } from '@app/base/utils/assert.util';

export enum ELECTRON_PROCESS_TYPE {
  MAIN = 'MAIN',
  RENDERER = 'RENDERER',
  WORKER = 'WORKER',
}

// https://www.electronjs.org/docs/latest/api/process#processtype-readonly
export const typeOfActiveElectronProcess =
  process.type === 'renderer'
    ? ELECTRON_PROCESS_TYPE.RENDERER
    : process.type === 'browser'
    ? ELECTRON_PROCESS_TYPE.MAIN
    : process.type === 'worker'
    ? ELECTRON_PROCESS_TYPE.WORKER
    : assertThat.isUnreachable(process.type);
