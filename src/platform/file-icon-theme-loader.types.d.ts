import { FileIconTheme } from '@app/constants';

export type PlatformFileIconThemeLoader = {
  loadCssRules: (fileIconThemePathFragment: FileIconTheme['fsPathFragment']) => Promise<string>;
};
