import * as React from 'react';
import { Button, IconButton, LinearProgress, Tooltip } from '@mui/material';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { Stack } from '@app/ui/layouts/Stack';
import { TextBox } from '@app/ui/elements/TextBox';
import { DeleteProcess as DeleteProcessType, DELETE_PROCESS_STATUS } from '@app/domain/types';
import { removeProcess, runDeleteProcess } from '@app/operations/file.operations';
import { uriHelper } from '@app/base/utils/uri-helper';
import { formatter } from '@app/base/utils/formatter.util';
import { isUnreachable } from '@app/base/utils/assert.util';

export const DeleteProcess: React.FC<{ process: DeleteProcessType }> = ({ process }) => {
  let contentToRender;
  switch (process.status) {
    case DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT: {
      contentToRender = (
        <DeleteProcessCard process={process}>
          <Button autoFocus onClick={() => runDeleteProcess(process.id, { useTrash: true })}>
            <Stack>
              <DeleteOutlineOutlinedIcon fontSize="small" />
              Move to trash
            </Stack>
          </Button>
          <Button onClick={() => runDeleteProcess(process.id, { useTrash: false })}>
            <Stack>
              <DeleteForeverOutlinedIcon fontSize="small" />
              Delete permanently
            </Stack>
          </Button>
          <Button onClick={() => removeProcess(process.id)}>Abort</Button>
        </DeleteProcessCard>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.RUNNING: {
      contentToRender = (
        <DeleteProcessCard process={process}>
          <TextBox>Deletion is in progress...</TextBox>
          <LinearProgress variant="indeterminate" />
        </DeleteProcessCard>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.SUCCESS: {
      contentToRender = (
        <DeleteProcessCard process={process}>
          <TextBox>Files deleted successfully</TextBox>
        </DeleteProcessCard>
      );
      break;
    }
    case DELETE_PROCESS_STATUS.FAILURE: {
      contentToRender = (
        <DeleteProcessCard process={process}>
          <Stack direction="column" alignItems="flex-start">
            <TextBox>Error occured during deletion of the files:</TextBox>
            <TextBox>{process.error}</TextBox>
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

const DeleteProcessCard: React.FC<DeleteProcessCardProps> = ({ process, children }) => {
  return (
    <Stack key={process.id} direction="column" alignItems="stretch">
      <Stack spacing={4} justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          {process.uris.slice(0, 2).map((uri) => {
            const { fileName, extension } = uriHelper.extractNameAndExtension(uri);
            const fileLabel = formatter.file({ name: fileName, extension });

            return (
              <TextBox key={URI.from(uri).toString()} fontBold>
                {fileLabel}
              </TextBox>
            );
          })}
          {process.uris.length > 2 && <TextBox fontBold>...</TextBox>}
        </Stack>

        {(process.status === DELETE_PROCESS_STATUS.SUCCESS ||
          process.status === DELETE_PROCESS_STATUS.FAILURE) && (
          <Tooltip title="Discard card">
            <IconButton autoFocus size="large" onClick={() => removeProcess(process.id)}>
              <ClearAllIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {children}
    </Stack>
  );
};
