import { render } from '@app/ui/Root';
import { StorageState } from '@app/global-state/slices/persisted.slice';
import { createClipboard } from '@app/platform/clipboard';
import { createFileSystem } from '@app/platform/file-system';
import { createNativeHost } from '@app/platform/native-host';
import { createPersistentStorage } from '@app/platform/persistent-storage';

async function rendererScriptEntryPoint() {
  // wait for preload script to finish
  await window.preload.initializationPromise;

  // add CSS styles for file icon theme
  // (derived from https://github.com/microsoft/vscode/blob/6f47f12c4d3f4f1b35c3ecb057abb62f9d3a4a49/src/vs/workbench/services/themes/browser/workbenchThemeService.ts#L725-L736)
  const elStyle = document.createElement('style');
  elStyle.type = 'text/css';
  elStyle.textContent = window.privileged.fileIconTheme.iconThemeCssRules;
  document.head.appendChild(elStyle);

  // read persisted data and initialize platform modules
  const storageState: StorageState | Partial<StorageState> =
    await window.privileged.persistentDataStorage.read();
  const preloadedPersistedData = {
    tags: {},
    resourcesToTags: {},
    ...storageState,
  };
  await window.privileged.persistentDataStorage.write(preloadedPersistedData);

  const clipboard = createClipboard();
  const fileSystem = createFileSystem();
  const nativeHost = createNativeHost();
  const persistentStorage = createPersistentStorage();

  // render React application
  render({
    clipboard,
    fileIconTheme: window.privileged.fileIconTheme,
    fileSystem,
    nativeHost,
    persistentStorage,
    preloadedPersistedData,
  });
}

void rendererScriptEntryPoint();
