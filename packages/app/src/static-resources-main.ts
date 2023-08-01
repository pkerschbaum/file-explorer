import { path } from '#pkg/base/path';
import { ELECTRON_PROCESS_TYPE, typeOfActiveElectronProcess } from '#pkg/base/utils/electron.util';

if (typeOfActiveElectronProcess !== ELECTRON_PROCESS_TYPE.MAIN) {
  throw new Error(`should be in main process here, but is not`);
}

export const OUTLINE_INSERT_DRIVE_FILE_ICON_PATH = path.join(
  __dirname,
  '..',
  'renderer',
  'outline_insert_drive_file_black_24dp.png',
);
