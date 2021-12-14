import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type PaperProps = PaperComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>,
    keyof PaperComponentProps
  >;

type PaperComponentProps = {
  children: React.ReactNode;
};

const PaperBase = React.forwardRef<HTMLDivElement, PaperProps>(function PaperBaseWithRef(
  props,
  ref,
) {
  const {
    /* component props */
    children,

    /* other props */
    ...delegatedProps
  } = props;

  return (
    <Box {...delegatedProps} ref={ref}>
      {children}
    </Box>
  );
});

export const Paper = styled(PaperBase)`
  border-radius: var(--border-radius-2);
  background-color: var(--color-bg-1);
  box-shadow: var(--shadow-elevation-low);
`;
