import * as React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { enUS } from '@mui/material/locale';
import styled, { createGlobalStyle } from 'styled-components';

import { BACKGROUND_COLOR, createTheme } from '@app/ui/theme';
import { RootStore } from '@app/global-state/store';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});
const theme = createTheme(enUS);

const GlobalStyle = createGlobalStyle`
  html, body, #root  {
    height: 100%
  }
`;

type GlobalsProps = { store: RootStore };

export const Globals: React.FC<GlobalsProps> = ({ store, children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <GlobalStyle />
        {/* class "show-file-icons" will enable file icon theme of code-oss project */}
        <RootContainer className="show-file-icons">{children}</RootContainer>
      </Provider>
    </ThemeProvider>
  </QueryClientProvider>
);

const RootContainer = styled.div`
  height: 100%;
  background-color: ${BACKGROUND_COLOR};
`;
