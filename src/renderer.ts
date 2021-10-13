import { render } from '@app/ui/Root';
import { createNexClipboard } from '@app/platform/clipboard';
import { createNexFileSystem } from '@app/platform/file-system';
import { createNexNativeHost } from '@app/platform/native-host';
import { createNexStorage } from '@app/platform/storage';

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
  const nexClipboard = createNexClipboard();
  const nexFileSystem = createNexFileSystem();
  const nexStorage = createNexStorage();
  const nexNativeHost = createNexNativeHost();
  render({
    clipboard: nexClipboard,
    fileIconTheme: window.preload.fileIconTheme,
    fileSystem: nexFileSystem,
    storage: nexStorage,
    nativeHost: nexNativeHost,
  });
}

void rendererScriptEntryPoint();
