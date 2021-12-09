import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import * as React from 'react';
import styled from 'styled-components';

import { commonStyles } from '@app/ui/Common.styles';
import { Box, Icon, IconButton, Paper } from '@app/ui/components-library';
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
}) => {
  return (
    <ProcessCardContainer aria-label={labels.container} className={className}>
      <SummarySection>
        <ProcessIconAndText>
          <ProcessIconWrapper>{summaryIcon}</ProcessIconWrapper>
          <SummaryText>{summaryText}</SummaryText>
        </ProcessIconAndText>

        {isBusy && <RotatingAutorenewOutlinedIcon fontSize="inherit" />}

        {isRemovable && (
          <DiscardIconButton tooltipContent="Discard card" onPress={onRemove}>
            <Icon Component={ClearAllIcon} />
          </DiscardIconButton>
        )}
      </SummarySection>

      <DetailsSection>{details}</DetailsSection>
    </ProcessCardContainer>
  );
};

const ProcessCardContainer = styled(Paper)`
  padding: var(--spacing-4);

  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const SummarySection = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const ProcessIconAndText = styled(Box)`
  ${commonStyles.layout.flex.shrinkAndFitHorizontal}

  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const ProcessIconWrapper = styled(Box)`
  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-items: center;
  gap: var(--spacing-2);

  font-size: ${({ theme }) => theme.font.sizes.lg};
`;

const SummaryText = styled(Box)`
  ${commonStyles.layout.flex.shrinkAndFitHorizontal}

  ${commonStyles.text.singleLineEllipsis}

  /* some margin for optical alignment */
  margin-bottom: 3px;
`;

const RotatingAutorenewOutlinedIcon = styled(AutorenewOutlinedIcon)`
  font-size: ${({ theme }) => theme.font.sizes.lg};

  animation: ${rotate} 2s linear infinite;
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const DiscardIconButton = styled(IconButton)`
  /* undo paddings of IconButton via negative margin */
  margin: -9px -9px -9px 0;
  font-size: ${({ theme }) => theme.font.sizes.xl};
`;

const DetailsSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;
