import * as d3 from 'd3-color';
import * as React from 'react';
import { createGlobalStyle, css, FlattenSimpleInterpolation } from 'styled-components';
import invariant from 'tiny-invariant';

import { assertIsUnreachable } from '@app/base/utils/assert.util';
import { useActiveTheme } from '@app/global-state/slices/user.hooks';
import { TARGET_MEDIUM_FONTSIZE } from '@app/ui/components-library/Theme';
import { createContext } from '@app/ui/utils/react.util';

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
    foreground: {
      0: NORD_THEME.nord6,
    },
    background: {
      0: NORD_THEME.nord0,
      1: NORD_THEME.nord1,
      2: NORD_THEME.nord2,
      3: NORD_THEME.nord3,
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
    foreground: {
      0: 'hsl(0, 0%, 100%)',
    },
    background: {
      0: '#231f1a',
      1: 'hsl(27, 11%, 17%)',
      2: 'hsl(27, 11%, 22%)',
      3: 'hsl(27, 11%, 26%)',
    },
    highlight: {
      primary: '#4dd0e1',
      success: '#A3BE8C',
      error: '#BF616A',
      warning: '#EBCB8B',
    },
  },
  ayu: {
    mode: 'light',
    foreground: {
      0: 'rgba(0, 0, 0, 1)',
    },
    background: {
      0: 'hsl(0, 0%, 99%)',
      1: 'hsl(210, 17%, 91%)',
      2: 'hsl(210, 14%, 80%)',
      3: 'hsl(210, 14%, 69%)',
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
    foreground: {
      0: 'hsl(0, 0%, 11%)',
    },
    background: {
      0: 'hsl(0, 0%, 100%)',
      1: 'hsl(202, 48%, 95%)',
      2: 'hsl(202, 48%, 84%)',
      3: 'hsl(202, 48%, 73%)',
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
export type ThemeConfiguration = {
  theme: typeof THEMES[keyof typeof THEMES];
  borderColorToUse: string;
};
export const availableThemes = Object.keys(THEMES) as AvailableTheme[];
export const defaultTheme: AvailableTheme = 'nord';

// border colors are taken from material-ui OutlinedInput <fieldset> border color
const BORDER_COLOR_LIGHT = 'rgba(0, 0, 0, 0.23)';
const BORDER_COLOR_DARK = 'rgba(255, 255, 255, 0.23)';
const OUTLINE_COLOR_LIGHT = 'rgba(0, 0, 0, 0.8)';
const OUTLINE_COLOR_DARK = 'rgba(255, 255, 255, 0.8)';

const themeConfigurationContext = createContext<ThemeConfiguration>('ThemeConfigurationContext');
export const useThemeConfiguration = themeConfigurationContext.useContextValue;
const ThemeConfigurationContextProvider = themeConfigurationContext.Provider;

type DesignTokenProviderProps = {
  children: React.ReactNode;
};

export const DesignTokenProvider: React.FC<DesignTokenProviderProps> = ({ children }) => {
  const activeTheme = useActiveTheme();

  const themeConfiguration = THEMES[activeTheme];
  let borderColorToUse: string;
  let outlineColorToUse: string;
  if (themeConfiguration.mode === 'dark') {
    borderColorToUse = BORDER_COLOR_DARK;
    outlineColorToUse = OUTLINE_COLOR_DARK;
  } else if (themeConfiguration.mode === 'light') {
    borderColorToUse = BORDER_COLOR_LIGHT;
    outlineColorToUse = OUTLINE_COLOR_LIGHT;
  } else {
    assertIsUnreachable(themeConfiguration);
  }

  const designTokensCss = React.useMemo(() => {
    const hsl = d3.hsl(themeConfiguration.background[0]);
    const bg0HSLString = `${hsl.h}deg ${hsl.s}% ${hsl.l}%`;
    const fg0Darkened = d3.color(themeConfiguration.foreground[0])?.darker(0.75);
    const bg0Darkened = d3.color(themeConfiguration.background[0])?.darker(0.75);
    const primaryDarkened0 = d3.color(themeConfiguration.highlight.primary)?.darker(1.5);
    const primaryDarkened1 = d3.color(themeConfiguration.highlight.primary)?.darker(0.75);
    invariant(fg0Darkened);
    invariant(bg0Darkened);
    invariant(primaryDarkened0);
    invariant(primaryDarkened1);

    return css`
      :root {
        --color-fg-0: ${themeConfiguration.foreground[0]};
        --color-fg-dark: ${fg0Darkened.formatHsl()};
        --color-bg-0-dark: ${bg0Darkened.formatHsl()};
        --color-bg-0: ${themeConfiguration.background[0]};
        --color-bg-1: ${themeConfiguration.background[1]};
        --color-bg-2: ${themeConfiguration.background[2]};
        --color-bg-3: ${themeConfiguration.background[3]};
        --color-primary-main: ${themeConfiguration.highlight.primary};
        --color-primary-dark-0: ${primaryDarkened0.formatHsl()};
        --color-primary-dark-1: ${primaryDarkened1.formatHsl()};
        --color-primary-contrast: ${themeConfiguration.background[0]};
        --color-success: ${themeConfiguration.highlight.success};
        --color-error: ${themeConfiguration.highlight.error};
        --color-warning: ${themeConfiguration.highlight.warning};
        --color-border: ${borderColorToUse};
        --color-outline: ${outlineColorToUse};

        --color-bg-contrast: var(--color-fg-0);
        --color-fg-contrast: var(--color-bg-0);

        --shadow-color: ${bg0HSLString};
        --shadow-elevation-low: 0px 0.3px 0.4px hsl(var(--shadow-color) / 0.21),
          0px 0.5px 0.6px -0.7px hsl(var(--shadow-color) / 0.3),
          0px 1.2px 1.5px -1.5px hsl(var(--shadow-color) / 0.39);
        --shadow-elevation-medium: 0px 0.3px 0.4px hsl(var(--shadow-color) / 0.22),
          0px 1.2px 1.5px -0.5px hsl(var(--shadow-color) / 0.29),
          0px 2.7px 3.4px -1px hsl(var(--shadow-color) / 0.36),
          0px 6.1px 7.8px -1.5px hsl(var(--shadow-color) / 0.43);
        --shadow-elevation-high: 0px 0.3px 0.4px hsl(var(--shadow-color) / 0.2),
          0px 2.3px 2.9px -0.2px hsl(var(--shadow-color) / 0.23),
          0px 4.3px 5.5px -0.4px hsl(var(--shadow-color) / 0.27),
          0px 6.6px 8.4px -0.6px hsl(var(--shadow-color) / 0.3),
          0px 9.8px 12.5px -0.9px hsl(var(--shadow-color) / 0.34),
          0px 14.6px 18.6px -1.1px hsl(var(--shadow-color) / 0.37),
          0px 21.3px 27.2px -1.3px hsl(var(--shadow-color) / 0.4),
          0px 30.5px 38.9px -1.5px hsl(var(--shadow-color) / 0.44);
        --shadow-elevation-16: var(--shadow-elevation-medium);

        --spacing-1: 4px;
        --spacing-2: calc(var(--spacing-1) * 2);
        --spacing-3: calc(var(--spacing-1) * 3);
        --spacing-4: calc(var(--spacing-1) * 4);
        --padding-button-md-block: 5px;
        --padding-button-md-inline: 10px;

        --font-size-sm: ${`${(TARGET_MEDIUM_FONTSIZE - 2) / TARGET_MEDIUM_FONTSIZE}rem`};
        --font-size-md: 1rem;
        --font-size-lg: ${`${(TARGET_MEDIUM_FONTSIZE + 2) / TARGET_MEDIUM_FONTSIZE}rem`};
        --font-weight-bold: 700;

        --border-radius-1: 2px;
        --border-radius-2: calc(var(--border-radius-1) * 2);
        --border-radius-4: calc(var(--border-radius-1) * 4);
        --border-radius-8: calc(var(--border-radius-1) * 8);

        --icon-size-small: ${`${20 / TARGET_MEDIUM_FONTSIZE}rem`};
        --icon-size-medium: ${`${24 / TARGET_MEDIUM_FONTSIZE}rem`};
      }
    `;
  }, [borderColorToUse, outlineColorToUse, themeConfiguration]);

  return (
    <>
      <DesignTokensGlobalStyle designTokensCss={designTokensCss} />
      <ThemeConfigurationContextProvider
        value={{
          theme: themeConfiguration,
          borderColorToUse,
        }}
      >
        {children}
      </ThemeConfigurationContextProvider>
    </>
  );
};

const DesignTokensGlobalStyle = createGlobalStyle<{ designTokensCss: FlattenSimpleInterpolation }>`
  ${({ designTokensCss }) => designTokensCss}
`;
