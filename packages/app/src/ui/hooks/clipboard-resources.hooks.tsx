import * as React from 'react';

import type { UriComponents } from '#pkg/base/uri';
import { CLIPBOARD_CHANGED_DATA_TYPE } from '#pkg/platform/native-host.types';

export function useClipboardResources(): UriComponents[] {
  const [clipboardResources, setClipboardResources] = React.useState<UriComponents[]>([]);

  React.useEffect(function readInitialClipboard() {
    async function run() {
      setClipboardResources(await globalThis.modules.nativeHost.clipboard.readResources());
    }

    void run();
  }, []);

  React.useEffect(function registerOnClipboardChangedHandler() {
    const disposable = globalThis.modules.nativeHost.clipboard.onClipboardChanged(async (type) => {
      if (type === CLIPBOARD_CHANGED_DATA_TYPE.RESOURCES) {
        setClipboardResources(await globalThis.modules.nativeHost.clipboard.readResources());
      }
    });

    return () => disposable.dispose();
  }, []);

  return clipboardResources;
}
