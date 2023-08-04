import type { BrowserWindow } from 'electron';
import invariant from 'tiny-invariant';

import { publicProcedure } from '#pkg/file-explorer-agent/trcp-router';

export type WindowRef = { current?: BrowserWindow };

export function createWindowProcedures({ windowRef }: { windowRef: WindowRef }) {
  return {
    minimize: publicProcedure.mutation(() => {
      invariant(windowRef.current);
      windowRef.current.minimize();
    }),

    toggleMaximize: publicProcedure.mutation(() => {
      invariant(windowRef.current);
      windowRef.current.isMaximized()
        ? windowRef.current.unmaximize()
        : windowRef.current.maximize();
    }),

    close: publicProcedure.mutation(() => {
      invariant(windowRef.current);
      windowRef.current.close();
    }),
  };
}
