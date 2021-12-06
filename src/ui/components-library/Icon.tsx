import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { motion } from 'framer-motion';
import * as React from 'react';

type IconProps = {
  Component: typeof ContentCopyOutlinedIcon;
};

export const Icon: React.FC<IconProps> = ({ Component }) => {
  return <Component component={motion.svg} fontSize="inherit" />;
};
