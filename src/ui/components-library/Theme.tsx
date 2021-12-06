import { ThemeProvider as MuiThemeProvider, useTheme as useMuiTheme } from '@mui/material';
import { Localization, enUS } from '@mui/material/locale';
import { createTheme as createMuiTheme, Theme as MuiTheme } from '@mui/material/styles';
import * as React from 'react';
import { css } from 'styled-components';

import { AvailableTagIds, DELETE_PROCESS_STATUS, PASTE_PROCESS_STATUS } from '@app/domain/types';
import {
  ThemeConfiguration,
  useThemeConfiguration,
} from '@app/ui/components-library/DesignTokenProvider';

export type Theme = MuiTheme;

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
  export interface DefaultTheme extends Theme {}
}

export const createTheme = createMuiTheme;
export const useTheme = useMuiTheme;

export const tabIndicatorSpanClassName = 'MuiTabs-indicatorSpan';
export const MUI_BUTTON_SPACING_FACTOR = 1;
export const MUI_BUTTON_LINE_HEIGHT = 1.5;
export const TARGET_MEDIUM_FONTSIZE = 14;

const createAppTheme = (
  locale: Localization,
  { theme: themeConfiguration, borderColorToUse }: ThemeConfiguration,
) => {
  /* the theme changes the appearance of some material-ui components to better align with the Windows 11 design language */
  const theme: Parameters<typeof createTheme>[0] = {
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'outlined',
          type: 'button',
          disableRipple: true,
        },
        styleOverrides: {
          root: css`
            align-items: stretch;

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
              outline: 2px solid var(--color-outline);
            }

            &:active {
              filter: brightness(70%);
            }
          ` as any,
          contained: css`
            font-weight: ${({ theme }) => theme.font.weights.bold};
          ` as any,
          outlined: css`
            color: var(--color-fg-0);
            background-color: var(--color-bg-1);
            border-color: var(--color-bg-1);

            &:hover {
              border-color: var(--color-bg-2);
              background-color: var(--color-bg-2);
            }

            .MuiPaper-elevation &.MuiButton-outlined {
              background-color: var(--color-bg-2);
              border-color: var(--color-bg-2);
            }

            .MuiPaper-elevation &.MuiButton-outlined:hover {
              border-color: var(--color-bg-3);
              background-color: var(--color-bg-3);
            }
          ` as any,
          startIcon: css`
            display: flex;
            align-items: stretch;
            justify-content: center;

            /* spacing between startIcon - content is implemented via gap property */
            margin-right: 0;
            margin-left: 0;

            & > *:nth-of-type(1) {
              font-size: ${({ theme }) => theme.font.sizes.lg};
            }
          ` as any,

          endIcon: css`
            display: flex;
            align-items: stretch;
            justify-content: center;

            /* spacing between content and endIcon is implemented via gap property --> no margin necessary */
            margin-right: 0;
            margin-left: 0;

            /* disable fixed MUI font-size */
            & > *:nth-of-type(1) {
              font-size: inherit;
            }
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
              background-color: var(--color-primary);
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
      button: { lineHeight: MUI_BUTTON_LINE_HEIGHT },
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
        xs: `${(TARGET_MEDIUM_FONTSIZE - 4) / TARGET_MEDIUM_FONTSIZE}rem`,
        sm: `${(TARGET_MEDIUM_FONTSIZE - 2) / TARGET_MEDIUM_FONTSIZE}rem`,
        md: `1rem`,
        lg: `${(TARGET_MEDIUM_FONTSIZE + 2) / TARGET_MEDIUM_FONTSIZE}rem`,
        xl: `${(TARGET_MEDIUM_FONTSIZE + 4) / TARGET_MEDIUM_FONTSIZE}rem`,
      },
      weights: {
        bold: 700,
      },
    },
  };

  return createTheme(theme, locale);
};

export const ThemeProvider: React.FC = ({ children }) => {
  const themeConfiguration = useThemeConfiguration();

  return (
    <MuiThemeProvider theme={createAppTheme(enUS, themeConfiguration)}>{children}</MuiThemeProvider>
  );
};
