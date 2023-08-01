import { motion } from 'framer-motion';
import type * as React from 'react';
import styled from 'styled-components';

import type { ReactMotionProps } from '#pkg/ui/components-library/utils';

export type BoxProps = ReactMotionProps<'div', HTMLDivElement>;
export const Box = styled(motion.div)`` as React.FC<BoxProps>;
