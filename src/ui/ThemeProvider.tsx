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
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
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
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
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
export const MUI_BUTTON_SPACING_FACTOR = 1;
export const TARGET_MEDIUM_FONTSIZE = 13;

// "Nord" theme color palette (https://www.nordtheme.com/docs/colors-and-palettes)
const NORD_THEME = {
  // Polar Night
  nord0: '#2E3440',
  nord1: '#3B4252',
  nord2: '#434C5E',
  nord3: '#4C566A',
  // Snow Storm
  nord4: '#D8DEE9',
  nord5: '#E5E9F0',
  nord6: '#ECEFF4',
  // Frost
  nord7: '#8FBCBB',
  nord8: '#88C0D0',
  nord9: '#81A1C1',
  nord10: '#5E81AC',
  // Aurora
  nord11: '#BF616A',
  nord12: '#D08770',
  nord13: '#EBCB8B',
  nord14: '#A3BE8C',
  nord15: '#B48EAD',
} as const;

export const THEMES = {
  nord: {
    mode: 'dark',
    background: {
      0: NORD_THEME.nord0,
      1: NORD_THEME.nord1,
      2: NORD_THEME.nord2,
      3: NORD_THEME.nord3,
    },
    foreground: {
      0: NORD_THEME.nord6,
    },
    highlight: {
      primary: NORD_THEME.nord8,
      success: NORD_THEME.nord14,
      error: NORD_THEME.nord11,
      warning: NORD_THEME.nord13,
    },
  },
  coffee: {
    mode: 'dark',
    background: {
      0: '#231f1a',
      1: 'hsl(27, 11%, 17%)',
      2: 'hsl(27, 11%, 22%)',
      3: 'hsl(27, 11%, 26%)',
    },
    foreground: {
      0: 'hsl(0, 0%, 100%)',
    },
    highlight: {
      primary: cyan[300],
      success: '#A3BE8C',
      error: '#BF616A',
      warning: '#EBCB8B',
    },
  },
  ayu: {
    mode: 'light',
    background: {
      0: 'hsl(0, 0%, 99%)',
      1: 'hsl(210, 17%, 91%)',
      2: 'hsl(210, 14%, 80%)',
      3: 'hsl(210, 14%, 69%)',
    },
    foreground: {
      0: 'rgba(0, 0, 0, 1)',
    },
    highlight: {
      primary: 'hsl(35, 100%, 60%)',
      success: '#A3BE8C',
      error: 'hsl(359, 54%, 40%)',
      warning: '#EBCB8B',
    },
  },
  flow: {
    // inspired by Windows 11 "Flow" theme
    mode: 'light',
    background: {
      0: 'hsl(0, 0%, 100%)',
      1: 'hsl(202, 48%, 95%)',
      2: 'hsl(202, 48%, 84%)',
      3: 'hsl(202, 48%, 73%)',
    },
    foreground: {
      0: 'hsl(0, 0%, 11%)',
    },
    highlight: {
      primary: 'hsl(203, 17%, 36%)',
      success: '#A3BE8C',
      error: '#BF616A',
      warning: '#EBCB8B',
    },
  },
} as const;
export type AvailableTheme = keyof typeof THEMES;
export const availableThemes = Object.keys(THEMES) as AvailableTheme[];
export const defaultTheme: AvailableTheme = 'nord';

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
            padding-left: 10px;
            padding-right: 10px;
            &.MuiButton-sizeSmall {
              padding-left: 6px;
              padding-right: 6px;
            }
            transition-duration: 150ms;

            /* implement spacing between startIcon - content - endIcon via gap property */
            gap: ${({ theme }) => theme.spacing(MUI_BUTTON_SPACING_FACTOR)};

            &.Mui-focusVisible {
              outline: 2px solid ${outlineColorToUse};
            }

            &:active {
              filter: brightness(70%);
            }
          ` as any,
          contained: css`
            font-weight: ${({ theme }) => theme.font.weights.bold};
          ` as any,
          outlined: css`
            color: ${themeConfiguration.foreground[0]};
            background-color: ${themeConfiguration.background[1]};
            border-color: ${themeConfiguration.background[1]};

            &:hover {
              border-color: ${themeConfiguration.background[2]};
              background-color: ${themeConfiguration.background[2]};
            }

            .MuiPaper-elevation &.MuiButton-outlined {
              background-color: ${themeConfiguration.background[2]};
              border-color: ${themeConfiguration.background[2]};
            }

            .MuiPaper-elevation &.MuiButton-outlined:hover {
              border-color: ${themeConfiguration.background[3]};
              background-color: ${themeConfiguration.background[3]};
            }
          ` as any,
          startIcon: css`
            /* spacing between startIcon - content is implemented via gap property */
            margin-right: 0;
            margin-left: 0;

            & > *:nth-of-type(1) {
              font-size: ${({ theme }) => theme.font.sizes.lg};
            }
          ` as any,

          endIcon: css`
            /* spacing between content - endIcon is implemented via gap property */
            margin-right: 0;
            margin-left: 0;
          ` as any,
        },
      },

      MuiButtonGroup: {
        styleOverrides: {
          root: css`
            & .MuiButtonGroup-grouped {
              min-width: 0;
            }
          `,
        },
      },

      MuiCssBaseline: {
        styleOverrides: {
          body: {
            // just use font-size set on the HTML document
            fontSize: `1rem`,
          },
        },
      },

      MuiInputBase: {
        styleOverrides: {
          root: css`
            font: inherit;
          `,
          input: css`
            padding-top: 6px;
            padding-bottom: 6px;
            padding-left: 12px;
            padding-right: 12px;
          `,
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
          `,
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: css`
            /* disable change of background color via linear-gradient */
            background-image: none;
          `,
        },
      },

      MuiTab: {
        styleOverrides: {
          root: css`
            text-transform: none;
            padding: 0;
            min-height: 0;
          `,
        },
      },

      MuiTabs: {
        styleOverrides: {
          flexContainer: css`
            gap: 8px;
          `,

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
              background-color: ${themeConfiguration.highlight.primary};
              border-radius: 4px;
            }
          `,
        },
      },

      MuiTextField: {
        defaultProps: { size: 'small' },
      },

      MuiTooltip: {
        defaultProps: { disableInteractive: true },
        styleOverrides: {
          tooltip: css`
            font-size: ${({ theme }) => theme.font.sizes.sm};
          ` as any,
        },
      },
    },

    typography: {
      fontFamily: ['"Segoe UI Variable"', '"Roboto"', '"Helvetica"', '"Arial"', 'sans-serif'].join(
        ',',
      ),
      fontSize: TARGET_MEDIUM_FONTSIZE,
      htmlFontSize: TARGET_MEDIUM_FONTSIZE,
    },

    palette: {
      mode: themeConfiguration.mode,
      action: {
        hover: themeConfiguration.background[1],
      },
      background: {
        default: themeConfiguration.background[0],
        paper: themeConfiguration.background[1],
      },
      primary: {
        main: themeConfiguration.highlight.primary,
      },
      text: {
        secondary: themeConfiguration.foreground[0],
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
        [PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE]: themeConfiguration.background[0],
        [PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE]: themeConfiguration.background[0],
        [PASTE_PROCESS_STATUS.SUCCESS]: themeConfiguration.highlight.success,
        [PASTE_PROCESS_STATUS.FAILURE]: themeConfiguration.highlight.error,
        [PASTE_PROCESS_STATUS.ABORT_REQUESTED]: themeConfiguration.background[0],
        [PASTE_PROCESS_STATUS.ABORT_SUCCESS]: themeConfiguration.highlight.success,
      },
      deleteProcess: {
        [DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT]: themeConfiguration.highlight.primary,
        [DELETE_PROCESS_STATUS.RUNNING]: themeConfiguration.background[0],
        [DELETE_PROCESS_STATUS.SUCCESS]: themeConfiguration.highlight.success,
        [DELETE_PROCESS_STATUS.FAILURE]: themeConfiguration.highlight.error,
      },
    },

    sizes: {
      card: {
        md: { width: 280 },
      },
    },

    font: {
      sizes: {
        xs: `${(TARGET_MEDIUM_FONTSIZE - 4) / 13}rem`,
        sm: `${(TARGET_MEDIUM_FONTSIZE - 2) / 13}rem`,
        md: `${TARGET_MEDIUM_FONTSIZE / 13}rem`,
        lg: `${(TARGET_MEDIUM_FONTSIZE + 2) / 13}rem`,
        xl: `${(TARGET_MEDIUM_FONTSIZE + 4) / 13}rem`,
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
