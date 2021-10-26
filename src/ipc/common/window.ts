export declare namespace WindowMinimize {
  export type Args = void;
  export type ReturnValue = Promise<void>;
}
export const WINDOW_MINIMIZE_CHANNEL = 'app:windowMinimize';

export declare namespace WindowToggleMaximize {
  export type Args = void;
  export type ReturnValue = Promise<void>;
}
export const WINDOW_TOGGLEMAXIMIZE_CHANNEL = 'app:windowToggleMaximize';

export declare namespace WindowClose {
  export type Args = void;
  export type ReturnValue = Promise<void>;
}
export const WINDOW_CLOSE_CHANNEL = 'app:windowClose';
