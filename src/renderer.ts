import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import { render } from '@app/ui/Root';
import { NexFileSystemImpl } from '@app/platform/logic/file-system';
import { NexClipboardImpl } from '@app/platform/logic/clipboard';
import { NexStorageImpl } from '@app/platform/logic/storage';

async function rendererScriptEntryPoint() {
  await window.preload.initializationPromise;

  // add CSS styles for file icon theme
  // (derived from https://github.com/microsoft/vscode/blob/6f47f12c4d3f4f1b35c3ecb057abb62f9d3a4a49/src/vs/workbench/services/themes/browser/workbenchThemeService.ts#L725-L736)
  const elStyle = document.createElement('style');
  elStyle.type = 'text/css';
  elStyle.textContent = window.preload.fileIconTheme.iconThemeCssRules;
  document.head.appendChild(elStyle);

  // render React application
  const nexFileSystem = new NexFileSystemImpl();
  const nexClipboard = new NexClipboardImpl();
  const nexStorage = new NexStorageImpl();
  render({
    fileSystem: nexFileSystem,
    clipboard: nexClipboard,
    storage: nexStorage,
  });
}

void rendererScriptEntryPoint();
