import type { Theme } from '@mui/material';
import { createTheme } from '@mui/material';
import { assertIsUnreachable } from '@pkerschbaum/commons-ecma/util/assert';
import * as d3 from 'd3-color';
import type { MotionProps, Target } from 'framer-motion';
import * as React from 'react';
import type { RuleSet } from 'styled-components';
import { createGlobalStyle, css, keyframes, ThemeProvider } from 'styled-components';
import invariant from 'tiny-invariant';

import { useActiveTheme } from '#pkg/global-state/slices/user.hooks';
import { componentLibraryUtils } from '#pkg/ui/components-library/utils';

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Theme {
    isAnimationAllowed: boolean;
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ThemeOptions {
    isAnimationAllowed: boolean;
  }
}

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  export interface DefaultTheme extends Theme {}
}

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
  theme: (typeof THEMES)[keyof typeof THEMES];
  borderColorToUse: string;
};
export const availableThemes = Object.keys(THEMES) as AvailableTheme[];
export const defaultTheme: AvailableTheme = 'nord';

const ANIMATIONS = {
  rotate: keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `,
  moveLeftToRight1: keyframes`
    0% {
      left: -35%;
      right: 100%;
    }

    60% {
      left: 100%;
      right: -90%;
    }

    100% {    
      left: 100%;
      right: -90%;
    }
  `,
  moveLeftToRight2: keyframes`
    0% {
      left: -200%;
      right: 100%;
    }

    60% {
      left: 107%;
      right: -8%;
    }

    100% {
      left: 107%;
      right: -8%;
    }
  `,
  pulsate: keyframes`
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.4;
    }

    100% {
      opacity: 1;
    }
  `,
  ripple: keyframes`
    to {
      transform: scale(4);
      opacity: 0;
    }
  `,
};

type FramerMotionAnimationNames = 'fadeInOut';
type FramerMotionAnimations = {
  [animationName in FramerMotionAnimationNames]: Pick<MotionProps, 'transition'> & {
    initial: Target;
    animate: Target;
    exit: Target;
  };
};
const FRAMER_MOTION_ANIMATIONS: FramerMotionAnimations = {
  fadeInOut: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.15 },
    exit: { opacity: 0 },
  },
};
// set a very short duration to disable animations (https://css-tricks.com/empathetic-animation/#did-we-allow-users-to-opt-out)
const FRAMER_MOTION_ANIMATIONS_DISABLED: FramerMotionAnimations = {
  fadeInOut: {
    ...FRAMER_MOTION_ANIMATIONS.fadeInOut,
    transition: {
      ...FRAMER_MOTION_ANIMATIONS.fadeInOut.transition,
      // eslint-disable-next-line unicorn/no-useless-spread -- would not compile if `duration` is passed directly
      ...{ duration: 0 },
    },
  },
};

export function useFramerMotionAnimations(): FramerMotionAnimations {
  const isAnimationAllowed = componentLibraryUtils.useIsAnimationAllowed();
  return isAnimationAllowed ? FRAMER_MOTION_ANIMATIONS : FRAMER_MOTION_ANIMATIONS_DISABLED;
}

const SPACING_1 = 4;
export const DESIGN_TOKENS = {
  BASE_FONTSIZE: 14,
  LINE_HEIGHT: 1.5,
  SPACING_1,
  SPACING_1_5: SPACING_1 * 1.5,
  SPACING_2: SPACING_1 * 2,
  SPACING_3: SPACING_1 * 3,
  SPACING_4: SPACING_1 * 4,
  SPACING_6: SPACING_1 * 6,
  SPACING_8: SPACING_1 * 8,
  OUTLINE_WIDTH: 2,
} as const;

type DesignTokenProviderProps = {
  children: React.ReactNode;
};

export const DesignTokenProvider: React.FC<DesignTokenProviderProps> = ({ children }) => {
  const activeTheme = useActiveTheme();
  const isAnimationAllowed = componentLibraryUtils.useIsAnimationAllowed();

  const themeConfiguration = THEMES[activeTheme];

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

    let modeColors;
    if (themeConfiguration.mode === 'dark') {
      modeColors = css`
        --color-darken-0: rgba(255, 255, 255, 0.1);
        --color-darken-1: rgba(255, 255, 255, 0.22);
        --color-darken-2: rgba(255, 255, 255, 0.34);
        --color-darken-3: rgba(255, 255, 255, 0.46);
        --outline: ${DESIGN_TOKENS.OUTLINE_WIDTH}px solid rgba(255, 255, 255, 0.8);
      `;
    } else if (themeConfiguration.mode === 'light') {
      modeColors = css`
        --color-darken-0: rgba(0, 0, 0, 0.1);
        --color-darken-1: rgba(0, 0, 0, 0.22);
        --color-darken-2: rgba(0, 0, 0, 0.34);
        --color-darken-3: rgba(0, 0, 0, 0.46);
        --outline: ${DESIGN_TOKENS.OUTLINE_WIDTH}px solid rgba(0, 0, 0, 0.8);
      `;
    } else {
      assertIsUnreachable(themeConfiguration);
    }

    const animations = isAnimationAllowed
      ? css`
          --animation-rotate: ${ANIMATIONS.rotate} 2s linear infinite;
          /* pulsate animation taken from https://mui.com/components/skeleton/#variants */
          --animation-pulsate: 1.5s ease-in-out 0.5s infinite normal none running
            ${ANIMATIONS.pulsate};
          /* move-left-to-right animation taken from https://mui.com/components/progress/#linear-indeterminate */
          --animation-move-left-to-right-1: 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) 0s infinite
            normal none running ${ANIMATIONS.moveLeftToRight1};
          --animation-move-left-to-right-2: 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite
            normal none running ${ANIMATIONS.moveLeftToRight2};
          --animation-ripple: 500ms linear ${ANIMATIONS.ripple};
        `
      : css`
          --animation-rotate: none;
          --animation-pulsate: none;
          --animation-move-left-to-right-1: none;
          --animation-move-left-to-right-2: none;
          --animation-ripple: none;

          /* disable all animations, https://css-tricks.com/empathetic-animation/#did-we-allow-users-to-opt-out */
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        `;

    return css`
      :root {
        --color-fg-0: ${themeConfiguration.foreground[0]};
        --color-fg-0-dark: ${fg0Darkened.formatHsl()};
        --color-bg-0-dark: ${bg0Darkened.formatHsl()};
        --color-bg-0: ${themeConfiguration.background[0]};
        --color-bg-1: ${themeConfiguration.background[1]};
        --color-bg-2: ${themeConfiguration.background[2]};
        --color-bg-3: ${themeConfiguration.background[3]};
        --color-fg-contrast: var(--color-bg-0);
        --color-bg-contrast: var(--color-fg-0);
        --color-primary-main: ${themeConfiguration.highlight.primary};
        --color-primary-dark-0: ${primaryDarkened0.formatHsl()};
        --color-primary-dark-1: ${primaryDarkened1.formatHsl()};
        --color-primary-contrast: ${themeConfiguration.background[0]};
        --color-success: ${themeConfiguration.highlight.success};
        --color-error: ${themeConfiguration.highlight.error};
        --color-warning: ${themeConfiguration.highlight.warning};
        --color-border: var(--color-darken-1);

        ${modeColors}

        --color-tags-tag-color-1: #f28b82;
        --color-tags-tag-color-2: #5b7e2f;
        --color-tags-tag-color-3: #fbbc04;
        --color-tags-tag-color-4: #fff475;
        --color-tags-tag-color-5: #3bd4c5;
        --color-tags-tag-color-6: #5ea9eb;
        --color-tags-tag-color-7: #aecbfa;
        --color-tags-tag-color-8: #d7aefb;
        --color-tags-tag-color-9: #fdcfe8;
        --color-tags-tag-color-10: #e6c9a8;

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

        --spacing-1: ${DESIGN_TOKENS.SPACING_1}px;
        --spacing-2: ${DESIGN_TOKENS.SPACING_2}px;
        --spacing-3: ${DESIGN_TOKENS.SPACING_3}px;
        --spacing-4: ${DESIGN_TOKENS.SPACING_4}px;
        --spacing-6: ${DESIGN_TOKENS.SPACING_6}px;
        --spacing-8: ${DESIGN_TOKENS.SPACING_8}px;
        --padding-button-md-block: 5px;
        --padding-button-md-inline: 10px;

        --font-size-xs: ${`${(DESIGN_TOKENS.BASE_FONTSIZE - 4) / DESIGN_TOKENS.BASE_FONTSIZE}rem`};
        --font-size-sm: ${`${(DESIGN_TOKENS.BASE_FONTSIZE - 2) / DESIGN_TOKENS.BASE_FONTSIZE}rem`};
        --font-size-md: 1rem;
        --font-size-lg: ${`${(DESIGN_TOKENS.BASE_FONTSIZE + 2) / DESIGN_TOKENS.BASE_FONTSIZE}rem`};
        --font-size-xl: ${`${(DESIGN_TOKENS.BASE_FONTSIZE + 4) / DESIGN_TOKENS.BASE_FONTSIZE}rem`};
        --font-weight-bold: 700;

        --border-width-1: 1px;
        --border-radius-1: 2px;
        --border-radius-2: calc(var(--border-radius-1) * 2);
        --border-radius-4: calc(var(--border-radius-1) * 4);
        --border-radius-8: calc(var(--border-radius-1) * 8);

        --icon-size-sm: ${`${18 / DESIGN_TOKENS.BASE_FONTSIZE}rem`};
        --icon-size-md: ${`${22 / DESIGN_TOKENS.BASE_FONTSIZE}rem`};

        --box-size-card-sm-width: 220px;
        --box-size-card-md-width: 280px;

        ${animations}
      }
    `;
  }, [isAnimationAllowed, themeConfiguration]);

  return (
    <>
      <DesignTokensGlobalStyle designTokensCss={designTokensCss} />
      {/* 
          We need to render the styled-components ThemeProvider with the MUI theme since the 
          @mui/icons-material components expect a MUI theme inside the SC ThemeProvider.
        */}
      <ThemeProvider theme={createTheme({ isAnimationAllowed })}>{children}</ThemeProvider>
    </>
  );
};

const DesignTokensGlobalStyle = createGlobalStyle<{ designTokensCss: RuleSet<object> }>`
  ${({ designTokensCss }) => designTokensCss}
`;
