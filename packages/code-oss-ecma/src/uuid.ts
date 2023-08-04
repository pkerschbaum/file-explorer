import * as codeOSSUuid from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uuid';

export const uuid = {
  generateUuid: codeOSSUuid.generateUuid.bind(codeOSSUuid),
};
