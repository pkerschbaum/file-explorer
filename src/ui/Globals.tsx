import { CssBaseline, darken } from '@mui/material';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider as ReactReduxProvider } from 'react-redux';
import styled, { createGlobalStyle, css } from 'styled-components';

import { config } from '@app/config';
import { FILE_ICON_THEMES } from '@app/constants';
import { useActiveFileIconTheme } from '@app/global-state/slices/user.hooks';
import { RootStore } from '@app/global-state/store';
import { useGlobalCacheSubscriptions } from '@app/operations/global-cache-subscriptions';
import {
  queryClientRef,
  storeRef,
  dispatchRef,
  fileIconThemeLoaderRef,
} from '@app/operations/global-modules';
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

  useGlobalCacheSubscriptions();

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ReactReduxProvider store={store}>
          <ThemeProvider>
            <GlobalShortcutsContextProvider>
              <CssBaseline />
              <GlobalStyle />
              {/* class "show-file-icons" will enable file icon theme of code-oss project */}
              <FileIconThemeLoader>
                <RootContainer className="show-file-icons">{children}</RootContainer>
              </FileIconThemeLoader>
            </GlobalShortcutsContextProvider>
          </ThemeProvider>
        </ReactReduxProvider>

        {config.showReactQueryDevtools && <ReactQueryDevtools />}
      </QueryClientProvider>
    </React.StrictMode>
  );
};

const FileIconThemeLoader: React.FC = ({ children }) => {
  const [fileIconThemeCssRulesGotLoaded, setFileIconThemeCssRulesGotLoaded] = React.useState(false);

  const activeFileIconTheme = useActiveFileIconTheme();

  React.useEffect(() => {
    async function addCssRulesForFileIconTheme() {
      // load CSS rules of the file icon theme to set
      const iconThemeCssRules = await fileIconThemeLoaderRef.current.loadCssRules(
        FILE_ICON_THEMES[activeFileIconTheme].fsPathFragment,
      );

      // remove CSS rules of currently active file icon theme (if any is present)
      const currentFileIconTheme = document.querySelector('[data-icon-theme="active"]');
      if (currentFileIconTheme) {
        currentFileIconTheme.remove();
      }

      // put the new CSS rules into the <head> section
      const elStyle = document.createElement('style');
      elStyle.type = 'text/css';
      elStyle.textContent = iconThemeCssRules;
      elStyle.dataset.iconTheme = 'active';
      document.head.appendChild(elStyle);

      setFileIconThemeCssRulesGotLoaded(true);
    }

    void addCssRulesForFileIconTheme();
  }, [activeFileIconTheme]);

  return !fileIconThemeCssRulesGotLoaded ? null : <>{children}</>;
};

const RootContainer = styled.div`
  height: 100%;
  background-color: ${(props) => props.theme.palette.background.default};
`;
