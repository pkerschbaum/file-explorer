import ReactDOM from 'react-dom';

import { createStoreInstance } from '@app/global-state/store';
import {
  fileIconThemeLoaderRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
} from '@app/operations/global-modules';
import {
  readStorageState,
  reviveGlobalStateFromStorageState,
} from '@app/operations/storage-state.operations';
import { createFileIconThemeLoader } from '@app/platform/file-icon-theme-loader';
import { createFileSystem } from '@app/platform/file-system';
import { createNativeHost } from '@app/platform/native-host';
import { createPersistentStorage } from '@app/platform/persistent-storage';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

async function rendererScriptEntryPoint() {
  // set up platform modules
  fileIconThemeLoaderRef.current = createFileIconThemeLoader();
  fileSystemRef.current = createFileSystem();
  nativeHostRef.current = createNativeHost();
  persistentStorageRef.current = createPersistentStorage();

  // boot global state (redux) from (possibly) persisted data, and initialize empty global cache (react-query)
  const persistedStorageState = await readStorageState();
  const preloadedGlobalState = await reviveGlobalStateFromStorageState(persistedStorageState);
  const store = await createStoreInstance({ preloadedState: preloadedGlobalState });
  const queryClient = createQueryClient();

  // render React application
  ReactDOM.render(
    <Globals queryClient={queryClient} store={store}>
      <Shell />
    </Globals>,
    document.getElementById('root'),
  );
}

void rendererScriptEntryPoint();
