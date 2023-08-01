import * as ReactDOM from 'react-dom/client';
import invariant from 'tiny-invariant';

import { createStoreInstance } from '#pkg/global-state/store';
import { setGlobalModules } from '#pkg/operations/global-modules';
import {
  readStorageState,
  reviveGlobalStateFromStorageState,
} from '#pkg/operations/storage-state.operations';
import { createLogWriter } from '#pkg/platform/browser/log-writer';
import { createFileIconThemeLoader } from '#pkg/platform/electron/file-icon-theme-loader';
import { createFileSystem } from '#pkg/platform/electron/file-system';
import { createNativeHost } from '#pkg/platform/electron/native-host';
import { createPersistentStorage } from '#pkg/platform/electron/persistent-storage';
import { createQueryClient, Globals } from '#pkg/ui/Globals';
import { Shell } from '#pkg/ui/shell';

async function rendererScriptEntryPoint() {
  // set up platform modules
  setGlobalModules({
    fileIconThemeLoader: createFileIconThemeLoader(),
    fileSystem: createFileSystem(),
    logWriter: createLogWriter(),
    nativeHost: createNativeHost(),
    persistentStorage: createPersistentStorage(),
  });

  // boot global state (redux) from (possibly) persisted data, and initialize empty global cache (react-query)
  const persistedStorageState = await readStorageState();
  const preloadedGlobalState = await reviveGlobalStateFromStorageState(persistedStorageState);
  const store = await createStoreInstance({ preloadedState: preloadedGlobalState });
  const queryClient = createQueryClient();

  // render React application
  const rootContainer = document.getElementById('root');
  invariant(rootContainer);
  ReactDOM.createRoot(rootContainer).render(
    <Globals queryClient={queryClient} store={store}>
      <Shell />
    </Globals>,
  );
}

void rendererScriptEntryPoint();
