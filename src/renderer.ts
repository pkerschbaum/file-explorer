import { render } from '@app/ui/Root';
import { createClipboard } from '@app/platform/clipboard';
import { createFileSystem } from '@app/platform/file-system';
import { createNativeHost } from '@app/platform/native-host';

async function rendererScriptEntryPoint() {
  // wait for preload script to finish
  await window.preload.initializationPromise;

  // add CSS styles for file icon theme
  // (derived from https://github.com/microsoft/vscode/blob/6f47f12c4d3f4f1b35c3ecb057abb62f9d3a4a49/src/vs/workbench/services/themes/browser/workbenchThemeService.ts#L725-L736)
  const elStyle = document.createElement('style');
  elStyle.type = 'text/css';
  elStyle.textContent = window.preload.fileIconTheme.iconThemeCssRules;
  document.head.appendChild(elStyle);

  // render React application
  const clipboard = createClipboard();
  const fileSystem = createFileSystem();
  const nativeHost = createNativeHost();
  render({
    clipboard,
    fileIconTheme: window.preload.fileIconTheme,
    fileSystem,
    nativeHost,
  });
}

void rendererScriptEntryPoint();
