import * as React from 'react';

import { clipboardRef } from '@app/operations/global-modules';

export function useClipboardResources() {
  const [clipboardResources, setClipboardResources] = React.useState(() =>
    clipboardRef.current.readResources(),
  );

  React.useEffect(function registerOnClipboardChangedHandler() {
    const disposable = clipboardRef.current.onClipboardChanged(() => {
      setClipboardResources(clipboardRef.current.readResources());
    });

    return () => disposable.dispose();
  }, []);

  return clipboardResources;
}
