import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

export const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(1.5)};
  width: ${({ theme }) => theme.sizes.card.md};
`;
