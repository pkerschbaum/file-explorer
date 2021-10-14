import { PASTE_PROCESS_STATUS, Process, PROCESS_TYPE } from '@app/domain/types';
import { useSelector } from '@app/global-state/store';

export const useDraftPasteState = () =>
  useSelector((state) => state.processesSlice.draftPasteState);

export const useProcesses = () =>
  useSelector((state) => state.processesSlice.processes).map(mapProcess);

export function mapProcess(process: Process) {
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
}
