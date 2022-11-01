// based on https://react-spectrum.adobe.com/react-aria/useRadioGroup.html#styling

import { useFocusRing } from '@react-aria/focus';
import { useRadio, useRadioGroup } from '@react-aria/radio';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { RadioGroupState, useRadioGroupState } from '@react-stately/radio';
import { AriaRadioProps, RadioGroupProps as ReactAriaRadioGroupProps } from '@react-types/radio';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { CircleIcon, CircleOutlinedIcon } from '@app/ui/components-library/icons';
import { createContext } from '@app/ui/utils/react.util';

const RadioGroupContext = createContext<RadioGroupState>('RadioGroupContext');
const useRadioGroupContext = RadioGroupContext.useContextValue;
const RadioGroupContextProvider = RadioGroupContext.Provider;

type RadioGroupProps = RadioGroupAriaProps &
  RadioGroupComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>,
    keyof RadioGroupAriaProps | keyof RadioGroupComponentProps
  >;

type RadioGroupAriaProps = Pick<ReactAriaRadioGroupProps, 'label' | 'value' | 'onChange'>;

type RadioGroupComponentProps = {
  children: React.ReactNode;
};

export const RadioGroup = styled(
  React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroupWithRef(props, ref) {
    const {
      /* react-aria props */
      label,
      value,
      onChange,

      /* component props */
      children,

      /* other props */
      ...delegatedProps
    } = props;
    const reactAriaProps: ReactAriaRadioGroupProps = {
      label,
      value,
      onChange,
    };

    const state = useRadioGroupState(reactAriaProps);
    const { radioGroupProps, labelProps } = useRadioGroup(reactAriaProps, state);

    return (
      <RadioGroupRoot ref={ref} {...mergeProps(delegatedProps, radioGroupProps)}>
        <RadioGroupLabel {...labelProps}>{label}</RadioGroupLabel>
        <RadioGroupContextProvider value={state}>{children}</RadioGroupContextProvider>
      </RadioGroupRoot>
    );
  }),
)``;

const RadioGroupRoot = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

const RadioGroupLabel = styled(Box)`
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
`;

type RadioProps = RadioAriaProps &
  Omit<React.ComponentPropsWithoutRef<'label'>, keyof RadioAriaProps>;

type RadioAriaProps = Pick<AriaRadioProps, 'value' | 'children'>;

export const Radio = styled((props: RadioProps) => {
  const {
    /* react-aria props */
    value,
    children,

    /* other props */
    ...delegatedProps
  } = props;
  const reactAriaProps: AriaRadioProps = {
    value,
    children,
  };

  const state = useRadioGroupContext();
  const nativeInputRef = React.useRef<HTMLInputElement>(null);
  const { inputProps } = useRadio(reactAriaProps, state, nativeInputRef);
  const { isFocusVisible, focusProps } = useFocusRing();

  const isSelected = state.selectedValue === value;

  return (
    <RadioRoot {...delegatedProps}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={nativeInputRef} />
      </VisuallyHidden>
      <OverlayedIconsContainer>
        {isSelected ? <StyledCircleIcon /> : <StyledCircleOutlinedIcon />}
        {isFocusVisible && <StyledCircleOutlinedIconFocused />}
      </OverlayedIconsContainer>
      {children}
    </RadioRoot>
  );
})``;

const RadioRoot = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
`;

const OverlayedIconsContainer = styled(Box)`
  --spacing-for-focused-icon: 5px;
  pointer-events: none;
  position: relative;
  height: calc(1em + 2 * var(--spacing-for-focused-icon));
  width: calc(1em + 2 * var(--spacing-for-focused-icon));
`;

const iconStyles = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
`;

const StyledCircleIcon = styled(CircleIcon)`
  ${iconStyles}
`;

const StyledCircleOutlinedIcon = styled(CircleOutlinedIcon)`
  ${iconStyles}
`;

const StyledCircleOutlinedIconFocused = styled(StyledCircleOutlinedIcon)`
  font-size: calc(1em + 2 * var(--spacing-for-focused-icon));
  top: calc(-1 * var(--spacing-for-focused-icon));
  right: calc(-1 * var(--spacing-for-focused-icon));
  bottom: calc(-1 * var(--spacing-for-focused-icon));
  left: calc(-1 * var(--spacing-for-focused-icon));
`;
