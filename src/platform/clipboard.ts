// based on https://github.com/microsoft/vscode/blob/04bb52865ac0d5fa8686f1938159c4f36f0ecc88/src/vs/workbench/services/clipboard/electron-sandbox/clipboardService.ts
import { Emitter, Event } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

export type PlatformClipboard = {
  readResources(): URI[];
  writeResources(resources: URI[]): void;
  onClipboardChanged: Event<void>;
};

export const createClipboard = () => {
  const onClipboardChanged = new Emitter<void>();

  const instance: PlatformClipboard = {
    readResources: window.preload.clipboardReadResources,
    writeResources: (resources) => {
      if (resources.length) {
        window.preload.clipboardWriteResources(resources);
        onClipboardChanged.fire();
      }
    },
    onClipboardChanged: onClipboardChanged.event,
  };

  return instance;
};
