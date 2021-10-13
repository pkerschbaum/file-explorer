import * as React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { enUS } from '@mui/material/locale';
import styled from '@mui/styled-engine';

import { NexClipboard } from '@app/platform/logic/clipboard';
import { NexFileSystem } from '@app/platform/logic/file-system';
import { NexNativeHost } from '@app/platform/logic/native-host';
import { NexStorage } from '@app/platform/logic/storage';
import { BACKGROUND_COLOR, createTheme } from '@app/ui/theme';
import { store } from '@app/platform/store/store';
import { ClipboardResourcesContext, NexClipboardProvider } from '@app/ui/NexClipboard.context';
import { NexFileIconThemeProvider } from '@app/ui/NexFileIconTheme.context';
import { NexFileSystemProvider } from '@app/ui/NexFileSystem.context';
import { NexNativeHostProvider } from '@app/ui/NexNativeHost.context';
import { NexStorageProvider } from '@app/ui/NexStorage.context';
import { FileIconTheme } from '@app/platform/logic/file-icon-theme/file-icon-theme';

const queryClient = new QueryClient();
const theme = createTheme(enUS);

export type AppDependencies = {
  clipboard: NexClipboard;
  fileIconTheme: FileIconTheme;
  fileSystem: NexFileSystem;
  nativeHost: NexNativeHost;
  storage: NexStorage;
};

export const Providers: React.FC<{ appDependencies: AppDependencies }> = ({
  appDependencies,
  children,
}) => (
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
                    <RootContainer className="show-file-icons">{children}</RootContainer>
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

const RootContainer = styled('div')`
  height: 100%;
  background-color: ${BACKGROUND_COLOR};
`;
