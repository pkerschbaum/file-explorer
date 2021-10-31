import { Box } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { arrays } from '@app/base/utils/arrays.util';
import { useProcesses } from '@app/global-state/slices/processes.hooks';
import { Process } from '@app/ui/process';

export const ProcessesArea: React.FC = () => {
  const processes = useProcesses();

  if (processes.length < 1) {
    return null;
  }

  return (
    <ProcessesAreaContainer>
      {arrays.reverse(processes).map((process) => (
        <Process key={process.id} process={process} />
      ))}
    </ProcessesAreaContainer>
  );
};

const ProcessesAreaContainer = styled(Box)`
  grid-area: shell-processes;

  display: flex;
  flex-direction: column-reverse;
  align-items: stretch;
  gap: ${(props) => props.theme.spacing()};
`;
