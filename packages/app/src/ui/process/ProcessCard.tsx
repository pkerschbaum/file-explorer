import type * as React from 'react';
import styled from 'styled-components';

import { commonStyles } from '#pkg/ui/common-styles';
import {
  Backdrop,
  Box,
  ClearAllIcon,
  FocusScope,
  IconButton,
  Paper,
  RotatingAutorenewOutlinedIcon,
} from '#pkg/ui/components-library';

export type ProcessCardProps = {
  summaryIcon: React.ReactNode;
  summaryText: React.ReactNode;
  details: React.ReactNode;
  isBusy: boolean;
  isRemovable: boolean;
  captureFocus?: boolean;
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
  captureFocus,
  onRemove,
  labels,
  className,
}) => {
  const renderFocusScope = isRemovable || captureFocus;

  const innerContent = (
    <ProcessCardContainer aria-label={labels.container} className={className}>
      <SummarySection>
        <ProcessIconAndText>
          <ProcessIconWrapper>{summaryIcon}</ProcessIconWrapper>
          <SummaryText>{summaryText}</SummaryText>
        </ProcessIconAndText>

        {isBusy && <RotatingAutorenewOutlinedIcon fontSize="sm" />}

        {isRemovable && (
          <DiscardIconButton
            size="sm"
            aria-label="Discard card"
            tooltipContent="Discard card"
            onPress={onRemove}
            disablePadding
          >
            <ClearAllIcon />
          </DiscardIconButton>
        )}
      </SummarySection>

      <DetailsSection>{details}</DetailsSection>
    </ProcessCardContainer>
  );

  return !renderFocusScope ? (
    innerContent
  ) : (
    <FocusScope autoFocus restoreFocus contain>
      <Backdrop>{innerContent}</Backdrop>
    </FocusScope>
  );
};

const ProcessCardContainer = styled(Paper)`
  /* relative positioning so that Backdrop is behind the card */
  position: relative;

  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const SummarySection = styled(Box)`
  display: flex;
  align-items: baseline;
  gap: var(--spacing-3);
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

  font-size: var(--font-size-lg);

  /* add some margin-top for optical alignment */
  margin-top: 2px;
`;

const SummaryText = styled(Box)`
  ${commonStyles.layout.flex.shrinkAndFitHorizontal}

  ${commonStyles.text.singleLineEllipsis}
`;

const DiscardIconButton = styled(IconButton)`
  /* move button down for optical alignment */
  position: relative;
  bottom: -1px;
`;

const DetailsSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;
