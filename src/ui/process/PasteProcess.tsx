import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Box, Button } from '@mui/material';
import * as React from 'react';

import { assertThat } from '@app/base/utils/assert.util';
import { byteSize } from '@app/base/utils/byte-size.util';
import { formatter } from '@app/base/utils/formatter.util';
import { numbers } from '@app/base/utils/numbers.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { PasteProcess as PasteProcessType, PASTE_PROCESS_STATUS } from '@app/domain/types';
import { LinearProgress } from '@app/ui/elements/LinearProgress';
import { Stack } from '@app/ui/layouts/Stack';
import { ProcessCard } from '@app/ui/process/ProcessCard';

type StatusMetaInfos = {
  [status in PASTE_PROCESS_STATUS]: {
    [feature in
      | 'showProgress'
      | 'showProgressInBytes'
      | 'allowCancellation'
      | 'isBusy'
      | 'isRemovable']: boolean;
  };
};

const STATUS_META_INFOS: StatusMetaInfos = {
  [PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE]: {
    showProgress: true,
    showProgressInBytes: false,
    allowCancellation: true,
    isBusy: true,
    isRemovable: false,
  },
  [PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE]: {
    showProgress: true,
    showProgressInBytes: true,
    allowCancellation: true,
    isBusy: true,
    isRemovable: false,
  },
  [PASTE_PROCESS_STATUS.SUCCESS]: {
    showProgress: true,
    showProgressInBytes: false,
    allowCancellation: false,
    isBusy: false,
    isRemovable: true,
  },
  [PASTE_PROCESS_STATUS.FAILURE]: {
    showProgress: true,
    showProgressInBytes: true,
    allowCancellation: false,
    isBusy: false,
    isRemovable: true,
  },
  [PASTE_PROCESS_STATUS.ABORT_REQUESTED]: {
    showProgress: true,
    showProgressInBytes: false,
    allowCancellation: false,
    isBusy: true,
    isRemovable: false,
  },
  [PASTE_PROCESS_STATUS.ABORT_SUCCESS]: {
    showProgress: false,
    showProgressInBytes: false,
    allowCancellation: false,
    isBusy: false,
    isRemovable: true,
  },
};

type PasteProcessProps = {
  process: PasteProcessType;
  className?: string;
};

export const PasteProcess: React.FC<PasteProcessProps> = ({ process, className }) => {
  const smallestUnitOfTotalSize = byteSize.probe(process.totalSize).unit;

  let content;
  switch (process.status) {
    case PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE: {
      content = (
        <Box>
          Determining total size of files/folders to {process.pasteShouldMove ? 'move' : 'copy'}...
        </Box>
      );
      break;
    }
    case PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE: {
      content = undefined;
      break;
    }
    case PASTE_PROCESS_STATUS.SUCCESS: {
      content = <Box>Files/Folders transferred successfully</Box>;
      break;
    }
    case PASTE_PROCESS_STATUS.FAILURE: {
      content = (
        <Stack direction="column" alignItems="flex-start">
          <Box>Error occured during transfer of the files/folders:</Box>
          <Box>{process.error}</Box>
        </Stack>
      );
      break;
    }
    case PASTE_PROCESS_STATUS.ABORT_REQUESTED: {
      content = (
        <Box>
          Cancellation requested, cleaning up files/folders which have been{' '}
          {process.pasteShouldMove ? 'moved' : 'copied'} already...
        </Box>
      );
      break;
    }
    case PASTE_PROCESS_STATUS.ABORT_SUCCESS: {
      content = <Box>File {process.pasteShouldMove ? 'move' : 'copy'} process got cancelled</Box>;
      break;
    }
    default: {
      assertThat.isUnreachable(process);
    }
  }

  const processMeta = STATUS_META_INFOS[process.status];
  const destinationFolderLabel = formatter.resourcePath(process.destinationDirectory);
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
    <ProcessCard
      className={className}
      labels={{ container: 'Paste Process' }}
      processId={process.id}
      summaryIcon={
        <>
          {process.pasteShouldMove ? (
            <ContentCutOutlinedIcon fontSize="inherit" />
          ) : !process.pasteShouldMove ? (
            <ContentCopyOutlinedIcon fontSize="inherit" />
          ) : (
            assertThat.isUnreachable(process.pasteShouldMove)
          )}
          <DoubleArrowIcon fontSize="inherit" />
        </>
      }
      summaryText={destinationFolderLabel}
      details={
        <>
          <Stack direction="column" alignItems="stretch" spacing={0.5}>
            <Box>Destination:</Box>
            <Box sx={{ fontWeight: (theme) => theme.font.weights.bold, wordBreak: 'break-all' }}>
              {destinationFolderLabel}
            </Box>
          </Stack>

          <Stack direction="column" alignItems="stretch" spacing={0.5}>
            <Box>Files/Folders:</Box>
            {process.sourceUris.slice(0, 2).map((uri) => {
              const { resourceName, extension } = uriHelper.extractNameAndExtension(uri);
              const sourceResourceLabel = formatter.resourceBasename({
                name: resourceName,
                extension,
              });
              return (
                <Box
                  key={uriHelper.getComparisonKey(uri)}
                  sx={{ fontWeight: (theme) => theme.font.weights.bold, wordBreak: 'break-all' }}
                >
                  {sourceResourceLabel}
                </Box>
              );
            })}
            {process.sourceUris.length > 2 && (
              <Box sx={{ fontWeight: (theme) => theme.font.weights.bold }}>
                + {process.sourceUris.length - 2} files/folders
              </Box>
            )}
          </Stack>

          {content}

          {processMeta.showProgress && (
            <Stack
              direction="column"
              alignItems="stretch"
              sx={{
                color: (theme) =>
                  process.status === PASTE_PROCESS_STATUS.FAILURE
                    ? theme.palette.action.disabled
                    : undefined,
              }}
            >
              <LinearProgress
                // disable animation from indeterminate to determinate variant by resetting component on variant change (via key prop)
                key={progressIndicatorVariant}
                variant={progressIndicatorVariant}
                value={percentageBytesProcessed}
              />

              {processMeta.showProgressInBytes && (
                <Stack spacing={0.5}>
                  <Box>
                    {formatter.bytes(process.bytesProcessed, { unit: smallestUnitOfTotalSize })}
                  </Box>
                  <Box>/</Box>
                  <Box>{formatter.bytes(process.totalSize, { unit: smallestUnitOfTotalSize })}</Box>
                </Stack>
              )}
            </Stack>
          )}

          {processMeta.allowCancellation && (
            <Button onClick={() => process.cancellationTokenSource.cancel()}>Cancel</Button>
          )}
        </>
      }
      isBusy={processMeta.isBusy}
      isRemovable={processMeta.isRemovable}
    />
  );
};
