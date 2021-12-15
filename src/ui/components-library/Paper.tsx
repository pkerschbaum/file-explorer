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

export const Paper = styled(
  React.forwardRef<HTMLDivElement, PaperProps>(function PaperWithRef(props, ref) {
    const {
      /* component props */
      children,

      /* other props */
      ...delegatedProps
    } = props;

    return (
      <PaperRoot {...delegatedProps} ref={ref}>
        {children}
      </PaperRoot>
    );
  }),
)``;

const PaperRoot = styled(Box)`
  border-radius: var(--border-radius-2);
  background-color: var(--color-bg-1);
  box-shadow: var(--shadow-elevation-low);
`;
