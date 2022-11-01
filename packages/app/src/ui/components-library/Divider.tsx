import { SeparatorProps, useSeparator } from '@react-aria/separator';
import { mergeProps } from '@react-aria/utils';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type DividerProps = DividerAriaProps &
  Omit<
    React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>,
    keyof DividerAriaProps
  >;

type DividerAriaProps = Pick<SeparatorProps, 'orientation'>;

export const Divider = styled(
  React.forwardRef<HTMLDivElement, DividerProps>(function DividerForwardRef(props, ref) {
    const {
      /* react-aria props */
      orientation,

      /* other props */
      ...delegatedProps
    } = props;
    const reactAriaProps: SeparatorProps = {
      orientation,
    };

    const { separatorProps } = useSeparator(reactAriaProps);
    return (
      <DividerRoot ref={ref} {...mergeProps(delegatedProps, separatorProps)} styleProps={props} />
    );
  }),
)``;

type StyleProps = DividerProps;

const DividerRoot = styled(Box)<{ styleProps: StyleProps }>`
  border-top-width: 0;
  border-left-width: 0;
  border-color: var(--color-darken-1);
  border-style: solid;
  ${({ styleProps }) => {
    if (styleProps.orientation === 'vertical') {
      return css`
        border-bottom-width: 0;
        border-right-width: var(--border-width-1);
        height: auto;
      `;
    } else {
      return css`
        border-bottom-width: var(--border-width-1);
        border-right-width: 0;
        width: auto;
      `;
    }
  }};
`;
