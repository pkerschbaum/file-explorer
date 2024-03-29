import { check } from '@pkerschbaum/commons-ecma/util/assert';
import * as React from 'react';
import { styled } from 'styled-components';

import { path } from '@file-explorer/code-oss-ecma/path';
import { URI } from '@file-explorer/code-oss-ecma/uri';

import { Box, Button, commonComponentStyles, TextField } from '#pkg/ui/components-library';
import { useResourcesOfDirectory } from '#pkg/ui/hooks/resources.hooks';

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
  const inputIsValidPath = check.isNonEmptyString(cwdValue) && path.isAbsolute(cwdValue);
  const { isLoading, error } = useResourcesOfDirectory(URI.file(cwdValue), {
    enabled: inputIsValidPath,
  });
  const resourcesForInputAreAvailable = !isLoading && !error;
  const inputIsValid = inputIsValidPath && resourcesForInputAreAvailable;

  React.useEffect(
    function resetValueOnPopoverClose() {
      if (!isOpen) {
        setCwdValue(initialCwdValue);
      }
    },
    [initialCwdValue, isOpen],
  );

  async function handleSubmit() {
    if (!inputIsValid) {
      return;
    }

    await onSubmit(cwdValue);
  }

  return (
    <form
      aria-label="Change Directory Form"
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
            isDisabled={!inputIsValid}
            /* cannot use type="submit" because of https://github.com/adobe/react-spectrum/issues/1593 */
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
