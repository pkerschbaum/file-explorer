import { StorageState } from '@app/global-state/slices/persisted.slice';
import { createClipboard } from '@app/platform/clipboard';
import { createFileSystem } from '@app/platform/file-system';
import { createNativeHost } from '@app/platform/native-host';
import { createPersistentStorage } from '@app/platform/persistent-storage';
import { addIconThemeCssRulesToHead } from '@app/ui/file-icon-theme';
import { render } from '@app/ui/Root';

async function rendererScriptEntryPoint() {
  // wait for preload script to finish
  await window.preload.initializationPromise;

  const iconThemeCssRules = await window.privileged.fileIconTheme.loadCssRules();
  addIconThemeCssRulesToHead(iconThemeCssRules);

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
