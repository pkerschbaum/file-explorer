import { motion } from 'framer-motion';
import * as React from 'react';
import styled from 'styled-components';

import { ReactMotionProps } from '@app/ui/components-library/utils';

export type BoxProps = ReactMotionProps<'div', HTMLDivElement>;
export const Box = styled(motion.div)`` as React.FC<BoxProps>;
