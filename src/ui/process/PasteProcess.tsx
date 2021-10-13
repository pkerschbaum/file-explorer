import * as React from 'react';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import styled from '@mui/styled-engine';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import { Stack } from '@app/ui/layouts/Stack';
import { TextBox } from '@app/ui/elements/TextBox';
import { LinearProgress } from '@app/ui/elements/LinearProgress';
import { PasteProcess as PasteProcessType, PASTE_PROCESS_STATUS } from '@app/platform/file-types';
import { useRemoveProcess } from '@app/platform/file.hooks';
import { uriHelper } from '@app/base/utils/uri-helper';
import { formatter } from '@app/base/utils/formatter.util';
import { byteSize } from '@app/base/utils/byte-size.util';
import { numbers } from '@app/base/utils/numbers.util';
import { assertUnreachable } from '@app/base/utils/types.util';

export const PasteProcess: React.FC<{ process: PasteProcessType }> = ({ process }) => {
  const { removeProcess } = useRemoveProcess();

  const smallestUnitOfTotalSize = byteSize.probe(process.totalSize).unit;
  const { fileName, extension } = uriHelper.extractNameAndExtension(process.destinationFolder);

  const destinationFolderLabel = formatter.file({ name: fileName, extension });
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
      assertUnreachable(process);
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
    <Stack key={process.id} direction="column" alignItems="stretch">
      <Stack spacing={4} justifyContent="space-between">
        <Stack spacing={2}>
          <Stack direction="column" alignItems="flex-start">
            {process.sourceUris.slice(0, 2).map((uri) => {
              const { fileName, extension } = uriHelper.extractNameAndExtension(uri);
              const sourceFileLabel = formatter.file({ name: fileName, extension });
              return (
                <TextBox key={URI.from(uri).toString()} fontBold>
                  {sourceFileLabel}
                </TextBox>
              );
            })}
            {process.sourceUris.length > 2 && <TextBox fontBold>...</TextBox>}
          </Stack>

          <DoubleArrowIcon />
          <TextBox fontBold>{destinationFolderLabel}</TextBox>
        </Stack>

        {(process.status === PASTE_PROCESS_STATUS.SUCCESS ||
          process.status === PASTE_PROCESS_STATUS.FAILURE ||
          process.status === PASTE_PROCESS_STATUS.ABORT_SUCCESS) && (
          <Tooltip title="Discard card">
            <IconButton autoFocus size="large" onClick={() => removeProcess(process.id)}>
              <ClearAllIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
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
            <TextBox>
              {formatter.bytes(process.bytesProcessed, { unit: smallestUnitOfTotalSize })}
            </TextBox>
            <TextBox>/</TextBox>
            <TextBox>
              {formatter.bytes(process.totalSize, { unit: smallestUnitOfTotalSize })}
            </TextBox>
          </Stack>
        )}

      {(process.status === PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE ||
        process.status === PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE) && (
        <Button onClick={() => process.cancellationTokenSource.cancel()}>Cancel</Button>
      )}
    </Stack>
  );
};

const LinearProgressBox = styled(Box)`
  width: 100%;
  padding-top: 2px;
`;
