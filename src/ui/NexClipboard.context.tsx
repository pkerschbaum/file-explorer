import * as React from 'react';

import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import { createContext } from '@app/ui/utils/react.util';
import { clipboardRef } from '@app/operations/global-modules';

const resourcesContext = createContext<URI[]>('ClipboardResources');
export const useClipboardResources = resourcesContext.useContextValue;
export const ClipboardResourcesContext: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [clipboardResources, setClipboardResources] = React.useState<URI[]>([]);

  React.useEffect(function registerOnClipboardChangedHandler() {
    const disposable = clipboardRef.current.onClipboardChanged(() => {
      setClipboardResources(clipboardRef.current.readResources());
    });

    return () => disposable.dispose();
  }, []);

  return (
    <resourcesContext.Provider value={clipboardResources}>{children}</resourcesContext.Provider>
  );
};
