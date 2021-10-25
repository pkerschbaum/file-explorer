import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { ELECTRON_PROCESS_TYPE, typeOfActiveElectronProcess } from '@app/base/utils/electron.util';

if (typeOfActiveElectronProcess !== ELECTRON_PROCESS_TYPE.RENDERER) {
  throw new Error(`should be in renderer process here, but is not`);
}

export const EXTENSIONS_DIRECTORY_URI = URI.file(
  path.join(__dirname, 'static', 'icon-theme', 'language-extensions'),
);
export const FILE_ICON_THEME_BASE_URI = URI.file(path.join(__dirname, 'static', 'icon-theme'));
export const FILE_ICON_THEME_RELATIVE_PATH = './static/icon-theme/';
