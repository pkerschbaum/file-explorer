import { createContext } from '@app/ui/utils/react.util';
import { FileIconTheme } from '@app/platform/logic/file-icon-theme/file-icon-theme';

const context = createContext<FileIconTheme>('NexFileIconTheme');
export const useNexFileIconTheme = context.useContextValue;
export const NexFileIconThemeProvider = context.Provider;
