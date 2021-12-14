import { motion, MotionProps } from 'framer-motion';
import * as React from 'react';
import styled from 'styled-components';

export type BoxProps = React.ComponentPropsWithoutRef<'div'> &
  React.RefAttributes<HTMLDivElement> &
  Pick<MotionProps, 'layout' | 'layoutId'>;
export const Box = styled(motion.div)`` as React.FC<BoxProps>;
