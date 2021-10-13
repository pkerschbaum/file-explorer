import { css } from '@mui/styled-engine';

export const commonStyles = {
  flex: {
    shrinkAndFitHorizontal: css`
      min-width: 0;
      flex-basis: 0;
      flex-shrink: 1;
      flex-grow: 1;
    `,

    shrinkAndFitVertical: css`
      min-height: 0;
      flex-basis: 0;
      flex-shrink: 1;
      flex-grow: 1;
    `,
  },
};
