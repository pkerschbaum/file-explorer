import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { Button, Popover, TextField } from '@mui/material';
import * as React from 'react';

import { check } from '@app/base/utils/assert.util';
import { Stack } from '@app/ui/layouts/Stack';

type CreateFolderProps = {
  onSubmit: (folderName: string) => void | Promise<void>;
};

export const CreateFolder: React.FC<CreateFolderProps> = ({ onSubmit }) => {
  const [createFolderValue, setCreateFolderValue] = React.useState('');
  const [createFolderAnchorEl, setCreateFolderAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  React.useEffect(
    function resetValueOnPopoverClose() {
      if (createFolderAnchorEl === null) {
        setCreateFolderValue('');
      }
    },
    [createFolderAnchorEl],
  );

  async function handleSubmit() {
    if (check.isEmptyString(createFolderValue)) {
      return;
    }

    await onSubmit(createFolderValue);
    setCreateFolderAnchorEl(null);
  }

  return (
    <>
      <Button
        onClick={(e) => setCreateFolderAnchorEl(e.currentTarget)}
        startIcon={<CreateNewFolderOutlinedIcon />}
      >
        New Folder
      </Button>

      <Popover
        open={createFolderAnchorEl !== null}
        anchorEl={createFolderAnchorEl}
        onClose={() => setCreateFolderAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        BackdropProps={{ invisible: false }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          <Stack direction="column" alignItems="stretch" sx={{ padding: 1.5 }}>
            <TextField
              autoFocus
              label="Name of folder"
              value={createFolderValue}
              onChange={(event) => setCreateFolderValue(event.target.value)}
            />
            <Stack justifyContent="end">
              <Button
                variant={check.isEmptyString(createFolderValue) ? undefined : 'contained'}
                type="submit"
                disabled={check.isEmptyString(createFolderValue)}
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </form>
      </Popover>
    </>
  );
};
