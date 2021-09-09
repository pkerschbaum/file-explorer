import { FileServiceResolveArgs, FileServiceResolveReturnValue } from '../common/file-service';

declare global {
  interface Window {
    fileService: {
      resolve: (...args: FileServiceResolveArgs) => FileServiceResolveReturnValue;
    };
  }
}
