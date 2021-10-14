import * as React from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { enUS } from '@mui/material/locale';
import styled from '@mui/styled-engine';

import { BACKGROUND_COLOR, createTheme } from '@app/ui/theme';
import { store } from '@app/global-state/store';

export const queryClient = new QueryClient();
const theme = createTheme(enUS);

export const Providers: React.FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <RootContainer className="show-file-icons">{children}</RootContainer>
      </Provider>
    </ThemeProvider>
  </QueryClientProvider>
);

const RootContainer = styled('div')`
  height: 100%;
  background-color: ${BACKGROUND_COLOR};
`;
