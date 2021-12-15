import styled from 'styled-components';

import { assertIsUnreachable } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { DeleteProcess as DeleteProcessType, DELETE_PROCESS_STATUS } from '@app/domain/types';
import { removeProcess, runDeleteProcess } from '@app/operations/resource.operations';
import {
  Box,
  Button,
  DeleteForeverOutlinedIcon,
  DeleteOutlinedIcon,
  DeleteOutlineOutlinedIcon,
  LinearProgress,
} from '@app/ui/components-library';
import type { ProcessVariantProps } from '@app/ui/process/Process';

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
  let contentToRender;
  switch (process.status) {
    case DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT: {
      contentToRender = (
        <>
          <Button
            onPress={() => runDeleteProcess(process.id, { useTrash: true })}
            startIcon={<DeleteOutlineOutlinedIcon />}
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
    summaryText: process.uris
      .map((uri) => {
        const { resourceName, extension } = uriHelper.extractNameAndExtension(uri);
        const resourceLabel = formatter.resourceBasename({ name: resourceName, extension });
        return resourceLabel;
      })
      .join(', '),
    details: (
      <>
        <ResourcesList>
          <Box>Files/Folders:</Box>
          {process.uris.map((uri) => {
            const { resourceName, extension } = uriHelper.extractNameAndExtension(uri);
            const resourceLabel = formatter.resourceBasename({ name: resourceName, extension });
            return <ResourceBox key={uriHelper.getComparisonKey(uri)}>{resourceLabel}</ResourceBox>;
          })}
        </ResourcesList>

        <ContentList>{contentToRender}</ContentList>
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

const ContentList = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;
