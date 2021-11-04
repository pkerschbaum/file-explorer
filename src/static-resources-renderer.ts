import { ELECTRON_PROCESS_TYPE, typeOfActiveElectronProcess } from '@app/base/utils/electron.util';

if (typeOfActiveElectronProcess !== ELECTRON_PROCESS_TYPE.RENDERER) {
  throw new Error(`should be in renderer process here, but is not`);
}

export const FILE_ICON_THEME_RELATIVE_PATH = './static/icon-theme/';
export const FILE_ICON_THEME_PATH_FRAGMENT = 'vscode-icons-team.vscode-icons-11.6.0';
