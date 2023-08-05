import styled, { css } from 'styled-components';

import { formatter as formatter2 } from '@file-explorer/code-oss-ecma/formatter.util';
import type { PasteProcess as PasteProcessType } from '@file-explorer/code-oss-ecma/types';
import { PASTE_PROCESS_STATUS } from '@file-explorer/code-oss-ecma/types';
import { assertIsUnreachable } from '@file-explorer/commons-ecma/util/assert.util';
import { byteSize } from '@file-explorer/commons-ecma/util/byte-size.util';
import { numbers } from '@file-explorer/commons-ecma/util/numbers.util';
import { formatter } from '@file-explorer/domain/formatter.util';

import {
  Box,
  Button,
  ContentCopyOutlinedIcon,
  ContentCutOutlinedIcon,
  DoubleArrowIcon,
  LinearProgress,
} from '#pkg/ui/components-library';
import type { ProcessVariantProps } from '#pkg/ui/process/Process';
import { ProcessResourcesList } from '#pkg/ui/process/ProcessResourcesList';

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

export function computeProcessCardPropsFromPasteProcess(
  process: PasteProcessType,
): ProcessVariantProps {
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
        <ErrorBox>
          <Box>Error occured during transfer of the files/folders:</Box>
          <Box>{process.error}</Box>
        </ErrorBox>
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
      assertIsUnreachable(process);
    }
  }

  const processMeta = STATUS_META_INFOS[process.status];
  const destinationFolderLabel = formatter2.resourcePath(process.destinationDirectory);
  const percentageBytesProcessed =
    process.status === PASTE_PROCESS_STATUS.SUCCESS
      ? 100
      : numbers.roundToDecimals((process.bytesProcessed / process.totalSize) * 100, 0);
  const progressIsIndeterminate =
    process.status === PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE ||
    process.status === PASTE_PROCESS_STATUS.ABORT_REQUESTED ||
    (process.progressOfAtLeastOneSourceIsIndeterminate &&
      process.status === PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE);

  return {
    labels: { container: 'Paste Process' },
    summaryIcon: (
      <>
        {process.pasteShouldMove ? (
          <ContentCutOutlinedIcon />
        ) : !process.pasteShouldMove ? (
          <ContentCopyOutlinedIcon />
        ) : (
          assertIsUnreachable(process.pasteShouldMove)
        )}
        <DoubleArrowIcon />
      </>
    ),
    summaryText: destinationFolderLabel,
    details: (
      <>
        <ResourcesList>
          <Box>Destination:</Box>
          <ResourceBox>{destinationFolderLabel}</ResourceBox>
        </ResourcesList>

        <ProcessResourcesList uris={process.sourceUris} />

        {content}

        {processMeta.showProgress && (
          <ProgressArea status={process.status}>
            <LinearProgress
              aria-label="Progress of paste process"
              isIndeterminate={progressIsIndeterminate}
              value={percentageBytesProcessed}
            />

            {processMeta.showProgressInBytes && (
              <ProgressBytes>
                <Box>
                  {formatter.bytes(process.bytesProcessed, { unit: smallestUnitOfTotalSize })}
                </Box>
                <Box>/</Box>
                <Box>{formatter.bytes(process.totalSize, { unit: smallestUnitOfTotalSize })}</Box>
              </ProgressBytes>
            )}
          </ProgressArea>
        )}

        {processMeta.allowCancellation && (
          <Button onPress={() => process.cancellationTokenSource.cancel()}>Cancel</Button>
        )}
      </>
    ),
    isBusy: processMeta.isBusy,
    isRemovable: processMeta.isRemovable,
  };
}

const ErrorBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2);
`;

const ResourcesList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
`;

const ResourceBox = styled(Box)`
  font-weight: var(--font-weight-bold);
  word-break: break-all;
`;

const ProgressArea = styled(Box)<{ status: PASTE_PROCESS_STATUS }>`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);

  ${(props) =>
    props.status === PASTE_PROCESS_STATUS.FAILURE &&
    css`
      color: var(--color-darken-3);
    `};
`;

const ProgressBytes = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
`;
