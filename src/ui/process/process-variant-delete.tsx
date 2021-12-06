import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import styled from 'styled-components';

import { assertIsUnreachable } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { DeleteProcess as DeleteProcessType, DELETE_PROCESS_STATUS } from '@app/domain/types';
import { removeProcess, runDeleteProcess } from '@app/operations/resource.operations';
import { Box, Button, LinearProgress, Stack } from '@app/ui/components-library';
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
        </>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.RUNNING: {
      contentToRender = (
        <>
          <Box>Deletion is in progress...</Box>
          <LinearProgress variant="indeterminate" />
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
        <Stack direction="column" alignItems="flex-start">
          <Box>Error occured during deletion of the files/folders:</Box>
          <Box>{process.error}</Box>
        </Stack>
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
    summaryIcon: <DeleteOutlinedIcon fontSize="inherit" />,
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
            return (
              <ResourcesListBox key={uriHelper.getComparisonKey(uri)}>
                {resourceLabel}
              </ResourcesListBox>
            );
          })}
        </ResourcesList>

        <ContentList>{contentToRender}</ContentList>
      </>
    ),
    isBusy: processMeta.isBusy,
    isRemovable: processMeta.isRemovable,
  };
}

const ResourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
`;

const ResourcesListBox = styled(Box)`
  font-weight: ${({ theme }) => theme.font.weights.bold};
  word-break: break-all;
`;

const ContentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing()};
`;
