import * as React from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import { ThemeProvider as EmoThemeProvider } from '@emotion/react';

export const ThemeProvider: React.FC<{
  theme: Theme | ((outerTheme: Theme) => Theme);
  children: React.ReactNode;
}> = ({ theme, children }) => {
  /*
   * provide the theme not only to material-ui theme provider, but also emotion theme provider
   * this will lead to the theme getting passed on to the "css" prop of MUI components
   */
  return (
    <MuiThemeProvider theme={theme}>
      <EmoThemeProvider theme={theme}>{children}</EmoThemeProvider>
    </MuiThemeProvider>
  );
};
