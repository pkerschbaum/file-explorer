export declare namespace PersistData {
  export type Args = Record<string, unknown>;
  export type ReturnValue = void;
}
export const PERSISTDATA_CHANNEL = 'app:persistData';

export declare namespace ReadPersistedData {
  export type Args = unknown;
  export type ReturnValue = Record<string, unknown>;
}
export const READPERSISTEDDATA_CHANNEL = 'app:readPersistedData';
