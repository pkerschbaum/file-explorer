import type { PlatformFileIconThemeLoader } from '@app/platform/file-icon-theme-loader.types';

export function createFakeFileIconThemeLoader(): PlatformFileIconThemeLoader {
  return {
    loadCssRules: () => Promise.resolve(''),
  };
}
