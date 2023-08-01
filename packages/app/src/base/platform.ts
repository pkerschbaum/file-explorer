import * as codeOSSPlatform from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';

export const platform = {
  isLinux: codeOSSPlatform.isLinux,
  isWindows: codeOSSPlatform.isWindows,
};
