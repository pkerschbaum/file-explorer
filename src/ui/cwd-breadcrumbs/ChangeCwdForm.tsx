import * as React from 'react';
import styled from 'styled-components';

import { check } from '@app/base/utils/assert.util';
import { Box, Button, commonComponentStyles, TextField } from '@app/ui/components-library';

type ChangeCwdFormProps = {
  isOpen: boolean;
  initialCwdValue: string;
  onSubmit: (folderName: string) => void | Promise<void>;
};

export const ChangeCwdForm: React.FC<ChangeCwdFormProps> = ({
  isOpen,
  initialCwdValue,
  onSubmit,
}) => {
  const [cwdValue, setCwdValue] = React.useState(initialCwdValue);

  React.useEffect(
    function resetValueOnPopoverClose() {
      if (!isOpen) {
        setCwdValue(initialCwdValue);
      }
    },
    [initialCwdValue, isOpen],
  );

  const inputIsValid = check.isNonEmptyString(cwdValue);

  async function handleSubmit() {
    if (!inputIsValid) {
      return;
    }

    await onSubmit(cwdValue);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      <Card>
        <TextField
          placeholder="Directory"
          aria-label="Directory"
          value={cwdValue}
          onChange={setCwdValue}
        />

        <CardActions>
          <Button
            variant={!inputIsValid ? undefined : 'contained'}
            type="submit"
            isDisabled={!inputIsValid}
            /* https://github.com/adobe/react-spectrum/issues/1593 */
            onPress={handleSubmit}
          >
            Change Directory
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

const Card = styled(Box)`
  ${commonComponentStyles.card}
`;

const CardActions = styled(Box)`
  ${commonComponentStyles.actionsRow}
`;
