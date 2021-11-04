import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';

import { ELECTRON_PROCESS_TYPE, typeOfActiveElectronProcess } from '@app/base/utils/electron.util';

if (typeOfActiveElectronProcess !== ELECTRON_PROCESS_TYPE.RENDERER) {
  throw new Error(`should be in renderer process here, but is not`);
}

export const FILE_ICON_THEME_RELATIVE_PATH = './static/icon-theme/';
export const LANGUAGE_EXTENSIONS_JSON_FILE_RELATIVE_PATH = path.join(
  FILE_ICON_THEME_RELATIVE_PATH,
  'language-extension-points.json',
);
