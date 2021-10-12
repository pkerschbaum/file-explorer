// based on https://github.com/microsoft/vscode/blob/04bb52865ac0d5fa8686f1938159c4f36f0ecc88/src/vs/workbench/services/clipboard/electron-sandbox/clipboardService.ts
import { Emitter, Event } from 'code-oss-file-service/out/vs/base/common/event';
import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

export type NexClipboard = {
  readResources(): URI[];
  writeResources(resources: URI[]): void;
  onClipboardChanged: Event<void>;
};

export class NexClipboardImpl implements NexClipboard {
  private readonly _onClipboardChanged = new Emitter<void>();

  public readResources: NexClipboard['readResources'] = () => {
    return window.preload.clipboardReadResources();
  };

  public writeResources: NexClipboard['writeResources'] = (resources) => {
    if (resources.length) {
      window.preload.clipboardWriteResources(resources);
      this._onClipboardChanged.fire();
    }
  };

  public onClipboardChanged = this._onClipboardChanged.event;
}
