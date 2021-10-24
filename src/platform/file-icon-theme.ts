import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

export type PlatformFileIconTheme = {
  loadCssRules: (fileIconThemePathFragment: string) => string | Promise<string>;
  loadIconClasses: (resource: URI, fileKind: FileKind) => string[] | Promise<string[]>;
};

export const createFileIconTheme = () => {
  const instance: PlatformFileIconTheme = {
    loadCssRules: window.privileged.fileIconTheme.loadCssRules.bind(
      window.privileged.fileIconTheme,
    ),
    loadIconClasses: window.privileged.fileIconTheme.loadIconClasses.bind(
      window.privileged.fileIconTheme,
    ),
  };

  return instance;
};
