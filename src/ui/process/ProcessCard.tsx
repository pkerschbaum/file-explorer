import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccordionDetails, AccordionSummary, IconButton, Tooltip } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { removeProcess } from '@app/operations/resource.operations';
import { commonStyles } from '@app/ui/Common.styles';
import { RoundedAccordion } from '@app/ui/elements/Accordion';
import { TextBox } from '@app/ui/elements/TextBox';
import { Stack } from '@app/ui/layouts/Stack';
import { rotate } from '@app/ui/utils/animations';

type ProcessCardProps = {
  processId: string;
  summaryIcon: React.ReactNode;
  summaryText: React.ReactNode;
  details: React.ReactNode;
  isBusy: boolean;
  isRemovable: boolean;
};

export const ProcessCard: React.FC<ProcessCardProps> = ({
  processId,
  summaryIcon,
  summaryText,
  details,
  isBusy,
  isRemovable,
}) => (
  <RoundedAccordion defaultExpanded>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <ProcessSummary justifyContent="space-between">
        <ProcessIconAndText>
          {summaryIcon}
          <SummaryText fontSize="sm" disablePreserveNewlines>
            {summaryText}
          </SummaryText>
        </ProcessIconAndText>

        {isBusy && <RotatingAutorenewOutlinedIcon fontSize="small" />}

        {isRemovable && (
          <Tooltip title="Discard card">
            <IconButton size="medium" onClick={() => removeProcess(processId)}>
              <ClearAllIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </ProcessSummary>
    </StyledAccordionSummary>

    <AccordionDetails>
      <Stack direction="column" alignItems="stretch" spacing={2}>
        {details}
      </Stack>
    </AccordionDetails>
  </RoundedAccordion>
);

const StyledAccordionSummary = styled(AccordionSummary)`
  & .MuiAccordionSummary-content {
    min-width: 0;
  }
`;

const ProcessSummary = styled(Stack)`
  ${commonStyles.flex.shrinkAndFitHorizontal}
`;

const ProcessIconAndText = styled(Stack)`
  ${commonStyles.flex.shrinkAndFitHorizontal}
`;

const SummaryText = styled(TextBox)`
  flex-grow: 1;
  ${commonStyles.text.singleLineEllipsis}
`;

const RotatingAutorenewOutlinedIcon = styled(AutorenewOutlinedIcon)`
  animation: ${rotate} 2s linear infinite;
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;
