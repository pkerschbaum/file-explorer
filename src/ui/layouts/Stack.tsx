import { Property } from 'csstype';
import * as React from 'react';
import styled, { css, FlattenInterpolation } from 'styled-components';

import { Box, BoxProps, useTheme } from '@app/ui/components-library';

type StackProps = {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: Property.JustifyContent;
  alignItems?: Property.AlignItems;
  wrap?: true | 'nowrap' | 'wrap-reverse';
  growItems?: boolean;
  shrinkItems?: boolean;
  itemsBasis?: Property.FlexBasis<string | 0>;
  spacing?: number;
  stretchContainer?: boolean;
  children: React.ReactNode;
  className?: string;
  sx?: BoxProps['sx'];
  boxProps?: BoxProps;
};

export const Stack = React.forwardRef<HTMLElement, StackProps>(function Stack(
  {
    direction = 'row',
    justifyContent,
    alignItems = 'center',
    wrap,
    growItems,
    shrinkItems,
    itemsBasis,
    spacing = 1,
    stretchContainer = false,
    children,
    boxProps,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const stackStyles = css`
    height: ${stretchContainer && (direction === 'row' || direction === 'row-reverse') && '100%'};
    width: ${stretchContainer &&
    (direction === 'column' || direction === 'column-reverse') &&
    '100%'};

    display: flex;
    flex-direction: ${direction};
    justify-content: ${justifyContent};
    align-items: ${alignItems};
    flex-wrap: ${typeof wrap === 'string' ? wrap : !!wrap ? 'wrap' : undefined};
    gap: ${theme.spacing(spacing)};

    & > * {
      flex-grow: ${growItems && 1};
      flex-shrink: ${shrinkItems && 1};
      flex-basis: ${itemsBasis};
    }
  `;

  return (
    <StyledBox
      stackStyles={stackStyles}
      ref={ref}
      /* we spread any additional props onto the box to support the Tooltip component
       * see https://material-ui.com/components/tooltips/#custom-child-element
       */
      {...rest}
      {...boxProps}
    >
      {children}
    </StyledBox>
  );
});

type StyleParams = {
  stackStyles: FlattenInterpolation<any>;
};

const StyledBox = styled(Box)<StyleParams>`
  ${(props) => props.stackStyles}
`;
