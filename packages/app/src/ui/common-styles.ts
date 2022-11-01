import { css } from 'styled-components';

export const commonStyles = {
  layout: {
    flex: {
      shrinkAndFitHorizontal: css`
        min-width: 0;
        flex: 1;
      `,

      shrinkAndFitVertical: css`
        min-height: 0;
        flex: 1;
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
