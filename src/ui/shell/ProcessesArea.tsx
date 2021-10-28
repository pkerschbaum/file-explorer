import * as React from 'react';
import styled from 'styled-components';

import { arrays } from '@app/base/utils/arrays.util';
import { useProcesses } from '@app/global-state/slices/processes.hooks';
import { Stack } from '@app/ui/layouts/Stack';
import { ProcessCard } from '@app/ui/process';
import { ROOTCONTAINER_PADDING_RIGHT_FACTOR } from '@app/ui/shell/constants';

export const ProcessesArea: React.FC = () => {
  const processes = useProcesses();

  if (processes.length < 1) {
    return null;
  }

  return (
    <ProcessesAreaContainer spacing={2} alignItems="flex-start">
      {arrays.reverse(processes).map((process) => (
        <ProcessCard key={process.id} process={process} />
      ))}
    </ProcessesAreaContainer>
  );
};

const ProcessesAreaContainer = styled(Stack)`
  /* revert padding on the right side introduced by the Shell RootContainer */
  margin-right: ${(props) => props.theme.spacing(-ROOTCONTAINER_PADDING_RIGHT_FACTOR)};

  padding-bottom: ${(props) => props.theme.spacing()};
  grid-area: shell-processes;
  overflow-x: auto;

  & > *:first-of-type {
    margin-left: ${(props) => props.theme.spacing()};
  }
  & > *:last-of-type {
    margin-right: ${(props) => props.theme.spacing()};
  }

  & > * {
    flex-shrink: 0;
  }
`;
