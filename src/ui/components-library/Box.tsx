import { ForwardRefComponent, motion, MotionProps } from 'framer-motion';
import * as React from 'react';
import styled, { DefaultTheme, StyledComponent } from 'styled-components';

export type BoxProps = React.ComponentProps<'div'> & Pick<MotionProps, 'layout' | 'layoutId'>;
export const Box = styled(motion.div)`` as StyledComponent<
  ForwardRefComponent<HTMLDivElement, BoxProps>,
  DefaultTheme
>;
