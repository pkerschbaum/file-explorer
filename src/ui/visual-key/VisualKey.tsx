import { Box } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

export const VisualKey: React.FC = ({ children }) => {
  return <VisualKeyContainer>{children}</VisualKeyContainer>;
};

const VisualKeyContainer = styled(Box)`
  height: 24px;
  width: 24px;
  padding-top: 4px;
  padding-left: 4px;

  display: flex;
  align-items: flex-start;

  color: black;
  background-color: lightgrey;
  border-bottom: 3px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  line-height: 1;

  && {
    font-size: 0.75rem;
  }
`;
