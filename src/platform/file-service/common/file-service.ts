import { IFileService } from 'code-oss-file-service/out/vs/platform/files/common/files';

export const FILESERVICE_RESOLVE_CHANNEL = 'fileService:resolve';
export const FILESERVICE_READFILE_CHANNEL = 'fileService:readFile';

export declare namespace FileServiceIpc {
  namespace Resolve {
    export type Args = Parameters<IFileService['resolve']>;
    export type ReturnValue = ReturnType<IFileService['resolve']>;
  }
  namespace ReadFile {
    export type Args = Parameters<IFileService['readFile']>;
    export type ReturnValue = ReturnType<IFileService['readFile']>;
  }
}

export type FileServiceIpcRenderer = {
  resolve: (...args: FileServiceIpc.Resolve.Args) => FileServiceIpc.Resolve.ReturnValue;
  readFile: (...args: FileServiceIpc.ReadFile.Args) => FileServiceIpc.ReadFile.ReturnValue;
};

export const CONTEXT_BRIDGE_KEY = 'fileService';
