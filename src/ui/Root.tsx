import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppDependencies, Providers } from '@app/ui/Providers';
import { Shell } from '@app/ui/Shell';

export function render(appDependencies: AppDependencies) {
  ReactDOM.render(
    <React.StrictMode>
      <Providers appDependencies={appDependencies}>
        <Shell />
      </Providers>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
