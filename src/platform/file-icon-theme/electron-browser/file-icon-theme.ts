import {
  CONTEXT_BRIDGE_KEY,
  FileIconThemeIpcRenderer,
} from '@app/platform/file-icon-theme/common/file-icon-theme';

declare global {
  interface Window {
    [CONTEXT_BRIDGE_KEY]: FileIconThemeIpcRenderer;
  }
}
