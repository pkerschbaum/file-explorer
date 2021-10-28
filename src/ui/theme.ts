import { cyan } from '@mui/material/colors';
import { Localization } from '@mui/material/locale';
import {
  // https://github.com/mui-org/material-ui/issues/13394
  createTheme as createMuiTheme,
  Theme as MuiTheme,
} from '@mui/material/styles';
import { css } from 'styled-components';

import { assertThat } from '@app/base/utils/assert.util';
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
    background: '#231f1a',
    paperBackground: 'hsl(27, 11%, 17%)',
    hoverBackground: 'rgba(255, 255, 255, 0.08)',
    foregroundColor: 'hsl(0, 0%, 100%)',
    primaryColor: cyan[300],
  },
  flow: {
    // inspired by Windows 11 "Flow" theme
    mode: 'light',
    background: 'hsl(0, 0%, 100%)',
    paperBackground: 'hsl(202, 48%, 95%)',
    hoverBackground: 'hsl(202, 48%, 84%)',
    foregroundColor: 'hsl(0, 0%, 11%)',
    primaryColor: 'hsl(203, 17%, 36%)',
  },
} as const;
type AvailableThemes = keyof typeof THEMES;
export const ACTIVE_THEME = 'coffee' as AvailableThemes;

// border colors are taken from material-ui OutlinedInput <fieldset> border color
const BORDER_COLOR_LIGHT = 'rgba(0, 0, 0, 0.23)';
const BORDER_COLOR_DARK = 'rgba(255, 255, 255, 0.23)';

export const createTheme = (locale: Localization) => {
  const activeTheme = THEMES[ACTIVE_THEME];
  let borderColorToUse;
  if (activeTheme.mode === 'dark') {
    borderColorToUse = BORDER_COLOR_DARK;
  } else if (activeTheme.mode === 'light') {
    borderColorToUse = BORDER_COLOR_LIGHT;
  } else {
    assertThat.isUnreachable(activeTheme);
  }

  /* the theme changes the appearance of some material-ui components to better align with the Windows 11 design language */
  const theme: Parameters<typeof createMuiTheme>[0] = {
    components: {
      MuiAccordion: {
        styleOverrides: {
          root: css`
            &.Mui-expanded {
              margin: 0;
            }

            /* disable additional material-ui border applied on 2nd, 3rd, ... Accordion in a list */
            &::before {
              content: none;
            }
          ` as any,
        },
      },

      MuiAccordionDetails: {
        styleOverrides: {
          root: css`
            padding-top: 0;
            padding-inline: ${(props) => props.theme.spacing(1.5)};
          ` as any,
        },
      },

      MuiAccordionSummary: {
        styleOverrides: {
          root: css`
            /* min-height taken from MuiButton */
            min-height: 32.8px;
            padding-inline: ${(props) => props.theme.spacing(1.5)};
            gap: ${(props) => props.theme.spacing(0.5)};

            &.Mui-expanded {
              min-height: 32.8px;
              padding-block: ${(props) => props.theme.spacing(2)};
            }

            &:hover {
              border-color: ${activeTheme.background};
              background-color: ${(props) => props.theme.palette.action.hover};
            }
          ` as any,
          content: css`
            margin: 0;

            &.Mui-expanded {
              margin: 0;
            }
          ` as any,
        },
      },

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
            color: ${activeTheme.foregroundColor};
            background-color: ${activeTheme.paperBackground};
            border-color: ${activeTheme.paperBackground};

            &:hover {
              border-color: ${activeTheme.background};
              background-color: ${(props) => props.theme.palette.action.hover};
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

      MuiTab: {
        styleOverrides: {
          root: css`
            text-transform: none;
            padding: 0;
            min-height: 0;
          ` as any,
        },
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
              background-color: ${activeTheme.primaryColor};
              border-radius: 4px;
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
    },

    typography: {
      fontFamily: ['Segoe UI Variable', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      fontSize: 12,
    },

    palette: {
      mode: activeTheme.mode,
      action: {
        hover: activeTheme.hoverBackground,
      },
      background: {
        default: activeTheme.background,
        paper: activeTheme.paperBackground,
      },
      primary: {
        main: activeTheme.primaryColor,
      },
      text: {
        secondary: activeTheme.foregroundColor,
      },
      // divider does not only set the color of material-ui <Divider> components, but also of the border of e.g. Paper
      divider: borderColorToUse,
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
        [PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE]: activeTheme.background,
        [PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE]: activeTheme.background,
        [PASTE_PROCESS_STATUS.SUCCESS]: '#5B7E2F',
        [PASTE_PROCESS_STATUS.FAILURE]: '#B35C54',
        [PASTE_PROCESS_STATUS.ABORT_REQUESTED]: activeTheme.background,
        [PASTE_PROCESS_STATUS.ABORT_SUCCESS]: '#5B7E2F',
      },
      deleteProcess: {
        [DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT]: '#A88518',
        [DELETE_PROCESS_STATUS.RUNNING]: activeTheme.background,
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
