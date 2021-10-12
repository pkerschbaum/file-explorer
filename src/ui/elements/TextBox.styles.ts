import { css, Theme } from '@emotion/react';

// adapted from https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Typography/Typography.js

export const styles = {
  textBox: (theme: Theme) => css`
    font-size: ${theme.typography.body1.fontSize};
  `,

  textBox_sm: (theme: Theme) => css`
    font-size: ${theme.typography.body2.fontSize};
  `,

  textBox_lg: css`
    font-size: 1.25rem;
  `,

  textBox_xl: css`
    font-size: 1.5rem;
  `,

  textBox_xxl: css`
    font-size: 2.125rem;
  `,

  textBox_xxxl: css`
    font-size: 3.75rem;
  `,

  textBox_bold: css`
    font-weight: 700;
  `,
};
