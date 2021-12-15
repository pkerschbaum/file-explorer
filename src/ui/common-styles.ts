import { css } from 'styled-components';

export const commonStyles = {
  layout: {
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
  },
  text: {
    singleLineEllipsis: css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
  },
};
