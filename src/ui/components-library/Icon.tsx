import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { motion } from 'framer-motion';
import * as React from 'react';

type IconProps = {
  Component: typeof ContentCopyOutlinedIcon;
  fontSize?: 'inherit' | 'small';
};

export const Icon: React.FC<IconProps> = ({ Component, fontSize = 'inherit' }) => {
  return <Component component={motion.svg} fontSize={fontSize} />;
};
