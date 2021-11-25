import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { cyan } from '@mui/material/colors';
import { Localization, enUS } from '@mui/material/locale';
import {
  // https://github.com/mui-org/material-ui/issues/13394
  createTheme as createMuiTheme,
  Theme as MuiTheme,
} from '@mui/material/styles';
import * as React from 'react';
import { css } from 'styled-components';

import { assertThat } from '@app/base/utils/assert.util';
import { AvailableTagIds, DELETE_PROCESS_STATUS, PASTE_PROCESS_STATUS } from '@app/domain/types';
import { useActiveTheme } from '@app/global-state/slices/user.hooks';

declare module '@mui/material/styles' {
  interface Theme {
    availableTagColors: {
      [id in AvailableTagIds]: string;
    };
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
    };
    font: {
      sizes: {
        sm: string;
        md: string;
        lg: string;
      };
      weights: {
        bold: number;
      };
    };
  }
  interface ThemeOptions {
    availableTagColors: {
      [id in AvailableTagIds]: string;
    };
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
    };
    font: {
      sizes: {
        sm: string;
        md: string;
        lg: string;
      };
      weights: {
        bold: number;
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
    hoverBackground: 'hsl(27, 11%, 21%)',
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
export type AvailableTheme = keyof typeof THEMES;
export const availableThemes = Object.keys(THEMES) as AvailableTheme[];
export const defaultTheme: AvailableTheme = 'coffee';

// border colors are taken from material-ui OutlinedInput <fieldset> border color
const BORDER_COLOR_LIGHT = 'rgba(0, 0, 0, 0.23)';
const BORDER_COLOR_DARK = 'rgba(255, 255, 255, 0.23)';
const OUTLINE_COLOR_LIGHT = 'rgba(0, 0, 0, 0.8)';
const OUTLINE_COLOR_DARK = 'rgba(255, 255, 255, 0.8)';

export const createTheme = (locale: Localization, activeTheme: AvailableTheme) => {
  const themeConfiguration = THEMES[activeTheme];
  let borderColorToUse;
  let outlineColorToUse;
  if (themeConfiguration.mode === 'dark') {
    borderColorToUse = BORDER_COLOR_DARK;
    outlineColorToUse = OUTLINE_COLOR_DARK;
  } else if (themeConfiguration.mode === 'light') {
    borderColorToUse = BORDER_COLOR_LIGHT;
    outlineColorToUse = OUTLINE_COLOR_LIGHT;
  } else {
    assertThat.isUnreachable(themeConfiguration);
  }

  /* the theme changes the appearance of some material-ui components to better align with the Windows 11 design language */
  const theme: Parameters<typeof createMuiTheme>[0] = {
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'outlined',
          type: 'button',
          disableRipple: true,
        },
        styleOverrides: {
          root: css`
            text-transform: initial;
            padding-left: 12px;
            padding-right: 12px;
            transition-duration: 150ms;

            &.Mui-focusVisible {
              outline: 2px solid ${outlineColorToUse};
            }

            &:active {
              filter: brightness(70%);
            }
          ` as any,
          outlined: css`
            color: ${themeConfiguration.foregroundColor};
            background-color: ${themeConfiguration.paperBackground};
            border-color: ${themeConfiguration.paperBackground};

            &:hover {
              border-color: ${themeConfiguration.background};
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
              background-color: ${themeConfiguration.primaryColor};
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
      mode: themeConfiguration.mode,
      action: {
        hover: themeConfiguration.hoverBackground,
      },
      background: {
        default: themeConfiguration.background,
        paper: themeConfiguration.paperBackground,
      },
      primary: {
        main: themeConfiguration.primaryColor,
      },
      text: {
        secondary: themeConfiguration.foregroundColor,
      },
      // divider does not only set the color of material-ui <Divider> components, but also of the border of e.g. Paper
      divider: borderColorToUse,
    },

    availableTagColors: {
      tagColor1: '#F28B82',
      tagColor2: '#5B7E2F',
      tagColor3: '#FBBC04',
      tagColor4: '#FFF475',
      tagColor5: '#3bd4c5',
      tagColor6: '#5ea9eb',
      tagColor7: '#AECBFA',
      tagColor8: '#D7AEFB',
      tagColor9: '#FDCFE8',
      tagColor10: '#E6C9A8',
    },

    processStatusColors: {
      pasteProcess: {
        [PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE]: themeConfiguration.background,
        [PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE]: themeConfiguration.background,
        [PASTE_PROCESS_STATUS.SUCCESS]: '#5B7E2F',
        [PASTE_PROCESS_STATUS.FAILURE]: '#B35C54',
        [PASTE_PROCESS_STATUS.ABORT_REQUESTED]: themeConfiguration.background,
        [PASTE_PROCESS_STATUS.ABORT_SUCCESS]: '#5B7E2F',
      },
      deleteProcess: {
        [DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT]: '#A88518',
        [DELETE_PROCESS_STATUS.RUNNING]: themeConfiguration.background,
        [DELETE_PROCESS_STATUS.SUCCESS]: '#5B7E2F',
        [DELETE_PROCESS_STATUS.FAILURE]: '#B35C54',
      },
    },

    sizes: {
      card: {
        md: { width: 280 },
      },
    },

    font: {
      sizes: {
        sm: '0.75rem',
        md: '1.00rem',
        lg: '1.25rem',
      },
      weights: {
        bold: 700,
      },
    },
  };

  return createMuiTheme(theme, locale);
};

export const ThemeProvider: React.FC = ({ children }) => {
  const activeTheme = useActiveTheme();

  return <MuiThemeProvider theme={createTheme(enUS, activeTheme)}>{children}</MuiThemeProvider>;
};
