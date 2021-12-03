import { IFileService } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

export type PlatformFileSystem = {
  resolve: IFileService['resolve'];
  del: IFileService['del'];
  copy: IFileService['copy'];
  move: IFileService['move'];
  createFolder: IFileService['createFolder'];
  watch: IFileService['watch'];
  onDidFilesChange: IFileService['onDidFilesChange'];
};
