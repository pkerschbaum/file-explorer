import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type CardProps = {
  content: React.ReactNode;
  actions?: React.ReactNode;
};
export const Card: React.FC<CardProps> = ({ content, actions }) => {
  return (
    <CardContainer>
      {content}
      {actions && <Actions>{actions}</Actions>}
    </CardContainer>
  );
};

const CardContainer = styled(Box)`
  width: ${({ theme }) => theme.sizes.card.sm.width}px;

  padding: var(--spacing-3);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

const Actions = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: var(--spacing-2);
`;
