import { config } from '@app/config';

export declare namespace IpcFileDragStart {
  export type Args = { fsPaths: string[] };
  export type ReturnValue = void;
}
export const FILEDRAGSTART_CHANNEL = `${config.productName}:fileDragStart`;