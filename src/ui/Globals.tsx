import { CssBaseline, darken, ThemeProvider } from '@mui/material';
import { enUS } from '@mui/material/locale';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import styled, { createGlobalStyle, css } from 'styled-components';

import { config } from '@app/config';
import { RootStore } from '@app/global-state/store';
import { useDirectoryWatchers } from '@app/operations/directory-watchers';
import { DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE } from '@app/ui/actions-bar';
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

export type GlobalsProps = {
  queryClient: QueryClient;
  store: RootStore;
};

export const Globals: React.FC<GlobalsProps> = ({ queryClient, store, children }) => {
  useDirectoryWatchers();

  /**
   * This effect stores the information if the CSS pseudo class ":focus-visible" matched on an element
   * at the time the element was focused. See ActionsBar.tsx for further information why this is needed.
   */
  React.useEffect(function storeInfoIfFocusVisibleClassMatches() {
    const eventListener = (e: WindowEventMap['focus']) => {
      if (e.target instanceof HTMLElement) {
        e.target.dataset[
          DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE.attrCamelCased
        ] = `${e.target.matches(':focus-visible')}`;
      }
    };

    window.addEventListener('focus', eventListener, { capture: true });
    return () => window.removeEventListener('focus', eventListener, { capture: true });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <CssBaseline />
          <GlobalStyle />
          {/* class "show-file-icons" will enable file icon theme of code-oss project */}
          <RootContainer className="show-file-icons">{children}</RootContainer>
        </Provider>
      </ThemeProvider>

      {config.showReactQueryDevtools && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
};

const RootContainer = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.palette.background.default};
`;
