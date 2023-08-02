import type { Event } from '#pkg/base/event';
import type { UriComponents } from '#pkg/base/uri';
import type { ResourceForUI } from '#pkg/domain/types';

export type PlatformNativeHost = {
  app: {
    getPath: (args: { name: 'home' }) => Promise<UriComponents>;
    isResourceQualifiedForThumbnail: (resource: ResourceForUI) => boolean;
    getThumbnailURLForResource: (resource: ResourceForUI, height: number) => string | undefined;
    isResourceQualifiedForNativeIcon: (resource: ResourceForUI) => boolean;
    getNativeIconURLForResource: (resource: ResourceForUI) => string | undefined;
  };
  shell: {
    revealResourcesInOS(resources: UriComponents[]): Promise<void>;
    openPath: (resources: UriComponents[]) => Promise<void>;
  };
  window: {
    minimize: () => Promise<void>;
    toggleMaximized: () => Promise<void>;
    close: () => Promise<void>;
  };
  clipboard: {
    readText(): string | Promise<string>;
    writeText(value: string): void | Promise<void>;
    readResources(): UriComponents[] | Promise<UriComponents[]>;
    writeResources(resources: UriComponents[]): void | Promise<void>;
    onClipboardChanged: Event<CLIPBOARD_CHANGED_DATA_TYPE>;
  };
  webContents: {
    startNativeFileDnD: (resources: UriComponents[]) => void;
  };
};

export enum CLIPBOARD_CHANGED_DATA_TYPE {
  TEXT = 'TEXT',
  RESOURCES = 'RESOURCES',
}
