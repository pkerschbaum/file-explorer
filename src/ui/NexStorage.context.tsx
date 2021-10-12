import { createContext } from '@app/ui/utils/react.util';
import { NexStorage } from '@app/platform/logic/storage';

const context = createContext<NexStorage>('NexStorage');
export const useNexStorage = context.useContextValue;
export const NexStorageProvider = context.Provider;
