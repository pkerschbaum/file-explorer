import * as codeOSSPath from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';

export const path = {
  normalize: codeOSSPath.normalize.bind(codeOSSPath),
  extname: codeOSSPath.extname.bind(codeOSSPath),
  basename: codeOSSPath.basename.bind(codeOSSPath),
  join: codeOSSPath.join.bind(codeOSSPath),
  isAbsolute: codeOSSPath.isAbsolute.bind(codeOSSPath),
};
