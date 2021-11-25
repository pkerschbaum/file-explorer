import * as React from 'react';

import { assertThat } from '@app/base/utils/assert.util';
import { AppProcess, PROCESS_TYPE } from '@app/domain/types';
import { DeleteProcess } from '@app/ui/process/DeleteProcess';
import { PasteProcess } from '@app/ui/process/PasteProcess';

type ProcessProps = {
  process: AppProcess;
  className?: string;
};

export const Process: React.FC<ProcessProps> = ({ process, className }) => {
  return (
    <>
      {process.type === PROCESS_TYPE.PASTE ? (
        <PasteProcess process={process} className={className} />
      ) : process.type === PROCESS_TYPE.DELETE ? (
        <DeleteProcess process={process} className={className} />
      ) : (
        assertThat.isUnreachable(process)
      )}
    </>
  );
};
