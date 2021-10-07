import {
  CONTEXT_BRIDGE_KEY,
  FileServiceIpcRenderer,
} from '@app/platform/file-service/common/file-service';

declare global {
  interface Window {
    [CONTEXT_BRIDGE_KEY]: FileServiceIpcRenderer;
  }
}
