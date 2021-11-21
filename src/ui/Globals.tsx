import { CssBaseline, darken } from '@mui/material';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider as ReactReduxProvider } from 'react-redux';
import styled, { createGlobalStyle, css } from 'styled-components';

import { config } from '@app/config';
import { RootStore } from '@app/global-state/store';
import { useDirectoryWatchers } from '@app/operations/directory-watchers';
import { queryClientRef, storeRef, dispatchRef } from '@app/operations/global-modules';
import {
  DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED,
  GlobalShortcutsContextProvider,
} from '@app/ui/GlobalShortcutsContext';
import { ThemeProvider } from '@app/ui/ThemeProvider';

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
  React.useEffect(
    function setStoreAndQueryClientRefs() {
      storeRef.current = store;
      dispatchRef.current = store.dispatch;
      queryClientRef.current = queryClient;
    },
    [queryClient, store],
  );

  React.useEffect(function enableGlobalShortcutsForBodyElement() {
    // set data attribute which will enable global shortcuts whenever the <body> element has focus
    const bodyElement = document.querySelector('body');
    if (!bodyElement) {
      throw new Error(`Could not query body element`);
    }
    bodyElement.dataset[DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.attrCamelCased] = 'true';
  }, []);

  useDirectoryWatchers();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactReduxProvider store={store}>
          <ThemeProvider>
            <GlobalShortcutsContextProvider>
              <CssBaseline />
              <GlobalStyle />
              {/* class "show-file-icons" will enable file icon theme of code-oss project */}
              <RootContainer className="show-file-icons">{children}</RootContainer>
            </GlobalShortcutsContextProvider>
          </ThemeProvider>
        </ReactReduxProvider>

        {config.showReactQueryDevtools && <ReactQueryDevtools />}
      </QueryClientProvider>
    </React.StrictMode>
  );
};

const RootContainer = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.palette.background.default};
`;
