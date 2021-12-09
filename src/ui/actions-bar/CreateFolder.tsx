import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import * as React from 'react';

import { check } from '@app/base/utils/assert.util';
import { ButtonHandle, Button, Card, Icon, Popover, TextField } from '@app/ui/components-library';

type CreateFolderProps = {
  buttonHandleRef?: React.RefObject<ButtonHandle>;
  buttonEndIcon?: React.ReactNode;
  onSubmit: (folderName: string) => void | Promise<void>;
};

export const CreateFolder: React.FC<CreateFolderProps> = ({
  buttonHandleRef,
  buttonEndIcon,
  onSubmit,
}) => {
  const [createFolderValue, setCreateFolderValue] = React.useState('');
  const [createFolderAnchorEl, setCreateFolderAnchorEl] = React.useState<HTMLElement | null>(null);

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
        handleRef={buttonHandleRef}
        onPress={(e) => setCreateFolderAnchorEl(e.target)}
        startIcon={<Icon Component={CreateNewFolderOutlinedIcon} />}
        endIcon={buttonEndIcon}
        enableLayoutAnimation
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
          <Card
            content={
              <TextField
                autoFocus
                placeholder="Name of folder"
                value={createFolderValue}
                onChange={setCreateFolderValue}
              />
            }
            actions={
              <Button
                variant={check.isEmptyString(createFolderValue) ? undefined : 'contained'}
                type="submit"
                isDisabled={check.isEmptyString(createFolderValue)}
              >
                Create
              </Button>
            }
          />
        </form>
      </Popover>
    </>
  );
};
