import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import * as React from 'react';

import { check } from '@app/base/utils/assert.util';
import {
  ButtonHandle,
  Button,
  Card,
  Icon,
  Popover,
  TextField,
  usePopover,
  Paper,
} from '@app/ui/components-library';

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
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [createFolderValue, setCreateFolderValue] = React.useState('');

  const { triggerProps, popoverInstance } = usePopover({
    triggerRef: buttonRef,
  });

  React.useEffect(
    function resetValueOnPopoverClose() {
      if (!popoverInstance.state.isOpen) {
        setCreateFolderValue('');
      }
    },
    [popoverInstance.state.isOpen],
  );

  const inputIsValid = check.isNonEmptyString(createFolderValue);

  async function handleSubmit() {
    if (!inputIsValid) {
      return;
    }

    await onSubmit(createFolderValue);
    popoverInstance.state.close();
  }

  return (
    <>
      <Button
        ref={buttonRef}
        handleRef={buttonHandleRef}
        startIcon={<Icon Component={CreateNewFolderOutlinedIcon} />}
        endIcon={buttonEndIcon}
        enableLayoutAnimation
        onPress={() => popoverInstance.state.open()}
        ariaButtonProps={triggerProps}
      >
        New Folder
      </Button>

      {popoverInstance.state.isOpen && (
        <Popover popoverInstance={popoverInstance}>
          <Paper>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSubmit();
              }}
            >
              <Card
                content={
                  <TextField
                    placeholder="Name of folder"
                    aria-label="Name of folder"
                    value={createFolderValue}
                    onChange={setCreateFolderValue}
                  />
                }
                actions={
                  <Button
                    variant={!inputIsValid ? undefined : 'contained'}
                    type="submit"
                    isDisabled={!inputIsValid}
                    /* https://github.com/adobe/react-spectrum/issues/1593 */
                    onPress={handleSubmit}
                  >
                    Create
                  </Button>
                }
              />
            </form>
          </Paper>
        </Popover>
      )}
    </>
  );
};
