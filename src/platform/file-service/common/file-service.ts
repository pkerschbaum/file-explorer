import { IFileService } from 'code-oss-file-service/out/vs/platform/files/common/files';

export type FileServiceResolveArgs = Parameters<IFileService['resolve']>;
export type FileServiceResolveReturnValue = ReturnType<IFileService['resolve']>;
export const FILESERVICE_RESOLVE_CHANNEL = 'fileService:resolve';
