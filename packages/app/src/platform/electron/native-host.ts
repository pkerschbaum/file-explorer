import { Emitter } from '#pkg/base/event';
import { URI } from '#pkg/base/uri';
import { blob, trpc } from '#pkg/platform/electron/file-explorer-agent-client/agent-client';
import type { PlatformNativeHost } from '#pkg/platform/native-host.types';
import { CLIPBOARD_CHANGED_DATA_TYPE } from '#pkg/platform/native-host.types';

export const createNativeHost = () => {
  const onClipboardChanged = new Emitter<CLIPBOARD_CHANGED_DATA_TYPE>();

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
        onClipboardChanged.fire(CLIPBOARD_CHANGED_DATA_TYPE.TEXT);
      },
      readResources: trpc.clipboard.readResources.query,
      writeResources: async (resources) => {
        await trpc.clipboard.writeResources.mutate({ resources });
        onClipboardChanged.fire(CLIPBOARD_CHANGED_DATA_TYPE.RESOURCES);
      },
      onClipboardChanged: onClipboardChanged.event,
    },
    webContents: {
      startNativeFileDnD: (resources) =>
        window.privileged.webContents.fileDragStart({
          fsPaths: resources.map((resource) => URI.fsPath(resource)),
        }),
    },
  };

  return instance;
};
