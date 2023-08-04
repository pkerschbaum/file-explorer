import type { PlatformFileIconThemeLoader } from '#pkg/file-icon-theme-loader.types';

export function createFakeFileIconThemeLoader(): PlatformFileIconThemeLoader {
  return {
    loadCssRules: () => Promise.resolve(''),
  };
}
