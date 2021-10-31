import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Button, LinearProgress } from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { isUnreachable } from '@app/base/utils/assert.util';
import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { DeleteProcess as DeleteProcessType, DELETE_PROCESS_STATUS } from '@app/domain/types';
import { removeProcess, runDeleteProcess } from '@app/operations/file.operations';
import { TextBox } from '@app/ui/elements/TextBox';
import { Stack } from '@app/ui/layouts/Stack';
import { Process } from '@app/ui/process/Process';

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

export const DeleteProcess: React.FC<{ process: DeleteProcessType }> = ({ process }) => {
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
          <TextBox fontSize="sm">Deletion is in progress...</TextBox>
          <LinearProgress variant="indeterminate" />
        </>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.SUCCESS: {
      contentToRender = <TextBox fontSize="sm">Files deleted successfully</TextBox>;
      break;
    }
    case DELETE_PROCESS_STATUS.FAILURE: {
      contentToRender = (
        <Stack direction="column" alignItems="flex-start">
          <TextBox fontSize="sm">Error occured during deletion of the files:</TextBox>
          <TextBox fontSize="sm">{process.error}</TextBox>
        </Stack>
      );
      break;
    }
    default: {
      isUnreachable(process);
    }
  }

  const processMeta = STATUS_META_INFOS[process.status];

  return (
    <Process
      processId={process.id}
      summaryIcon={<DeleteOutlinedIcon fontSize="small" />}
      summaryText={process.uris
        .map((uri) => {
          const { fileName, extension } = uriHelper.extractNameAndExtension(uri);
          const fileLabel = formatter.file({ name: fileName, extension });

          return fileLabel;
        })
        .join(', ')}
      details={
        <>
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
            {contentToRender}
          </Stack>
        </>
      }
      isBusy={processMeta.isBusy}
      isRemovable={processMeta.isRemovable}
    />
  );
};
