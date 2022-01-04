import ReactDOM from 'react-dom';
import invariant from 'tiny-invariant';

import { createStoreInstance } from '@app/global-state/store';
import {
  fileIconThemeLoaderRef,
  fileSystemRef,
  logWriterRef,
  nativeHostRef,
  persistentStorageRef,
} from '@app/operations/global-modules';
import {
  readStorageState,
  reviveGlobalStateFromStorageState,
} from '@app/operations/storage-state.operations';
import { createLogWriter } from '@app/platform/browser/log-writer';
import { createFileIconThemeLoader } from '@app/platform/electron/file-icon-theme-loader';
import { createFileSystem } from '@app/platform/electron/file-system';
import { createNativeHost } from '@app/platform/electron/native-host';
import { createPersistentStorage } from '@app/platform/electron/persistent-storage';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

async function rendererScriptEntryPoint() {
  // set up platform modules
  fileIconThemeLoaderRef.current = createFileIconThemeLoader();
  fileSystemRef.current = createFileSystem();
  logWriterRef.current = createLogWriter();
  nativeHostRef.current = createNativeHost();
  persistentStorageRef.current = createPersistentStorage();

  // boot global state (redux) from (possibly) persisted data, and initialize empty global cache (react-query)
  const persistedStorageState = await readStorageState();
  const preloadedGlobalState = await reviveGlobalStateFromStorageState(persistedStorageState);
  const store = await createStoreInstance({ preloadedState: preloadedGlobalState });
  const queryClient = createQueryClient();

  // render React application
  const rootContainer = document.getElementById('root');
  invariant(rootContainer);
  ReactDOM.render(
    <Globals queryClient={queryClient} store={store}>
      <Shell />
    </Globals>,
    rootContainer,
  );
}

void rendererScriptEntryPoint();
