import { useSelector } from '@app/global-state/store';
import { PASTE_PROCESS_STATUS, PROCESS_TYPE } from '@app/domain/types';

export const useDraftPasteState = () =>
  useSelector((state) => state.processesSlice.draftPasteState);

export const useProcesses = () =>
  useSelector((state) => state.processesSlice.processes).map((process) => {
    if (process.type === PROCESS_TYPE.PASTE) {
      return {
        ...process,
        bytesProcessed:
          process.status === PASTE_PROCESS_STATUS.SUCCESS
            ? process.totalSize
            : process.bytesProcessed,
      };
    }

    return process;
  });
