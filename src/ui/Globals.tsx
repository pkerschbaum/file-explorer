import { CssBaseline, darken, ThemeProvider } from '@mui/material';
import { enUS } from '@mui/material/locale';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import styled, { createGlobalStyle, css } from 'styled-components';

import { RootStore } from '@app/global-state/store';
import { createTheme } from '@app/ui/theme';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
    },
  });
}
const theme = createTheme(enUS);

const globalStyle = css`
  html,
  body,
  #root {
    height: 100%;
  }

  /* change scrollbar to a thin variant which lightens up on hover */
  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: rgba(0, 0, 0, 0);
  }
  *::-webkit-scrollbar-thumb {
    border-radius: 1000px;
    background-color: ${(props) => darken(props.theme.palette.text.secondary, 0.25)};
    border: 2px solid ${(props) => props.theme.palette.background.default};
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: ${(props) => props.theme.palette.text.secondary};
  }
  ::-webkit-scrollbar-corner {
    background-color: rgba(0, 0, 0, 0);
  }
`;

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

type GlobalsProps = {
  queryClient: QueryClient;
  store: RootStore;
};

export const Globals: React.FC<GlobalsProps> = ({ queryClient, store, children }) => (
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
  background-color: ${(props) => props.theme.palette.background.default};
`;
