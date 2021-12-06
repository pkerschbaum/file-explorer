import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import * as React from 'react';

import { check } from '@app/base/utils/assert.util';
import {
  ActionButton,
  ActionButtonRef,
  Button,
  Card,
  Popover,
  Stack,
  TextField,
} from '@app/ui/components-library';

type CreateFolderProps = {
  actionButtonRef?: React.Ref<ActionButtonRef>;
  actionButtonEndIcon?: React.ReactNode;
  onSubmit: (folderName: string) => void | Promise<void>;
};

export const CreateFolder: React.FC<CreateFolderProps> = ({
  actionButtonRef,
  actionButtonEndIcon,
  onSubmit,
}) => {
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
      <ActionButton
        ref={actionButtonRef}
        onClick={(e) => setCreateFolderAnchorEl(e.currentTarget)}
        StartIconComponent={CreateNewFolderOutlinedIcon}
        endIcon={actionButtonEndIcon}
      >
        New Folder
      </ActionButton>

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
          <Card>
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
          </Card>
        </form>
      </Popover>
    </>
  );
};
