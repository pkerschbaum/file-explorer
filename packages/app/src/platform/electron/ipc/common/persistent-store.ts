import { config } from '#pkg/config';

export declare namespace IpcPersistentStore {
  namespace PersistData {
    export type Args = Record<string, unknown>;
    export type ReturnValue = void;
  }
  namespace ReadPersistedData {
    export type Args = unknown;
    export type ReturnValue = Record<string, unknown>;
  }
}

export const PERSISTENT_STORE_CHANNEL = {
  PERSIST_DATA: `${config.productName}:persistentStore:persistData`,
  READ_PERSISTED_DATA: `${config.productName}:persistentStore:readPersistedData`,
};
