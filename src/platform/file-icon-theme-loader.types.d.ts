import { FileIconTheme } from '@app/domain/constants';

export type PlatformFileIconThemeLoader = {
  loadCssRules: (fileIconThemePathFragment: FileIconTheme['fsPathFragment']) => Promise<string>;
};
