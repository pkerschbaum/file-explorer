import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import styled from 'styled-components';

import { isUnreachable } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { DeleteProcess as DeleteProcessType, DELETE_PROCESS_STATUS } from '@app/domain/types';
import { removeProcess, runDeleteProcess } from '@app/operations/file.operations';
import { commonStyles } from '@app/ui/Common.styles';
import { RoundedAccordion } from '@app/ui/elements/Accordion';
import { TextBox } from '@app/ui/elements/TextBox';
import { Stack } from '@app/ui/layouts/Stack';
import { rotate } from '@app/ui/utils/animations';

export const DeleteProcess: React.FC<{ process: DeleteProcessType }> = ({ process }) => {
  let contentToRender;
  switch (process.status) {
    case DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT: {
      contentToRender = (
        <DeleteProcessCard process={process}>
          <Button
            onClick={() => runDeleteProcess(process.id, { useTrash: true })}
            startIcon={<DeleteOutlineOutlinedIcon />}
          >
            Move to trash
          </Button>
          <Button
            onClick={() => runDeleteProcess(process.id, { useTrash: false })}
            startIcon={<DeleteForeverOutlinedIcon />}
          >
            Delete permanently
          </Button>
          <Button onClick={() => removeProcess(process.id)}>Abort</Button>
        </DeleteProcessCard>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.RUNNING: {
      contentToRender = (
        <DeleteProcessCard process={process}>
          <TextBox fontSize="sm">Deletion is in progress...</TextBox>
          <LinearProgress variant="indeterminate" />
        </DeleteProcessCard>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.SUCCESS: {
      contentToRender = (
        <DeleteProcessCard process={process}>
          <TextBox fontSize="sm">Files deleted successfully</TextBox>
        </DeleteProcessCard>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.FAILURE: {
      contentToRender = (
        <DeleteProcessCard process={process}>
          <Stack direction="column" alignItems="flex-start">
            <TextBox fontSize="sm">Error occured during deletion of the files:</TextBox>
            <TextBox fontSize="sm">{process.error}</TextBox>
          </Stack>
        </DeleteProcessCard>
      );
      break;
    }
    default: {
      isUnreachable(process);
    }
  }

  return contentToRender;
};

type DeleteProcessCardProps = {
  process: DeleteProcessType;
};

const DeleteProcessCard: React.FC<DeleteProcessCardProps> = ({ process, children }) => (
  <RoundedAccordion defaultExpanded>
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <ProcessSummary justifyContent="space-between">
        <ProcessIconAndText>
          <DeleteOutlinedIcon fontSize="small" />
          <SummaryText fontSize="sm" disablePreserveNewlines>
            {process.uris
              .map((uri) => {
                const { fileName, extension } = uriHelper.extractNameAndExtension(uri);
                const fileLabel = formatter.file({ name: fileName, extension });

                return fileLabel;
              })
              .join(', ')}
          </SummaryText>
        </ProcessIconAndText>

        {process.status === DELETE_PROCESS_STATUS.RUNNING && (
          <RotatingAutorenewOutlinedIcon fontSize="small" />
        )}

        {(process.status === DELETE_PROCESS_STATUS.SUCCESS ||
          process.status === DELETE_PROCESS_STATUS.FAILURE) && (
          <Tooltip title="Discard card">
            <IconButton autoFocus size="medium" onClick={() => removeProcess(process.id)}>
              <ClearAllIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </ProcessSummary>
    </StyledAccordionSummary>

    <AccordionDetails>
      <Stack direction="column" alignItems="stretch" spacing={2}>
        <Stack direction="column" alignItems="stretch" spacing={0.5}>
          <TextBox fontSize="sm">Files:</TextBox>
          {process.uris.map((uri) => {
            const { fileName, extension } = uriHelper.extractNameAndExtension(uri);
            const fileLabel = formatter.file({ name: fileName, extension });

            return (
              <TextBox key={URI.from(uri).toString()} fontSize="sm" fontBold>
                {fileLabel}
              </TextBox>
            );
          })}
        </Stack>

        <Stack direction="column" alignItems="stretch">
          {children}
        </Stack>
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
`;
