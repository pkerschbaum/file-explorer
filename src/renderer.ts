import { createStoreInstance } from '@app/global-state/store';
import {
  queryClientRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
  storeRef,
  dispatchRef,
} from '@app/operations/global-modules';
import { reviveGlobalStateFromStorageState } from '@app/operations/storage-state.operations';
import { loadCssRules } from '@app/platform/file-icon-theme';
import { createFileSystem } from '@app/platform/file-system';
import { createNativeHost } from '@app/platform/native-host';
import { createPersistentStorage, StorageState } from '@app/platform/persistent-storage';
import {
  FILE_ICON_THEME_PATH_FRAGMENT,
  FILE_ICON_THEME_RELATIVE_PATH,
} from '@app/static-resources-renderer';
import { addIconThemeCssRulesToHead } from '@app/ui/file-icon-theme';
import { createQueryClient } from '@app/ui/Globals';
import { DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED } from '@app/ui/GlobalShortcutsContext';
import { render } from '@app/ui/Root';

const FILE_ICON_THEME_PATH_REPLACE_REGEX = /file:.+\/static\/icon-theme\//g;

async function rendererScriptEntryPoint() {
  // create platform modules
  const fileSystem = createFileSystem();
  const nativeHost = createNativeHost();
  const persistentStorage = createPersistentStorage();

  // load CSS rules of the file icon theme and put them into the <head> section
  const iconThemeCssRules = await loadCssRules({
    fileIconThemeRelativePath: FILE_ICON_THEME_RELATIVE_PATH,
    fileIconThemePathFragment: FILE_ICON_THEME_PATH_FRAGMENT,
    cssRulesPostProcessing: (rawIconThemeCssRules) =>
      rawIconThemeCssRules.replace(
        FILE_ICON_THEME_PATH_REPLACE_REGEX,
        FILE_ICON_THEME_RELATIVE_PATH,
      ),
  });
  addIconThemeCssRulesToHead(iconThemeCssRules);

  // set data attribute which will enable window keydown handlers whenever the <body> element has focus
  const bodyElement = document.querySelector('body');
  if (!bodyElement) {
    throw new Error(`Could not query body element`);
  }
  bodyElement.dataset[DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.attrCamelCased] = 'true';

  // set up global modules
  const queryClient = createQueryClient();
  queryClientRef.current = queryClient;

  fileSystemRef.current = fileSystem;
  nativeHostRef.current = nativeHost;
  persistentStorageRef.current = persistentStorage;

  // boot global state (redux) with (possibly) persisted data
  const persistedStorageState: StorageState = await persistentStorage.read();
  const preloadedGlobalState = await reviveGlobalStateFromStorageState(persistedStorageState);
  const store = await createStoreInstance({ preloadedState: preloadedGlobalState });

  storeRef.current = store;
  dispatchRef.current = store.dispatch;

  // render React application
  render({ queryClient, store });
}

void rendererScriptEntryPoint();
