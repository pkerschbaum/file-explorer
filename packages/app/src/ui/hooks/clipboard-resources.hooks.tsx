import * as React from 'react';

import { CLIPBOARD_CHANGED_DATA_TYPE } from '#pkg/platform/native-host.types';

export function useClipboardResources() {
  const [clipboardResources, setClipboardResources] = React.useState(() =>
    globalThis.modules.nativeHost.clipboard.readResources(),
  );

  React.useEffect(function registerOnClipboardChangedHandler() {
    const disposable = globalThis.modules.nativeHost.clipboard.onClipboardChanged((type) => {
      if (type === CLIPBOARD_CHANGED_DATA_TYPE.RESOURCES) {
        setClipboardResources(globalThis.modules.nativeHost.clipboard.readResources());
      }
    });

    return () => disposable.dispose();
  }, []);

  return clipboardResources;
}
