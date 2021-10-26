import { cyan } from '@mui/material/colors';
import { Localization } from '@mui/material/locale';
import {
  // https://github.com/mui-org/material-ui/issues/13394
  createTheme as createMuiTheme,
  Theme as MuiTheme,
} from '@mui/material/styles';
import { css } from 'styled-components';

import { DELETE_PROCESS_STATUS, PASTE_PROCESS_STATUS } from '@app/domain/types';

declare module '@mui/material/styles' {
  interface Theme {
    availableTagColors: string[];
    processStatusColors: {
      pasteProcess: {
        [status in PASTE_PROCESS_STATUS]: string;
      };
      deleteProcess: {
        [status in DELETE_PROCESS_STATUS]: string;
      };
    };
    sizes: {
      card: {
        md: { width: number };
      };
      fileRow: {
        height: string;
      };
    };
  }
  interface ThemeOptions {
    availableTagColors: string[];
    processStatusColors: {
      pasteProcess: {
        [status in PASTE_PROCESS_STATUS]: string;
      };
      deleteProcess: {
        [status in DELETE_PROCESS_STATUS]: string;
      };
    };
    sizes: {
      card: {
        md: { width: number };
      };
      fileRow: {
        height: string;
      };
    };
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface -- styled-component's theme should have the same properties as that of MUI, no more. That's why it's empty (besides the "extends" clause)
  export interface DefaultTheme extends MuiTheme {}
}

export const tabIndicatorSpanClassName = 'MuiTabs-indicatorSpan';

export const THEMES = {
  coffee: {
    mode: 'dark',
    backgroundColor: '#231f1a',
    primaryColor: cyan[300],
    foregroundColor: 'hsl(0, 0%, 100%)',
    MuiButton: {
      outlined: {
        background: 'hsl(27, 11%, 17%)',
        hoverBackground: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  flow: {
    // inspired by Windows 11 "Flow" theme
    mode: 'light',
    backgroundColor: 'hsl(0, 0%, 100%)',
    primaryColor: 'hsl(203, 17%, 36%)',
    foregroundColor: 'hsl(0, 0%, 11%)',
    MuiButton: {
      outlined: {
        background: 'hsl(202, 48%, 95%)',
        hoverBackground: 'hsl(202, 48%, 84%)',
      },
    },
  },
} as const;
type AvailableThemes = keyof typeof THEMES;
export const ACTIVE_THEME: AvailableThemes = 'coffee';

export const createTheme = (locale: Localization) => {
  /* the theme changes the appearance of some material-ui components to better align with the Windows 11 design language */
  const theme: Parameters<typeof createMuiTheme>[0] = {
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'outlined',
          type: 'button',
        },
        styleOverrides: {
          root: css`
            text-transform: initial;
            padding-left: 12px;
            padding-right: 12px;
            transition-duration: 150ms;
          ` as any,
          outlined: css`
            color: ${THEMES[ACTIVE_THEME].foregroundColor};
            background-color: ${THEMES[ACTIVE_THEME].MuiButton.outlined.background};
            border-color: ${THEMES[ACTIVE_THEME].MuiButton.outlined.background};

            &:hover {
              border-color: ${THEMES[ACTIVE_THEME].backgroundColor};
              background-color: ${THEMES[ACTIVE_THEME].MuiButton.outlined.hoverBackground};
            }
          ` as any,
          startIcon: css`
            & > *:nth-of-type(1) {
              font-size: ${18 / 16}rem;
            }
          ` as any,
        },
      },

      MuiInputBase: {
        styleOverrides: {
          input: css`
            padding-top: 6px;
            padding-bottom: 6px;
            padding-left: 12px;
            padding-right: 12px;
          ` as any,
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          // reduce gap between icon and text
          root: css`
            gap: 8px;

            & > .MuiListItemIcon-root {
              min-width: 0;
            }
          ` as any,
        },
      },

      MuiTextField: {
        defaultProps: { size: 'small' },
      },

      MuiTooltip: {
        defaultProps: { disableInteractive: true },
      },

      MuiTabs: {
        styleOverrides: {
          flexContainer: css`
            gap: 8px;
          ` as any,

          indicator: css`
            right: initial;
            width: 3px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background-color: transparent;

            & .${tabIndicatorSpanClassName} {
              max-height: 16px;
              height: 100%;
              background-color: ${THEMES[ACTIVE_THEME].primaryColor};
              border-radius: 4px;
            }
          ` as any,
        },
      },

      MuiTab: {
        styleOverrides: {
          root: css`
            text-transform: none;
            padding: 0;
            min-height: 0;
          ` as any,
        },
      },
    },

    typography: {
      fontFamily: ['Segoe UI Variable', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      fontSize: 12,
    },

    palette: {
      mode: THEMES[ACTIVE_THEME].mode,
      background: {
        default: THEMES[ACTIVE_THEME].backgroundColor,
        paper: THEMES[ACTIVE_THEME].MuiButton.outlined.background,
      },
      primary: {
        main: THEMES[ACTIVE_THEME].primaryColor,
      },
      text: {
        secondary: THEMES[ACTIVE_THEME].foregroundColor,
      },
    },

    availableTagColors: [
      '#F28B82',
      '#5B7E2F',
      '#FBBC04',
      '#FFF475',
      '#3bd4c5',
      '#5ea9eb',
      '#AECBFA',
      '#D7AEFB',
      '#FDCFE8',
      '#E6C9A8',
    ],

    processStatusColors: {
      pasteProcess: {
        [PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE]: THEMES[ACTIVE_THEME].backgroundColor,
        [PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE]: THEMES[ACTIVE_THEME].backgroundColor,
        [PASTE_PROCESS_STATUS.SUCCESS]: '#5B7E2F',
        [PASTE_PROCESS_STATUS.FAILURE]: '#B35C54',
        [PASTE_PROCESS_STATUS.ABORT_REQUESTED]: THEMES[ACTIVE_THEME].backgroundColor,
        [PASTE_PROCESS_STATUS.ABORT_SUCCESS]: '#5B7E2F',
      },
      deleteProcess: {
        [DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT]: '#A88518',
        [DELETE_PROCESS_STATUS.RUNNING]: THEMES[ACTIVE_THEME].backgroundColor,
        [DELETE_PROCESS_STATUS.SUCCESS]: '#5B7E2F',
        [DELETE_PROCESS_STATUS.FAILURE]: '#B35C54',
      },
    },

    sizes: {
      card: {
        md: { width: 280 },
      },
      fileRow: {
        height: '1.5rem',
      },
    },
  };

  return createMuiTheme(theme, locale);
};
