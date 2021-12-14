import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled from 'styled-components';

type MuiIconComponent = typeof ContentCopyOutlinedIcon;
type MuiIconComponentProps = Parameters<MuiIconComponent>[0];

type IconProps = IconComponentProps & Pick<MuiIconComponentProps, 'className'>;

type IconComponentProps = {
  Component: MuiIconComponent;
  fontSize?: 'inherit' | 'small';
};

const IconBase: React.FC<IconProps> = (props) => {
  const {
    /* component props */
    Component,
    fontSize: _ignored,

    /* other props */
    ...delegatedProps
  } = props;

  return <Component {...delegatedProps} component={motion.svg} fontSize="inherit" />;
};

export const Icon = styled(IconBase)`
  font-size: ${({ fontSize }) => fontSize === 'small' && 'var(--icon-size-small)'};
`;
