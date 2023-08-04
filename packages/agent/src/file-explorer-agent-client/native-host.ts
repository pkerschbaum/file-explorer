import { Emitter } from '@file-explorer/code-oss-ecma/event';
import type {
  CLIPBOARD_CHANGED_DATA_TYPE,
  PlatformNativeHost,
} from '@file-explorer/platform/native-host.types';

import { blob, pushSocket, trpc } from '#pkg/file-explorer-agent-client/agent-client';

export const createNativeHost = () => {
  const onClipboardChanged = new Emitter<CLIPBOARD_CHANGED_DATA_TYPE>();

  pushSocket.on('ClipboardChanged', (payload) => {
    onClipboardChanged.fire(payload.dataType);
  });

  const instance: PlatformNativeHost = {
    app: {
      getPath: trpc.app.getPath.mutate,
      isResourceQualifiedForThumbnail: blob.isResourceQualifiedForThumbnail,
      getThumbnailURLForResource: blob.getThumbnailURLForResource,
      isResourceQualifiedForNativeIcon: blob.isResourceQualifiedForNativeIcon,
      getNativeIconURLForResource: blob.getNativeIconURLForResource,
    },
    shell: {
      revealResourcesInOS: async (resources) => {
        for (const resource of resources) {
          await trpc.shell.showItemInFolder.mutate({ resource });
        }
      },
      openPath: async (resources) => {
        for (const resource of resources) {
          await trpc.shell.openPath.mutate({ resource });
        }
      },
    },
    window: {
      minimize: trpc.window.minimize.mutate,
      toggleMaximized: trpc.window.toggleMaximize.mutate,
      close: trpc.window.close.mutate,
    },
    clipboard: {
      readText: trpc.clipboard.readText.query,
      writeText: async (value) => {
        await trpc.clipboard.writeText.mutate({ value });
      },
      readResources: trpc.clipboard.readResources.query,
      writeResources: async (resources) => {
        await trpc.clipboard.writeResources.mutate({ resources });
      },
      onClipboardChanged: onClipboardChanged.event,
    },
  };

  return instance;
};
