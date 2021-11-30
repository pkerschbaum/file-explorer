import { Box } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

type VisualKeyProps = {
  children: React.ReactNode;
  type?: 'char' | 'icon';
};

export const VisualKey: React.FC<VisualKeyProps> = ({ children, type = 'char' }) => {
  return <VisualKeyContainer type={type}>{children}</VisualKeyContainer>;
};

const VisualKeyContainer = styled(Box)<{ type: 'char' | 'icon' }>`
  height: 24px;
  width: 24px;

  display: flex;
  justify-content: ${(props) => (props.type === 'char' ? 'flex-start' : 'center')};
  align-items: ${(props) => (props.type === 'char' ? 'flex-start' : 'center')};
  padding-top: ${(props) => (props.type === 'char' ? '2px' : '3px')};
  padding-left: ${(props) => (props.type === 'char' ? '4px' : undefined)};
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  color: black;
  background-color: lightgrey;
  font-size: ${({ theme }) => theme.font.sizes.md};
  line-height: 1;
`;
