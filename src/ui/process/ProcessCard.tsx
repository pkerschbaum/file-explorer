import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { commonStyles } from '@app/ui/Common.styles';
import { rotate } from '@app/ui/utils/animations';

export type ProcessCardProps = {
  summaryIcon: React.ReactNode;
  summaryText: React.ReactNode;
  details: React.ReactNode;
  isBusy: boolean;
  isRemovable: boolean;
  onRemove: () => void | Promise<void>;
  labels: { container: string };
  className?: string;
};

export const ProcessCard: React.FC<ProcessCardProps> = ({
  summaryIcon,
  summaryText,
  details,
  isBusy,
  isRemovable,
  onRemove,
  labels,
  className,
}) => (
  <ProcessCardContainer aria-label={labels.container} className={className}>
    <SummarySection>
      <ProcessIconAndText>
        <ProcessIconWrapper>{summaryIcon}</ProcessIconWrapper>
        <SummaryText>{summaryText}</SummaryText>
      </ProcessIconAndText>

      {isBusy && <RotatingAutorenewOutlinedIcon fontSize="inherit" />}

      {isRemovable && (
        <Tooltip title="Discard card">
          <DiscardIconButton onClick={onRemove}>
            <ClearAllIcon fontSize="inherit" />
          </DiscardIconButton>
        </Tooltip>
      )}
    </SummarySection>

    <DetailsSection>{details}</DetailsSection>
  </ProcessCardContainer>
);

const ProcessCardContainer = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const SummarySection = styled(Box)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing()};
`;

const ProcessIconAndText = styled(Box)`
  ${commonStyles.layout.flex.shrinkAndFitHorizontal}

  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing()};
`;

const ProcessIconWrapper = styled(Box)`
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-items: center;
  gap: ${({ theme }) => theme.spacing()};

  font-size: ${({ theme }) => theme.font.sizes.md};
`;

const SummaryText = styled(Box)`
  ${commonStyles.layout.flex.shrinkAndFitHorizontal}

  font-size: ${({ theme }) => theme.font.sizes.sm};
  ${commonStyles.text.singleLineEllipsis}
`;

const RotatingAutorenewOutlinedIcon = styled(AutorenewOutlinedIcon)`
  font-size: ${({ theme }) => theme.font.sizes.md};
  animation: ${rotate} 2s linear infinite;
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const DiscardIconButton = styled(IconButton)`
  /* undo vertical padding of IconButton */
  margin-block: -9px;
  font-size: ${({ theme }) => theme.font.sizes.lg};
`;

const DetailsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};

  font-size: ${({ theme }) => theme.font.sizes.sm};
`;
