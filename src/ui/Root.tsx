import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Globals, GlobalsProps } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

export function render(delegatedGlobalProps: GlobalsProps) {
  ReactDOM.render(
    <React.StrictMode>
      <Globals {...delegatedGlobalProps}>
        <Shell />
      </Globals>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
