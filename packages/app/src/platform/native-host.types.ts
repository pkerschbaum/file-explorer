import type { app } from 'electron';

import type { Event } from '@app/base/event';
import type { UriComponents } from '@app/base/uri';
import type { ResourceForUI } from '@app/domain/types';

export type PlatformNativeHost = {
  app: {
    getPath: (args: { name: Parameters<typeof app.getPath>[0] }) => Promise<UriComponents>;
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
    readText(): string;
    writeText(value: string): void;
    readResources(): UriComponents[];
    writeResources(resources: UriComponents[]): void;
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
