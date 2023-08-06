import type { AriaTextFieldOptions } from '@react-aria/textfield';
import { useTextField } from '@react-aria/textfield';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import * as React from 'react';
import { styled } from 'styled-components';

import { Box } from '#pkg/ui/components-library/Box';
import type { DataAttributes } from '#pkg/ui/components-library/utils';

type TextFieldProps = TextFieldAriaProps &
  TextFieldComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>,
    keyof TextFieldAriaProps | keyof TextFieldComponentProps
  >;

type TextFieldAriaProps = Pick<
  AriaTextFieldOptions<'input'>,
  'label' | 'aria-label' | 'placeholder' | 'value' | 'onChange' | 'autoFocus' | 'onKeyDown'
>;

type TextFieldComponentProps = {
  inputRef?: React.RefObject<HTMLInputElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> & DataAttributes;
};

export const TextField = styled(
  React.forwardRef<HTMLDivElement, TextFieldProps>(function TextFieldWithRef(props, ref) {
    const {
      /* react-aria props */
      label,
      'aria-label': ariaLabel,
      placeholder,
      value,
      onChange,
      autoFocus,
      onKeyDown,

      /* component props */
      inputRef: componentInputRef,
      inputProps: componentInputProps = {},

      /* other props */
      ...delegatedProps
    } = props;
    const reactAriaProps: AriaTextFieldOptions<'input'> = {
      label,
      'aria-label': ariaLabel,
      placeholder,
      value,
      onChange,
      autoFocus,
      onKeyDown,
    };

    const inputRef = useObjectRef(componentInputRef);
    const { labelProps, inputProps } = useTextField(reactAriaProps, inputRef);

    return (
      <TextFieldRoot ref={ref} {...delegatedProps}>
        {label && <TextFieldLabel {...labelProps}>{label}</TextFieldLabel>}
        <TextFieldInput
          {...mergeProps({ spellCheck: false }, componentInputProps, inputProps)}
          ref={inputRef}
        />
      </TextFieldRoot>
    );
  }),
)``;

const TextFieldRoot = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const TextFieldLabel = styled.label`
  margin-bottom: var(--spacing-1);
`;

const TextFieldInput = styled.input`
  --border-bottom-width-default: 1px;
  --border-bottom-width-focus: 3px;
  --border-bottom-width-difference: calc(
    var(--border-bottom-width-focus) - var(--border-bottom-width-default)
  );
  --bg-color-default: var(--color-bg-1);
  padding: var(--padding-button-md-block) var(--padding-button-md-inline);
  margin-block: auto;

  color: var(--color-fg-0);
  background-color: var(--bg-color-default);
  border: 1px solid var(--bg-color-default);
  border-bottom: var(--border-bottom-width-default) solid var(--color-fg-0);
  border-radius: 4px;
  outline: none;

  &:focus {
    /* 
      When the input is focused, border-bottom of the input will gain some width.
      To avoid a layout shift when that happens, reduce the padding-bottom by the same amount.
    */
    padding-bottom: calc(var(--padding-button-md-block) - var(--border-bottom-width-difference));
    border-bottom: var(--border-bottom-width-focus) solid var(--color-primary-main);
    background-color: var(--color-bg-0-dark);
  }

  &::placeholder {
    color: var(--color-fg-0-dark);
  }

  &:hover:not(:focus) {
    background-color: var(--color-bg-2);
  }
`;
