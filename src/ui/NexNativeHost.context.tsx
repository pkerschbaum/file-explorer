import { createContext } from '@app/ui/utils/react.util';
import { NexNativeHost } from '@app/platform/logic/native-host';

const context = createContext<NexNativeHost>('NexNativeHost');
export const useNexNativeHost = context.useContextValue;
export const NexNativeHostProvider = context.Provider;
