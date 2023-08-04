import * as ReactDOM from 'react-dom/client';
import invariant from 'tiny-invariant';

import { createFileIconThemeLoader } from '@file-explorer/agent/file-explorer-agent-client/file-icon-theme-loader';
import { createFileSystem } from '@file-explorer/agent/file-explorer-agent-client/file-system';
import { createNativeHost } from '@file-explorer/agent/file-explorer-agent-client/native-host';
import { createPersistentStorage } from '@file-explorer/agent/file-explorer-agent-client/persistent-storage';
import { createLogWriter } from '@file-explorer/platform/browser/log-writer';

import { createStoreInstance } from '#pkg/global-state/store';
import { setGlobalModules } from '#pkg/operations/global-modules';
import {
  readStorageState,
  reviveGlobalStateFromStorageState,
} from '#pkg/operations/storage-state.operations';
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
  const rootContainer = document.querySelector('#root');
  invariant(rootContainer);
  ReactDOM.createRoot(rootContainer).render(
    <Globals queryClient={queryClient} store={store}>
      <Shell />
    </Globals>,
  );
}

void rendererScriptEntryPoint();
