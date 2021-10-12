import { css, Theme } from '@emotion/react';

export const styles = {
  pasteInfoBadge: (theme: Theme) => css`
    position: absolute;
    right: -8px;
    bottom: -16px;

    display: flex;
    justify-content: center;
    align-items: center;

    color: ${theme.palette.text.primary};
    background-color: ${theme.palette.background.paper};
    border: 2px solid ${theme.palette.background.default};
    padding: 3px;
    border-radius: 50%;
  `,
};
