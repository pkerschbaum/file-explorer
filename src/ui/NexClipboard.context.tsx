import * as React from 'react';

import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import { NexClipboard } from '@app/platform/logic/clipboard';
import { createContext } from '@app/ui/utils/react.util';

const context = createContext<NexClipboard>('NexClipboard');
export const useNexClipboard = context.useContextValue;
export const NexClipboardProvider = context.Provider;

const resourcesContext = createContext<URI[]>('ClipboardResources');
export const useClipboardResources = resourcesContext.useContextValue;
export const ClipboardResourcesContext: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const [clipboardResources, setClipboardResources] = React.useState<URI[]>([]);
  const clipboard = useNexClipboard();

  React.useEffect(
    function registerOnClipboardChangedHandler() {
      const disposable = clipboard.onClipboardChanged(() => {
        setClipboardResources(clipboard.readResources());
      });

      return () => disposable.dispose();
    },
    [clipboard],
  );

  return (
    <resourcesContext.Provider value={clipboardResources}>{children}</resourcesContext.Provider>
  );
};