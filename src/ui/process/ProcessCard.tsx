import * as React from 'react';
import { Paper, useTheme } from '@mui/material';
import styled from 'styled-components';

import { Process, PROCESS_TYPE } from '@app/domain/types';
import { PasteProcess } from '@app/ui/process/PasteProcess';
import { DeleteProcess } from '@app/ui/process/DeleteProcess';
import { assertUnreachable } from '@app/base/utils/types.util';

export const ProcessCard: React.FC<{ process: Process }> = ({ process }) => {
  const { processStatusColors } = useTheme();

  let backgroundColor;
  switch (process.type) {
    case PROCESS_TYPE.PASTE: {
      backgroundColor = processStatusColors.pasteProcess[process.status];
      break;
    }
    case PROCESS_TYPE.DELETE: {
      backgroundColor = processStatusColors.deleteProcess[process.status];
      break;
    }
    default:
      assertUnreachable(process);
  }

  return (
    <Card sx={{ backgroundColor }}>
      {process.type === PROCESS_TYPE.PASTE ? (
        <PasteProcess process={process} />
      ) : process.type === PROCESS_TYPE.DELETE ? (
        <DeleteProcess process={process} />
      ) : (
        assertUnreachable(process)
      )}
    </Card>
  );
};

const Card = styled(Paper)`
  padding-top: ${(props) => props.theme.spacing()};
  padding-bottom: ${(props) => props.theme.spacing()};
  padding-right: ${(props) => props.theme.spacing(1.5)};
  padding-left: ${(props) => props.theme.spacing(1.5)};
`;
