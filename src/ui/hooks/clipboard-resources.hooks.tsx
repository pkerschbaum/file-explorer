import * as React from 'react';

import { nativeHostRef } from '@app/operations/global-modules';

export function useClipboardResources() {
  const [clipboardResources, setClipboardResources] = React.useState(() =>
    nativeHostRef.current.clipboard.readResources(),
  );

  React.useEffect(function registerOnClipboardChangedHandler() {
    const disposable = nativeHostRef.current.clipboard.onClipboardChanged(() => {
      setClipboardResources(nativeHostRef.current.clipboard.readResources());
    });

    return () => disposable.dispose();
  }, []);

  return clipboardResources;
}
