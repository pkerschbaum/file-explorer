import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { check } from '@app/base/utils/assert.util';
import { TextField } from '@app/ui/components-library';
import {
  useFilterInput,
  useSetFilterInput,
  useRegisterCwdSegmentShortcuts,
} from '@app/ui/cwd-segment-context';
import {
  DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED,
  ShortcutPriority,
} from '@app/ui/GlobalShortcutsContext';
import { useDebouncedValue } from '@app/ui/utils/react.util';

export const FilterInput = styled(
  (delegatedProps: Pick<React.ComponentPropsWithoutRef<'div'>, 'className'>) => {
    const filterInputRef = React.useRef<HTMLInputElement>(null);

    useRegisterCwdSegmentShortcuts({
      focusFilterInputShortcut: {
        priority: ShortcutPriority.LOW,
        condition: (e) => !e.altKey && !e.ctrlKey && !e.shiftKey,
        handler: () => {
          invariant(filterInputRef.current);
          filterInputRef.current.focus();
        },
        disablePreventDefault: true,
      },
    });

    const filterInput = useFilterInput();
    const setFilterInput = useSetFilterInput();
    const [localFilterInput, setLocalFilterInput] = React.useState(filterInput);

    const debouncedFilterInput = useDebouncedValue(localFilterInput, 100);
    React.useEffect(
      function syncFilterInputAfterDebounce() {
        setFilterInput(debouncedFilterInput);
      },
      [debouncedFilterInput, setFilterInput],
    );

    return (
      <TextField
        inputRef={filterInputRef}
        inputProps={DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.datasetAttr}
        placeholder="Filter"
        aria-label="Filter"
        autoFocus={check.isNonEmptyString(localFilterInput)}
        value={localFilterInput}
        onChange={(newValue) => {
          const trimmedValue = newValue.trimStart();
          setLocalFilterInput(trimmedValue);

          // if input is empty now, blur the input field
          if (trimmedValue === '' && filterInputRef.current !== null) {
            filterInputRef.current.blur();
          }
        }}
        {...delegatedProps}
      />
    );
  },
)``;
