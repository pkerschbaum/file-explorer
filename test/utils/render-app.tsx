import { render } from '@testing-library/react';

import { Globals, GlobalsProps } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

export function renderApp(globalsProps: GlobalsProps) {
  render(
    <Globals {...globalsProps}>
      <Shell />
    </Globals>,
  );
}
