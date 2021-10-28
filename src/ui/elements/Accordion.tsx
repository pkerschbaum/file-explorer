import { Accordion } from '@mui/material';

import styled from 'styled-components';

export const RoundedAccordion = styled(Accordion)`
  border-radius: ${(props) => props.theme.shape.borderRadius}px;

  &:first-of-type,
  &:last-of-type {
    border-radius: ${(props) => props.theme.shape.borderRadius}px;
  }
`;
