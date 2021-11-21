import { PlatformFileIconThemeLoader } from '@app/platform/file-icon-theme-loader';

export function createFakeFileIconThemeLoader(): PlatformFileIconThemeLoader {
  return {
    loadCssRules: () => Promise.resolve(''),
  };
}
