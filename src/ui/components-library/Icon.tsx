import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled from 'styled-components';

type IconComponent = typeof ContentCopyOutlinedIcon;
type IconComponentProps = Parameters<IconComponent>[0];
type IconProps = Pick<IconComponentProps, 'className'> & {
  Component: IconComponent;
  fontSize?: 'inherit' | 'small';
};

const IconBase: React.FC<IconProps> = (props) => {
  const {
    Component,
    fontSize: _ignored,

    /* html props */
    ...htmlProps
  } = props;

  return <Component {...htmlProps} component={motion.svg} fontSize="inherit" />;
};

export const Icon = styled(IconBase)`
  font-size: ${({ fontSize }) => fontSize === 'small' && 'var(--icon-size-small)'};
`;
