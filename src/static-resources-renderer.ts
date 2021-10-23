import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';

import { ELECTRON_PROCESS_TYPE, typeOfActiveElectronProcess } from '@app/base/utils/electron.util';

if (typeOfActiveElectronProcess !== ELECTRON_PROCESS_TYPE.RENDERER) {
  throw new Error(`should be in renderer process here, but is not`);
}

export const EXTENSIONS_DIRECTORY_URI = URI.file(
  path.join(__dirname, 'static', 'icon-theme', 'language-extensions'),
);
export const FILE_ICON_PATH_FRAGMENT = 'vscode-icons-team.vscode-icons-11.6.0';
export const FILE_ICON_THEME_URI = URI.file(
  path.join(__dirname, 'static', 'icon-theme', FILE_ICON_PATH_FRAGMENT),
);
export const FILE_ICON_THEME_RELATIVE_PATH = './static/icon-theme/';
