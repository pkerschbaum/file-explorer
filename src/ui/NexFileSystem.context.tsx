import { createContext } from '@app/ui/utils/react.util';
import { NexFileSystem } from '@app/platform/logic/file-system';

const context = createContext<NexFileSystem>('NexFileSystem');
export const useNexFileSystem = context.useContextValue;
export const NexFileSystemProvider = context.Provider;
