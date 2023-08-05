/**
 * To enable Native File Drag-and-Drop (https://www.electronjs.org/docs/latest/tutorial/native-file-drag-drop)
 * we create a nonvisible electron browser window and start drags via IPC.
 */
import { BrowserWindow, app, ipcMain, session } from 'electron';
import path from 'node:path';
import { z } from 'zod';

import { URI, UriComponents } from '@file-explorer/code-oss-ecma/uri';

import { PATH_TO_STATIC_DIR } from '#pkg/file-explorer-agent/constants';
import type {
  CHANNEL_NATIVE_DND_BACK_TO_MAIN,
  CHANNEL_NATIVE_DND_TO_RENDERER,
} from '#pkg/file-explorer-agent/native-dnd-procedures/constants';
import { publicProcedure } from '#pkg/file-explorer-agent/trcp-router';

const PATH_DND_ICON = path.join(PATH_TO_STATIC_DIR, 'outline_insert_drive_file_black_24dp.png');
const PATH_DUMMY_HTML = path.join(PATH_TO_STATIC_DIR, 'dummy.html');
const PATH_BROWSER_PRELOAD = path.join(__dirname, 'browser-preload.js');

const OnDragStartPayload = z.object({
  resources: z.array(UriComponents),
});
type OnDragStartPayload = z.infer<typeof OnDragStartPayload>;

export async function createNativeDNDProcedures() {
  ipcMain.on(
    'native-dnd-back-to-main' satisfies CHANNEL_NATIVE_DND_BACK_TO_MAIN,
    (event, arg: unknown) => {
      const { resources } = OnDragStartPayload.parse(arg);
      event.sender.startDrag({
        // @ts-expect-error -- types of `startDrag` are wrong here
        file: undefined,
        files: resources.map((resource) => URI.fsPath(resource)),
        icon: PATH_DND_ICON,
      });
    },
  );

  await app.whenReady();

  // get rid of Content-Security-Policy warning, https://www.electronjs.org/docs/latest/tutorial/security#7-define-a-content-security-policy
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'none'"],
      },
    });
  });

  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: PATH_BROWSER_PRELOAD,
    },
  });

  await win.loadFile(PATH_DUMMY_HTML);

  return {
    start: publicProcedure
      .input(z.object({ resources: z.array(UriComponents) }))
      .mutation(({ input }) => {
        const payload: OnDragStartPayload = { resources: input.resources };
        win.webContents.send(
          'native-dnd-to-renderer' satisfies CHANNEL_NATIVE_DND_TO_RENDERER,
          payload,
        );
      }),
  };
}
