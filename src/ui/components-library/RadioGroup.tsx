// based on https://react-spectrum.adobe.com/react-aria/useRadioGroup.html#styling
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { useFocusRing } from '@react-aria/focus';
import { useRadio, useRadioGroup } from '@react-aria/radio';
import { mergeProps } from '@react-aria/utils';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { RadioGroupState, useRadioGroupState } from '@react-stately/radio';
import { AriaRadioProps, RadioGroupProps as ReactAriaRadioGroupProps } from '@react-types/radio';
import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { Icon } from '@app/ui/components-library/Icon';
import { createContext } from '@app/ui/utils/react.util';

const RadioGroupContext = createContext<RadioGroupState>('RadioGroupContext');
const useRadioGroupContext = RadioGroupContext.useContextValue;
const RadioGroupContextProvider = RadioGroupContext.Provider;

type RadioGroupProps = Pick<ReactAriaRadioGroupProps, 'label' | 'value' | 'onChange'> &
  Pick<React.HTMLProps<HTMLDivElement>, 'className'> & {
    children: React.ReactNode;
  };

const RadioGroupBase = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroupBaseWithRef(props, ref) {
    const {
      /* react-aria props */
      label,
      value,
      onChange,

      /* component props */
      children,

      /* html props */
      ...htmlProps
    } = props;
    const reactAriaProps: ReactAriaRadioGroupProps = {
      label,
      value,
      onChange,
    };

    const state = useRadioGroupState(reactAriaProps);
    const { radioGroupProps, labelProps } = useRadioGroup(reactAriaProps, state);

    return (
      <RadioGroupContainer ref={ref} {...mergeProps(htmlProps, radioGroupProps)}>
        <RadioGroupLabel {...labelProps}>{label}</RadioGroupLabel>
        <RadioGroupContextProvider value={state}>{children}</RadioGroupContextProvider>
      </RadioGroupContainer>
    );
  },
);

export const RadioGroup = styled(RadioGroupBase)``;

const RadioGroupContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

const RadioGroupLabel = styled(Box)`
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
`;

type RadioProps = Pick<AriaRadioProps, 'value' | 'children'> &
  Pick<React.HTMLProps<HTMLInputElement>, 'className'>;

function RadioBase(props: RadioProps) {
  const {
    /* react-aria props */
    value,
    children,

    /* html props */
    ...htmlProps
  } = props;
  const reactAriaProps: AriaRadioProps = { value, children };

  const state = useRadioGroupContext();
  const nativeInputRef = React.useRef<HTMLInputElement>(null);
  const { inputProps } = useRadio(reactAriaProps, state, nativeInputRef);
  const { isFocusVisible, focusProps } = useFocusRing();

  const isSelected = state.selectedValue === value;

  return (
    <RadioContainer {...htmlProps}>
      <VisuallyHidden>
        <input {...inputProps} {...focusProps} ref={nativeInputRef} />
      </VisuallyHidden>
      <OverlayedIconsContainer>
        {isSelected ? (
          <StyledIcon Component={CircleIcon} />
        ) : (
          <StyledIcon Component={CircleOutlinedIcon} />
        )}
        {isFocusVisible && <StyledIconFocused Component={CircleOutlinedIcon} />}
      </OverlayedIconsContainer>
      {children}
    </RadioContainer>
  );
}

export const Radio = styled(RadioBase)``;

const RadioContainer = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
`;

const OverlayedIconsContainer = styled(Box)`
  --spacing-for-focused-icon: 5px;
  position: relative;
  height: calc(1em + 2 * var(--spacing-for-focused-icon));
  width: calc(1em + 2 * var(--spacing-for-focused-icon));
`;

const StyledIcon = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
`;

const StyledIconFocused = styled(StyledIcon)`
  font-size: calc(1em + 2 * var(--spacing-for-focused-icon));
  top: calc(-1 * var(--spacing-for-focused-icon));
  right: calc(-1 * var(--spacing-for-focused-icon));
  bottom: calc(-1 * var(--spacing-for-focused-icon));
  left: calc(-1 * var(--spacing-for-focused-icon));
`;
