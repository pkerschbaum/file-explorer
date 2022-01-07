import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileService } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

export type PlatformFileSystem = {
  resolve: IFileService['resolve'];
  del: IFileService['del'];
  copy: IFileService['copy'];
  move: IFileService['move'];
  createFolder: (resource: UriComponents) => Promise<IFileStatWithMetadata>;
  watch: IFileService['watch'];
  onDidFilesChange: IFileService['onDidFilesChange'];
};
