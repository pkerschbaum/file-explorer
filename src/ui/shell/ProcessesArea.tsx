import * as React from 'react';
import styled from 'styled-components';

import { arrays } from '@app/base/utils/arrays.util';
import { useProcesses } from '@app/global-state/slices/processes.hooks';
import { Box } from '@app/ui/components-library';
import { Process } from '@app/ui/process';
import { ROOTCONTAINER_PADDING_FACTOR } from '@app/ui/shell/constants';

export const ProcessesArea: React.FC = () => {
  const processes = useProcesses();

  if (processes.length < 1) {
    return null;
  }

  return (
    <ProcessesAreaContainer>
      {arrays.reverse(processes).map((process) => (
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
  gap: var(--spacing-2);
`;

const StyledProcess = styled(Process)`
  &:last-of-type {
    /* add margin-bottom to the last process card because otherwise, the last card would stick right 
       on the lower border of the RootContainer */
    margin-bottom: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
  }
`;
