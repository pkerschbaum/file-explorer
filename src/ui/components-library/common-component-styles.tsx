import { css } from 'styled-components';

export const commonComponentStyles = {
  card: css`
    width: var(--box-size-card-sm-width);

    padding: var(--spacing-3);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
  `,

  actionsRow: css`
    display: flex;
    justify-content: end;
    align-items: center;
    gap: var(--spacing-2);
  `,
};
