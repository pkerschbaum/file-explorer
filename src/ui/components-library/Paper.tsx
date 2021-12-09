import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

type PaperProps = Pick<React.HTMLProps<HTMLDivElement>, 'className' | 'aria-label'> & {
  children: React.ReactNode;
};

const PaperBase: React.FC<PaperProps> = (props) => {
  const {
    /* component props */
    children,

    /* html props */
    ...htmlProps
  } = props;

  return <Box {...htmlProps}>{children}</Box>;
};

export const Paper = styled(PaperBase)`
  border-radius: var(--border-radius-2);
  background-color: var(--color-bg-1);
  box-shadow: var(--shadow-elevation-low);
`;
