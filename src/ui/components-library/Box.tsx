import { ForwardRefComponent, motion } from 'framer-motion';
import * as React from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export type BoxProps = React.HTMLAttributes<HTMLDivElement>;
export const Box: StyledComponent<
  ForwardRefComponent<HTMLDivElement, BoxProps>,
  DefaultTheme
> = styled(motion.div)``;
