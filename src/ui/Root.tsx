import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline } from '@mui/material';
import { enUS } from '@mui/material/locale';

import { NexFileSystem } from '@app/platform/logic/file-system';
import { NexClipboard } from '@app/platform/logic/clipboard';
import { NexStorage } from '@app/platform/logic/storage';
import { Shell } from '@app/ui/Shell';
import { createTheme } from '@app/ui/theme';
import { ThemeProvider } from '@app/ui/theme.provider';
import { store } from '@app/platform/store/store';
import { NexFileSystemProvider } from '@app/ui/NexFileSystem.context';
import { ClipboardResourcesContext, NexClipboardProvider } from '@app/ui/NexClipboard.context';
import { NexStorageProvider } from '@app/ui/NexStorage.context';

const queryClient = new QueryClient();
const theme = createTheme(enUS);

type AppDependencies = {
  fileSystem: NexFileSystem;
  clipboard: NexClipboard;
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
      <NexFileSystemProvider value={appDependencies.fileSystem}>
        <NexClipboardProvider value={appDependencies.clipboard}>
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
        </NexClipboardProvider>
      </NexFileSystemProvider>
    </QueryClientProvider>
  );
};
