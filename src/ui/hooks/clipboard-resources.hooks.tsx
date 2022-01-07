import * as React from 'react';

export function useClipboardResources() {
  const [clipboardResources, setClipboardResources] = React.useState(() =>
    globalThis.modules.nativeHost.clipboard.readResources(),
  );

  React.useEffect(function registerOnClipboardChangedHandler() {
    const disposable = globalThis.modules.nativeHost.clipboard.onClipboardChanged(() => {
      setClipboardResources(globalThis.modules.nativeHost.clipboard.readResources());
    });

    return () => disposable.dispose();
  }, []);

  return clipboardResources;
}
