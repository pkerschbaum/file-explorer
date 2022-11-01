import type * as React from 'react';

import { assertIsUnreachable } from '@app/base/utils/assert.util';
import type { AppProcess } from '@app/domain/types';
import { PROCESS_TYPE } from '@app/domain/types';
import { removeProcess } from '@app/operations/resource.operations';
import { computeProcessCardPropsFromDeleteProcess } from '@app/ui/process/process-variant-delete';
import { computeProcessCardPropsFromPasteProcess } from '@app/ui/process/process-variant-paste';
import type { ProcessCardProps } from '@app/ui/process/ProcessCard';
import { ProcessCard } from '@app/ui/process/ProcessCard';

export type ProcessVariantProps = Omit<ProcessCardProps, 'className' | 'onRemove'>;

type ProcessProps = {
  process: AppProcess;
  className?: string;
};

export const Process: React.FC<ProcessProps> = ({ process, className }) => {
  let processVariantProps: ProcessVariantProps;
  if (process.type === PROCESS_TYPE.PASTE) {
    processVariantProps = computeProcessCardPropsFromPasteProcess(process);
  } else if (process.type === PROCESS_TYPE.DELETE) {
    processVariantProps = computeProcessCardPropsFromDeleteProcess(process);
  } else {
    assertIsUnreachable(process);
  }

  return (
    <ProcessCard
      className={className}
      onRemove={() => removeProcess(process.id)}
      {...processVariantProps}
    />
  );
};
