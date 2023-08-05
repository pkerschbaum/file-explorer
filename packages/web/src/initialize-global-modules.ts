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
import { createQueryClient } from '#pkg/ui/Globals';

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
export const store = await createStoreInstance({ preloadedState: preloadedGlobalState });
export const queryClient = createQueryClient();
