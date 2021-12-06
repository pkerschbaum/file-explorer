import { SeparatorProps, useSeparator } from '@react-aria/separator';
import * as React from 'react';
import styled from 'styled-components';

import { Box, BoxProps } from '@app/ui/components-library/Box';

type DividerProps = SeparatorProps;

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function DividerForwardRef(
  props,
  ref,
) {
  const { separatorProps } = useSeparator(props);
  return <DividerContainer ref={ref} componentProps={props} {...(separatorProps as BoxProps)} />;
});

const DividerContainer = styled(Box)<{ componentProps: DividerProps }>`
  border-top: 0;
  border-left: 0;
  border-right: ${({ componentProps }) => componentProps.orientation === 'vertical' && 'thin'};
  border-bottom: ${({ componentProps }) => componentProps.orientation !== 'vertical' && 'thin'};
  border-color: rgba(255, 255, 255, 0.23);
  border-style: solid;
  width: ${({ componentProps }) => componentProps.orientation !== 'vertical' && 'auto'};
  height: ${({ componentProps }) => componentProps.orientation === 'vertical' && 'auto'};
`;
