import {
  FileServiceResolveArgs,
  FileServiceResolveReturnValue,
} from '@app/platform/file-service/common/file-service';

declare global {
  interface Window {
    fileService: {
      resolve: (...args: FileServiceResolveArgs) => FileServiceResolveReturnValue;
    };
  }
}
