import type { AppProcess } from '#pkg/domain/types';
import { PASTE_PROCESS_STATUS, PROCESS_TYPE } from '#pkg/domain/types';
import { useSelector } from '#pkg/global-state/store';

export const useDraftPasteState = () =>
  useSelector((state) => state.processesSlice.draftPasteState);

export const useProcesses = () =>
  useSelector((state) => state.processesSlice.processes).map(mapProcess);

export function mapProcess(process: AppProcess) {
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
