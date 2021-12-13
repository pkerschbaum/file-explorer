import * as React from 'react';

import { check } from '@app/base/utils/assert.util';
import { Button, Card, TextField } from '@app/ui/components-library';

type ChangeCwdFormProps = {
  initialCwdValue: string;
  onSubmit: (folderName: string) => void | Promise<void>;
};

export const ChangeCwdForm: React.FC<ChangeCwdFormProps> = ({ initialCwdValue, onSubmit }) => {
  const [cwdValue, setCwdValue] = React.useState(initialCwdValue);

  async function handleSubmit() {
    if (check.isEmptyString(cwdValue)) {
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
      <Card
        content={
          <TextField
            autoFocus
            placeholder="Directory"
            aria-label="Directory"
            value={cwdValue}
            onChange={setCwdValue}
          />
        }
        actions={
          <Button
            variant={check.isEmptyString(cwdValue) ? undefined : 'contained'}
            type="submit"
            isDisabled={check.isEmptyString(cwdValue)}
          >
            Change Directory
          </Button>
        }
      />
    </form>
  );
};
