import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { Button } from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { assertThat } from '@app/base/utils/assert.util';
import { byteSize } from '@app/base/utils/byte-size.util';
import { formatter } from '@app/base/utils/formatter.util';
import { numbers } from '@app/base/utils/numbers.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { PasteProcess as PasteProcessType, PASTE_PROCESS_STATUS } from '@app/domain/types';
import { LinearProgress } from '@app/ui/elements/LinearProgress';
import { TextBox } from '@app/ui/elements/TextBox';
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

export const PasteProcess: React.FC<{ process: PasteProcessType }> = ({ process }) => {
  const smallestUnitOfTotalSize = byteSize.probe(process.totalSize).unit;

  let content;
  switch (process.status) {
    case PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE: {
      content = (
        <TextBox fontSize="sm">
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
      content = <TextBox fontSize="sm">Files transferred successfully</TextBox>;
      break;
    }
    case PASTE_PROCESS_STATUS.FAILURE: {
      content = (
        <Stack direction="column" alignItems="flex-start">
          <TextBox fontSize="sm">Error occured during transfer of the files:</TextBox>
          <TextBox fontSize="sm">{process.error}</TextBox>
        </Stack>
      );
      break;
    }
    case PASTE_PROCESS_STATUS.ABORT_REQUESTED: {
      content = (
        <TextBox fontSize="sm">
          Cancellation requested, cleaning up files/folders which have been{' '}
          {process.pasteShouldMove ? 'moved' : 'copied'} already...
        </TextBox>
      );
      break;
    }
    case PASTE_PROCESS_STATUS.ABORT_SUCCESS: {
      content = (
        <TextBox fontSize="sm">
          File {process.pasteShouldMove ? 'move' : 'copy'} process got cancelled
        </TextBox>
      );
      break;
    }
    default: {
      assertThat.isUnreachable(process);
    }
  }

  const processMeta = STATUS_META_INFOS[process.status];
  const destinationFolderLabel = formatter.folderPath(process.destinationFolder);
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
      processId={process.id}
      summaryIcon={
        <>
          {process.pasteShouldMove ? (
            <ContentCutOutlinedIcon fontSize="small" />
          ) : !process.pasteShouldMove ? (
            <ContentCopyOutlinedIcon fontSize="small" />
          ) : (
            assertThat.isUnreachable(process.pasteShouldMove)
          )}
          <DoubleArrowIcon fontSize="small" />
        </>
      }
      summaryText={destinationFolderLabel}
      details={
        <>
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
                  <TextBox fontSize="sm">
                    {formatter.bytes(process.bytesProcessed, { unit: smallestUnitOfTotalSize })}
                  </TextBox>
                  <TextBox fontSize="sm">/</TextBox>
                  <TextBox fontSize="sm">
                    {formatter.bytes(process.totalSize, { unit: smallestUnitOfTotalSize })}
                  </TextBox>
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
