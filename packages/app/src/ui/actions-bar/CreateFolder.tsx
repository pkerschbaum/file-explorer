import * as React from 'react';
import styled from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import {
  ButtonHandle,
  Button,
  Popover,
  TextField,
  usePopover,
  Paper,
  Box,
  commonComponentStyles,
  CreateNewFolderOutlinedIcon,
} from '@app/ui/components-library';
import { useCreateFolderInExplorer } from '@app/ui/cwd-segment-context';

type CreateFolderProps = {
  buttonHandleRef?: React.RefObject<ButtonHandle>;
  buttonEndIcon?: React.ReactNode;
};

export const CreateFolder: React.FC<CreateFolderProps> = ({ buttonHandleRef, buttonEndIcon }) => {
  const createFolderInExplorer = useCreateFolderInExplorer();

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

    await createFolderInExplorer(createFolderValue);
    popoverInstance.state.close();
  }

  return (
    <>
      <Button
        ref={buttonRef}
        handleRef={buttonHandleRef}
        startIcon={<CreateNewFolderOutlinedIcon />}
        endIcon={buttonEndIcon}
        enableLayoutAnimation
        onPress={() => popoverInstance.state.open()}
        ariaButtonProps={triggerProps}
      >
        New Folder
      </Button>

      <Popover popoverInstance={popoverInstance}>
        <Paper>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
          >
            <Card>
              <TextField
                placeholder="Name of folder"
                aria-label="Name of folder"
                value={createFolderValue}
                onChange={setCreateFolderValue}
              />

              <CardActions>
                <Button
                  variant={!inputIsValid ? undefined : 'contained'}
                  isDisabled={!inputIsValid}
                  /* cannot use type="submit" because of https://github.com/adobe/react-spectrum/issues/1593 */
                  onPress={handleSubmit}
                >
                  Create
                </Button>
              </CardActions>
            </Card>
          </form>
        </Paper>
      </Popover>
    </>
  );
};

const Card = styled(Box)`
  ${commonComponentStyles.card}
`;

const CardActions = styled(Box)`
  ${commonComponentStyles.actionsRow}
`;
