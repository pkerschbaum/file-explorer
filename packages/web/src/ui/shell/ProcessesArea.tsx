import type * as React from 'react';
import styled from 'styled-components';

import { arrays } from '@file-explorer/commons-ecma/util/arrays.util';

import { useProcesses } from '#pkg/global-state/slices/processes.hooks';
import { Box } from '#pkg/ui/components-library';
import { Process } from '#pkg/ui/process';
import { ROOTCONTAINER_PADDING_FACTOR } from '#pkg/ui/shell/constants';

export const ProcessesArea: React.FC = () => {
  const processes = useProcesses();

  if (processes.length === 0) {
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

  overflow-y: auto;
`;

const StyledProcess = styled(Process)`
  &:last-of-type {
    /* add margin-bottom to the last process card because otherwise, the last card would stick right 
       on the lower border of the RootContainer */
    margin-bottom: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
  }
`;
