import * as codeOSSExtpath from '@pkerschbaum/code-oss-file-service/out/vs/base/common/extpath';

export const extpath = {
  isValidBasename: codeOSSExtpath.isValidBasename.bind(codeOSSExtpath),
};
