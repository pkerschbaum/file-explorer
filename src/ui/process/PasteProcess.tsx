import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';
import styled from 'styled-components';

import { assertThat } from '@app/base/utils/assert.util';
import { byteSize } from '@app/base/utils/byte-size.util';
import { formatter } from '@app/base/utils/formatter.util';
import { numbers } from '@app/base/utils/numbers.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { PasteProcess as PasteProcessType, PASTE_PROCESS_STATUS } from '@app/domain/types';
import { removeProcess } from '@app/operations/file.operations';
import { RoundedAccordion } from '@app/ui/elements/Accordion';
import { LinearProgress } from '@app/ui/elements/LinearProgress';
import { TextBox } from '@app/ui/elements/TextBox';
import { Stack } from '@app/ui/layouts/Stack';
import { rotate } from '@app/ui/utils/animations';

export const PasteProcess: React.FC<{ process: PasteProcessType }> = ({ process }) => {
  const smallestUnitOfTotalSize = byteSize.probe(process.totalSize).unit;

  const destinationFolderLabel = formatter.folderPath(process.destinationFolder);
  let content;
  switch (process.status) {
    case PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE: {
      content = (
        <TextBox>
          Determining total size of files to {process.pasteShouldMove ? 'move' : 'copy'}...
        </TextBox>
      );
      break;
    }
    case PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE: {
      content = undefined;
      break;
    }
    case PASTE_PROCESS_STATUS.SUCCESS: {
      content = <TextBox>Files transferred successfully</TextBox>;
      break;
    }
    case PASTE_PROCESS_STATUS.FAILURE: {
      content = (
        <Stack direction="column" alignItems="flex-start">
          <TextBox>Error occured during transfer of the files:</TextBox>
          <TextBox>{process.error}</TextBox>
        </Stack>
      );
      break;
    }
    case PASTE_PROCESS_STATUS.ABORT_REQUESTED: {
      content = (
        <TextBox>
          Cancellation requested, cleaning up files/folders which were currently{' '}
          {process.pasteShouldMove ? 'moved' : 'copied'}...
        </TextBox>
      );
      break;
    }
    case PASTE_PROCESS_STATUS.ABORT_SUCCESS: {
      content = (
        <TextBox>File {process.pasteShouldMove ? 'move' : 'copy'} process got cancelled</TextBox>
      );
      break;
    }
    default: {
      assertThat.isUnreachable(process);
    }
  }

  const percentageBytesProcessed =
    process.status === PASTE_PROCESS_STATUS.SUCCESS
      ? 100
      : numbers.roundToDecimals((process.bytesProcessed / process.totalSize) * 100, 0);
  const progressIndicatorVariant =
    process.status === PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE ||
    process.status === PASTE_PROCESS_STATUS.ABORT_REQUESTED ||
    (process.progressOfAtLeastOneSourceIsIndeterminate &&
      process.status === PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE)
      ? 'indeterminate'
      : 'determinate';

  return (
    <RoundedAccordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack sx={{ width: '100%' }} justifyContent="space-between">
          <Stack>
            {process.pasteShouldMove ? (
              <ContentCutOutlinedIcon fontSize="small" />
            ) : !process.pasteShouldMove ? (
              <ContentCopyOutlinedIcon fontSize="small" />
            ) : (
              assertThat.isUnreachable(process.pasteShouldMove)
            )}
            <DoubleArrowIcon fontSize="small" />
            <TextBox fontSize="sm">{destinationFolderLabel}</TextBox>
          </Stack>

          {(process.status === PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE ||
            process.status === PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE ||
            process.status === PASTE_PROCESS_STATUS.ABORT_REQUESTED) && (
            <RotatingAutorenewOutlinedIcon fontSize="small" />
          )}

          {(process.status === PASTE_PROCESS_STATUS.SUCCESS ||
            process.status === PASTE_PROCESS_STATUS.FAILURE ||
            process.status === PASTE_PROCESS_STATUS.ABORT_SUCCESS) && (
            <Tooltip title="Discard card">
              <IconButton autoFocus size="medium" onClick={() => removeProcess(process.id)}>
                <ClearAllIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Stack direction="column" alignItems="stretch" spacing={2}>
          <Stack direction="column" alignItems="stretch" spacing={0.5}>
            <TextBox fontSize="sm">Destination:</TextBox>
            <TextBox fontSize="sm" fontBold>
              {destinationFolderLabel}
            </TextBox>
          </Stack>

          <Stack direction="column" alignItems="stretch" spacing={0.5}>
            <TextBox fontSize="sm">Files:</TextBox>
            {process.sourceUris.slice(0, 2).map((uri) => {
              const { fileName, extension } = uriHelper.extractNameAndExtension(uri);
              const sourceFileLabel = formatter.file({ name: fileName, extension });
              return (
                <TextBox key={URI.from(uri).toString()} fontSize="sm" fontBold>
                  {sourceFileLabel}
                </TextBox>
              );
            })}
            {process.sourceUris.length > 2 && (
              <TextBox fontSize="sm" fontBold>
                + {process.sourceUris.length - 2} files
              </TextBox>
            )}
          </Stack>

          {content}

          {process.status !== PASTE_PROCESS_STATUS.ABORT_SUCCESS && (
            <LinearProgressBox>
              <LinearProgress
                // disable animation from indeterminate to determinate variant by resetting component on variant change (via key prop)
                key={progressIndicatorVariant}
                variant={progressIndicatorVariant}
                value={percentageBytesProcessed}
              />
            </LinearProgressBox>
          )}

          {process.status !== PASTE_PROCESS_STATUS.SUCCESS &&
            process.status !== PASTE_PROCESS_STATUS.ABORT_SUCCESS && (
              <Stack spacing={0.5}>
                <TextBox fontSize="sm">
                  {formatter.bytes(process.bytesProcessed, { unit: smallestUnitOfTotalSize })}
                </TextBox>
                <TextBox fontSize="sm">/</TextBox>
                <TextBox fontSize="sm">
                  {formatter.bytes(process.totalSize, { unit: smallestUnitOfTotalSize })}
                </TextBox>
              </Stack>
            )}

          {(process.status === PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE ||
            process.status === PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE) && (
            <Button onClick={() => process.cancellationTokenSource.cancel()}>Cancel</Button>
          )}
        </Stack>
      </AccordionDetails>
    </RoundedAccordion>
  );
};

const LinearProgressBox = styled(Box)`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing(-2)};
`;

const RotatingAutorenewOutlinedIcon = styled(AutorenewOutlinedIcon)`
  animation: ${rotate} 2s linear infinite;
`;
