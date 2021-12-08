import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { motion } from 'framer-motion';
import * as React from 'react';

type IconProps = {
  Component: typeof ContentCopyOutlinedIcon;
  fontSize?: 'inherit' | 'small';
};

export const Icon: React.FC<IconProps> = ({ Component, fontSize }) => {
  return (
    <Component
      component={motion.svg}
      style={{ fontSize: fontSize === 'small' ? 'var(--icon-size-small)' : 'inherit' }}
    />
  );
};
