import { Box } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { useProcesses } from '@app/global-state/slices/processes.hooks';
import { Process } from '@app/ui/process';
import { ROOTCONTAINER_PADDING_BOTTOM_FACTOR } from '@app/ui/shell/constants';

export const ProcessesArea: React.FC = () => {
  const processes = useProcesses();

  if (processes.length < 1) {
    return null;
  }

  return (
    <ProcessesAreaContainer>
      {processes.map((process) => (
        <StyledProcess key={process.id} process={process} />
      ))}
    </ProcessesAreaContainer>
  );
};

const ProcessesAreaContainer = styled(Box)`
  grid-area: shell-processes;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${(props) => props.theme.spacing()};
`;

const StyledProcess = styled(Process)`
  &:last-of-type {
    /* add margin-bottom to the last process card because otherwise, the last card would stick right 
       on the lower border of the RootContainer */
    margin-bottom: ${(props) => props.theme.spacing(ROOTCONTAINER_PADDING_BOTTOM_FACTOR)};
  }
`;
