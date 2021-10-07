import { FileServiceIPC } from '@app/platform/file-service/common/file-service';

declare global {
  interface Window {
    fileService: {
      resolve: (...args: FileServiceIPC.Resolve.Args) => FileServiceIPC.Resolve.ReturnValue;
    };
  }
}
