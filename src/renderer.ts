import { StorageState } from '@app/global-state/slices/persisted.slice';
import { createFileIconTheme } from '@app/platform/file-icon-theme';
import { createFileSystem } from '@app/platform/file-system';
import { createNativeHost } from '@app/platform/native-host';
import { createPersistentStorage } from '@app/platform/persistent-storage';
import { addIconThemeCssRulesToHead } from '@app/ui/file-icon-theme';
import { render } from '@app/ui/Root';

const FILE_ICON_THEME_PATH_FRAGMENT = 'vscode-icons-team.vscode-icons-11.6.0';

async function rendererScriptEntryPoint() {
  // wait for preload script to finish
  await window.preload.initializationPromise;

  // create platform modules
  const fileIconTheme = createFileIconTheme();
  const fileSystem = createFileSystem();
  const nativeHost = createNativeHost();
  const persistentStorage = createPersistentStorage();

  // load file icon theme and put it into the <head> section
  const iconThemeCssRules = await fileIconTheme.loadCssRules(FILE_ICON_THEME_PATH_FRAGMENT);
  addIconThemeCssRulesToHead(iconThemeCssRules);

  /**
   * Read (possibly) persisted data, fill it up with default values, and execute a write afterwards.
   * This will make sure that from this point on, some data is present in the persistent storage.
   */
  const storageState: StorageState | Partial<StorageState> = await persistentStorage.read();
  const preloadedPersistedData = {
    tags: {},
    resourcesToTags: {},
    ...storageState,
  };
  await persistentStorage.write(preloadedPersistedData);

  // render React application
  render({
    fileIconTheme,
    fileSystem,
    nativeHost,
    persistentStorage,
    preloadedPersistedData,
  });
}

void rendererScriptEntryPoint();
