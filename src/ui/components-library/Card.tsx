import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

export const Card = styled(Box)`
  width: ${({ theme }) => theme.sizes.card.md};

  padding: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;
