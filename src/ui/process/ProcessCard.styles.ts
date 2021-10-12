import { css, Theme } from '@emotion/react';

export const styles = {
  card: (theme: Theme) =>
    css`
      padding-top: ${theme.spacing()};
      padding-bottom: ${theme.spacing()};
      padding-right: ${theme.spacing(1.5)};
      padding-left: ${theme.spacing(1.5)};
    `,
};
