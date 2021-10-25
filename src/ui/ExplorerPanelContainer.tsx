import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { useCwd } from '@app/global-state/slices/explorers.hooks';
import { ExplorerContextProvider } from '@app/ui/explorer-context/Explorer.context';
import { ExplorerPanel } from '@app/ui/explorer-panel/ExplorerPanel';

type ExplorerPanelContainerProps = { explorerId: string };

export const ExplorerPanelContainer = React.memo<ExplorerPanelContainerProps>(
  function ExplorerPanelContainer({ explorerId }) {
    const cwd = useCwd(explorerId);

    return (
      <ExplorerContextProvider key={URI.from(cwd).toString()} explorerId={explorerId}>
        <ExplorerPanel explorerId={explorerId} />
      </ExplorerContextProvider>
    );
  },
);
