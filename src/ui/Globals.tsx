import * as React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider as ReactReduxProvider } from 'react-redux';
import styled, { createGlobalStyle, css } from 'styled-components';

import { config } from '@app/config';
import { FILE_ICON_THEMES } from '@app/domain/constants';
import { useActiveFileIconTheme } from '@app/global-state/slices/user.hooks';
import { RootStore } from '@app/global-state/store';
import { useGlobalCacheSubscriptions } from '@app/operations/global-cache-subscriptions';
import { setGlobalModules } from '@app/operations/global-modules';
import {
  componentLibraryUtils,
  DesignTokenProvider,
  DESIGN_TOKENS,
  OverlayProvider,
} from '@app/ui/components-library';
import {
  DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED,
  GlobalShortcutsContextProvider,
} from '@app/ui/GlobalShortcutsContext';

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
  @font-face {
    font-family: 'Segoe UI Variable';
    src: url('./fonts/SegoeUI-VF.ttf') format('truetype-variations');
    font-weight: 1 999;
    font-display: block;
  }

  :root {
    font-family: 'Segoe UI Variable', 'Roboto', 'Helvetica', 'Arial', sans-serif;

    /*
      We want to set a font-size of BASE_FONTSIZE pixels for the application, for users which have 
      the (default) font-size of 16px set for their user agent.
      About 13-14px is used by many applications like VS Code, Chrome, ...

      In order to respect changes of the font-size of the user (e.g., they have increased the 
      font-size to 20px), we use a percentage-based value here.
     */
    font-size: ${(DESIGN_TOKENS.BASE_FONTSIZE / 16) * 100}%;
    line-height: ${DESIGN_TOKENS.LINE_HEIGHT};
  }

  /* Use a more-intuitive box-sizing model (https://www.joshwcomeau.com/css/custom-css-reset/#digit-box-sizing-model) */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin (https://www.joshwcomeau.com/css/custom-css-reset/#digit-remove-default-margin) */
  * {
    margin: 0;
  }

  /* Allow percentage-based heights in the application (https://www.joshwcomeau.com/css/custom-css-reset/#digit-percentage-based-heights) */
  :root,
  body,
  #root {
    height: 100%;
  }

  /* Improve text rendering (https://www.joshwcomeau.com/css/custom-css-reset/#digit-font-smoothing) */
  body {
    -webkit-font-smoothing: antialiased;
  }

  /* Create a root stacking context (https://www.joshwcomeau.com/css/custom-css-reset/#digit-root-stacking-context) */
  #root {
    isolation: isolate;
  }

  /* Sensible media defaults (https://www.joshwcomeau.com/css/custom-css-reset/#digit-sensible-media-defaults) */
  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  /* Remove built-in form typography styles (https://www.joshwcomeau.com/css/custom-css-reset/#digit-inherit-fonts-for-form-controls) */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  /* Word wrapping (https://www.joshwcomeau.com/css/custom-css-reset/#digit-word-wrapping, https://twitter.com/sophiebits/status/1462921205359386628) */
  * {
    overflow-wrap: anywhere;
  }

  /* set colors based on active theme */
  body {
    color: var(--color-fg-0);
    background-color: var(--color-bg-0);
  }

  /* Disable default focus styles (components of the components library define der own focus styles) */
  *:focus {
    outline: none;
  }
  *:focus-visible {
    outline: none;
  }

  /* disable caret blinking if UI is running in test environment */
  ${() =>
    componentLibraryUtils.isRunningInPlaywright &&
    css`
      input,
      textarea {
        caret-color: transparent !important;
      }
    `}

  /* change scrollbar to a thin variant which lightens up on hover */
  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: rgba(0, 0, 0, 0);
  }
  *::-webkit-scrollbar-thumb {
    border-radius: 1000px;
    background-color: var(--color-fg-0-dark);
    border: 2px solid var(--color-bg-0);
  }
  *::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-fg-0);
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
    function setStoreAndQueryClientGlobalModules() {
      setGlobalModules({
        store,
        dispatch: store.dispatch,
        queryClient,
      });
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
          <GlobalShortcutsContextProvider>
            <DesignTokenProvider>
              <GlobalStyle />
              {/* class "show-file-icons" will enable file icon theme of code-oss project */}
              <FileIconThemeLoader>
                <OverlayProvider style={{ height: '100%' }}>
                  <RootContainer className="show-file-icons">{children}</RootContainer>
                </OverlayProvider>
              </FileIconThemeLoader>
            </DesignTokenProvider>
          </GlobalShortcutsContextProvider>
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
      const iconThemeCssRules = await globalThis.modules.fileIconThemeLoader.loadCssRules(
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
`;
