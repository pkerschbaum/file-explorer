import ReactDOM from 'react-dom';

import { createStoreInstance } from '@app/global-state/store';
import { fileSystemRef, nativeHostRef, persistentStorageRef } from '@app/operations/global-modules';
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
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

const FILE_ICON_THEME_PATH_REPLACE_REGEX = /file:.+\/static\/icon-theme\//g;

async function rendererScriptEntryPoint() {
  // set up platform modules
  const fileSystem = createFileSystem();
  const nativeHost = createNativeHost();
  const persistentStorage = createPersistentStorage();
  fileSystemRef.current = fileSystem;
  nativeHostRef.current = nativeHost;
  persistentStorageRef.current = persistentStorage;

  // boot global state (redux) from (possibly) persisted data, and initialize empty global cache (react-query)
  const persistedStorageState: StorageState = await persistentStorage.read();
  const preloadedGlobalState = await reviveGlobalStateFromStorageState(persistedStorageState);
  const store = await createStoreInstance({ preloadedState: preloadedGlobalState });
  const queryClient = createQueryClient();

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

  // render React application
  ReactDOM.render(
    <Globals queryClient={queryClient} store={store}>
      <Shell />
    </Globals>,
    document.getElementById('root'),
  );
}

void rendererScriptEntryPoint();
