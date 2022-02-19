import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { config } from '@app/config';

export declare namespace IpcFileService {
  namespace DeleteRecursive {
    export type Args = { uri: UriComponents };
    export type ReturnValue = Promise<void>;
  }
}

export const FILE_SERVICE_CHANNEL = {
  DELETE_RECURSIVE: `${config.productName}:fileService:deleteRecursive`,
};
