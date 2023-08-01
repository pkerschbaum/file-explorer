import type { FileIconTheme } from '#pkg/domain/constants';

export type PlatformFileIconThemeLoader = {
  loadCssRules: (fileIconThemePathFragment: FileIconTheme['fsPathFragment']) => Promise<string>;
};
