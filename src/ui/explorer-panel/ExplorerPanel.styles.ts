import { css, Theme } from '@emotion/react';

const iconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  max-width: 24px;
  height: 1em;
  max-height: 1em;
`;

export const styles = {
  icon: iconStyles,
  fileIcon: css`
    ::before {
      /* icon-theme.ts sets a unwanted font-size, use !important to overrule that*/
      font-size: 2em !important;

      ${iconStyles}

      background-size: 24px 1em;
      background-repeat: no-repeat;
      -webkit-font-smoothing: antialiased;
    }
  `,

  cwdBreadcrumbs: (theme: Theme) => css`
    padding-inline-start: ${theme.spacing()};

    & .MuiBreadcrumbs-li > * {
      min-width: 0;
      padding-inline: ${theme.spacing(1.5)};
    }

    & .MuiBreadcrumbs-li > *:not(button) {
      /* MUI outlined button height */
      height: 30.8px;
      /* compensate for inline border of MUI outlined button */
      padding-inline: calc(${theme.spacing(1.5)} + 1px);

      display: flex;
      align-items: center;
    }
  `,
};
