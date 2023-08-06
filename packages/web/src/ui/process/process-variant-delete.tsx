import { styled } from 'styled-components';

import type { DeleteProcess as DeleteProcessType } from '@file-explorer/code-oss-ecma/types';
import { DELETE_PROCESS_STATUS } from '@file-explorer/code-oss-ecma/types';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';
import { assertIsUnreachable } from '@file-explorer/commons-ecma/util/assert.util';

import { removeProcess, runDeleteProcess } from '#pkg/operations/resource.operations';
import {
  Box,
  Button,
  DeleteForeverOutlinedIcon,
  DeleteOutlinedIcon,
  LinearProgress,
} from '#pkg/ui/components-library';
import type { ProcessVariantProps } from '#pkg/ui/process/Process';
import { ProcessResourcesList } from '#pkg/ui/process/ProcessResourcesList';

type StatusMetaInfos = {
  [status in DELETE_PROCESS_STATUS]: {
    [feature in 'isBusy' | 'isRemovable']: boolean;
  };
};

const STATUS_META_INFOS: StatusMetaInfos = {
  [DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT]: {
    isBusy: false,
    isRemovable: false,
  },
  [DELETE_PROCESS_STATUS.RUNNING]: {
    isBusy: true,
    isRemovable: false,
  },
  [DELETE_PROCESS_STATUS.SUCCESS]: {
    isBusy: false,
    isRemovable: true,
  },
  [DELETE_PROCESS_STATUS.FAILURE]: {
    isBusy: false,
    isRemovable: true,
  },
};

export function computeProcessCardPropsFromDeleteProcess(
  process: DeleteProcessType,
): ProcessVariantProps {
  let captureFocus = false;
  let contentToRender;
  switch (process.status) {
    case DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT: {
      captureFocus = true;
      contentToRender = (
        <>
          <Button
            onPress={() => runDeleteProcess(process.id, { useTrash: true })}
            startIcon={<DeleteOutlinedIcon />}
          >
            Move to trash
          </Button>
          <Button
            onPress={() => runDeleteProcess(process.id, { useTrash: false })}
            startIcon={<DeleteForeverOutlinedIcon />}
          >
            Delete permanently
          </Button>
          <Button onPress={() => removeProcess(process.id)}>Abort</Button>
        </>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.RUNNING: {
      contentToRender = (
        <>
          <Box>Deletion is in progress...</Box>
          <LinearProgress aria-label="Progress of delete process" isIndeterminate />
        </>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.SUCCESS: {
      contentToRender = <Box>Files/Folders deleted successfully</Box>;
      break;
    }
    case DELETE_PROCESS_STATUS.FAILURE: {
      contentToRender = (
        <ErrorBox>
          <Box>Error occured during deletion of the files/folders:</Box>
          <Box>{process.error}</Box>
        </ErrorBox>
      );
      break;
    }
    default: {
      assertIsUnreachable(process);
    }
  }

  const processMeta = STATUS_META_INFOS[process.status];

  return {
    labels: { container: 'Delete Process' },
    summaryIcon: <DeleteOutlinedIcon />,
    summaryText: process.uris.map((uri) => uriHelper.extractBasename(uri)).join(', '),
    details: (
      <>
        <ProcessResourcesList uris={process.uris} />
        <ContentList>{contentToRender}</ContentList>
      </>
    ),
    isBusy: processMeta.isBusy,
    isRemovable: processMeta.isRemovable,
    captureFocus,
  };
}

const ErrorBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2);
`;

const ContentList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;
