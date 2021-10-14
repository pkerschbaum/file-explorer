import { URI } from '@pkerschbaum/code-oss-file-icon-theme/out/vs/base/common/uri';
import * as path from '@pkerschbaum/code-oss-file-icon-theme/out/vs/base/common/path';

export const EXTENSIONS_DIRECTORY_URI = URI.file(
  path.join(__dirname, 'static', 'icon-theme', 'language-extensions'),
);
export const FILE_ICON_PATH_FRAGMENT = 'PKief.material-icon-theme-4.10.0';
export const FILE_ICON_THEME_URI = URI.file(
  path.join(__dirname, 'static', 'icon-theme', FILE_ICON_PATH_FRAGMENT, 'extension'),
);
export const FILE_ICON_THEME_PATH_REPLACE_REGEX = /vscode-file:.+\/static\/icon-theme\//g;
export const FILE_ICON_THEME_RELATIVE_PATH = './static/icon-theme/';

export const OUTLINE_INSERT_DRIVE_FILE_ICON_PATH = path.join(
  __dirname,
  'static',
  'outline_insert_drive_file_black_24dp.png',
);
