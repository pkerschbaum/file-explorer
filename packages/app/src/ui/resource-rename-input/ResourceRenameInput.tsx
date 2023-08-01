import type { KeyboardEvent } from '@react-types/shared';
import * as React from 'react';
import styled from 'styled-components';

import { extpath } from '#pkg/base/extpath';
import { check } from '#pkg/base/utils/assert.util';
import type { ResourceForUI } from '#pkg/domain/types';
import { commonStyles } from '#pkg/ui/common-styles';
import { Button, FocusScope, TextField } from '#pkg/ui/components-library';
import { doesKeyboardEventKeyMatchPrintedKey, PRINTED_KEY } from '#pkg/ui/constants';

type ResourceRenameInputProps = {
  resource: ResourceForUI;
  onSubmit: (newName: string) => void;
  abortRename: () => void;
  className?: string;
};

export const ResourceRenameInput: React.FC<ResourceRenameInputProps> = ({
  resource,
  onSubmit,
  abortRename,
  className,
}) => {
  const [value, setValue] = React.useState(resource.basename);

  const inputIsValid = check.isNonEmptyString(value) && extpath.isValidBasename(value);

  function handleSubmit() {
    if (!inputIsValid) {
      return;
    }

    onSubmit(value);
  }

  function abortOnEsc(e: KeyboardEvent) {
    if (
      doesKeyboardEventKeyMatchPrintedKey({ printedKey: PRINTED_KEY.ESC, keyboardEventKey: e.key })
    ) {
      abortRename();
    }
  }

  return (
    <FocusScope contain autoFocus restoreFocus>
      <RenameInputForm
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          aria-label="new name for resource"
          value={value}
          onChange={setValue}
          onKeyDown={abortOnEsc}
        />
        <Button
          buttonSize="sm"
          isDisabled={!inputIsValid}
          /* cannot use type="submit" because of https://github.com/adobe/react-spectrum/issues/1593 */
          onPress={handleSubmit}
          onKeyDown={abortOnEsc}
        >
          OK
        </Button>
        <Button buttonSize="sm" onPress={abortRename} onKeyDown={abortOnEsc}>
          Abort
        </Button>
      </RenameInputForm>
    </FocusScope>
  );
};

const RenameInputForm = styled.form`
  width: 100%;
  flex-grow: 1;

  display: flex;
  align-items: stretch;
  gap: var(--spacing-2);

  & > ${TextField} {
    ${commonStyles.layout.flex.shrinkAndFitHorizontal}
  }

  & > ${Button} {
    margin-block: var(--padding-button-md-block);
  }
`;
