import * as React from 'react';
import type { Options } from 'react-virtual';
import { useVirtual as useReactVirtual } from 'react-virtual';

import { useForceUpdate } from '@app/ui/utils/react.util';

export function useVirtual<T>(options: Options<T>) {
  /**
   * Workaround for https://github.com/tannerlinsley/react-virtual/issues/146:
   * Force a rerender after mount so that react-virtual begins to listen on the parentRef (=scroll container)
   */
  const forceUpdate = useForceUpdate();
  React.useLayoutEffect(() => {
    forceUpdate();
  }, [forceUpdate]);

  return useReactVirtual(options);
}
