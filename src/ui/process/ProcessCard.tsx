import * as React from 'react';

import { assertThat } from '@app/base/utils/assert.util';
import { Process, PROCESS_TYPE } from '@app/domain/types';
import { DeleteProcess } from '@app/ui/process/DeleteProcess';
import { PasteProcess } from '@app/ui/process/PasteProcess';

type ProcessCardProps = { process: Process };

export const ProcessCard: React.FC<ProcessCardProps> = ({ process }) => {
  return (
    <>
      {process.type === PROCESS_TYPE.PASTE ? (
        <PasteProcess process={process} />
      ) : process.type === PROCESS_TYPE.DELETE ? (
        <DeleteProcess process={process} />
      ) : (
        assertThat.isUnreachable(process)
      )}
    </>
  );
};
