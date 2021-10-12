import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline } from '@mui/material';
import { enUS } from '@mui/material/locale';

import { NexClipboard } from '@app/platform/logic/clipboard';
import { NexFileSystem } from '@app/platform/logic/file-system';
import { NexNativeHost } from '@app/platform/logic/native-host';
import { NexStorage } from '@app/platform/logic/storage';
import { Shell } from '@app/ui/Shell';
import { createTheme } from '@app/ui/theme';
import { ThemeProvider } from '@app/ui/theme.provider';
import { store } from '@app/platform/store/store';
import { ClipboardResourcesContext, NexClipboardProvider } from '@app/ui/NexClipboard.context';
import { NexFileIconThemeProvider } from '@app/ui/NexFileIconTheme.context';
import { NexFileSystemProvider } from '@app/ui/NexFileSystem.context';
import { NexNativeHostProvider } from '@app/ui/NexNativeHost.context';
import { NexStorageProvider } from '@app/ui/NexStorage.context';
import { FileIconTheme } from '@app/platform/logic/file-icon-theme/file-icon-theme';

const queryClient = new QueryClient();
const theme = createTheme(enUS);

type AppDependencies = {
  clipboard: NexClipboard;
  fileIconTheme: FileIconTheme;
  fileSystem: NexFileSystem;
  nativeHost: NexNativeHost;
  storage: NexStorage;
};

export function render(appDependencies: AppDependencies) {
  ReactDOM.render(
    <React.StrictMode>
      <Root appDependencies={appDependencies} />
    </React.StrictMode>,
    document.getElementById('root'),
  );
}

const Root: React.FC<{ appDependencies: AppDependencies }> = ({ appDependencies }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NexClipboardProvider value={appDependencies.clipboard}>
        <NexFileIconThemeProvider value={appDependencies.fileIconTheme}>
          <NexFileSystemProvider value={appDependencies.fileSystem}>
            <NexNativeHostProvider value={appDependencies.nativeHost}>
              <NexStorageProvider value={appDependencies.storage}>
                <ClipboardResourcesContext>
                  <ThemeProvider theme={theme}>
                    <Provider store={store}>
                      <CssBaseline />
                      <Shell />
                    </Provider>
                  </ThemeProvider>
                </ClipboardResourcesContext>
              </NexStorageProvider>
            </NexNativeHostProvider>
          </NexFileSystemProvider>
        </NexFileIconThemeProvider>
      </NexClipboardProvider>
    </QueryClientProvider>
  );
};
