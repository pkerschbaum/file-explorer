import type { Event } from '@file-explorer/code-oss-ecma/event';
import type { ResourceForUI } from '@file-explorer/code-oss-ecma/types';
import type { UriComponents } from '@file-explorer/code-oss-ecma/uri';

export enum CLIPBOARD_CHANGED_DATA_TYPE {
  TEXT = 'TEXT',
  RESOURCES = 'RESOURCES',
}

export type PlatformNativeHost = {
  app: {
    getPath: (args: { name: 'home' }) => Promise<UriComponents>;
    isResourceQualifiedForThumbnail: (resource: ResourceForUI) => boolean;
    getThumbnailURLForResource: (resource: ResourceForUI, height: number) => string | undefined;
    isResourceQualifiedForNativeIcon: (resource: ResourceForUI) => boolean;
    getNativeIconURLForResource: (resource: ResourceForUI) => string | undefined;
  };
  shell: {
    revealResourcesInOS: (resources: UriComponents[]) => Promise<void>;
    openPath: (resources: UriComponents[]) => Promise<void>;
  };
  clipboard: {
    readText: () => string | Promise<string>;
    writeText: (value: string) => void | Promise<void>;
    readResources: () => UriComponents[] | Promise<UriComponents[]>;
    writeResources: (resources: UriComponents[]) => void | Promise<void>;
    onClipboardChanged: Event<CLIPBOARD_CHANGED_DATA_TYPE>;
  };
  nativeDND: {
    start: (resources: UriComponents[]) => Promise<void>;
  };
};
