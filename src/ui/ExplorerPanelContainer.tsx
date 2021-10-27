import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { useCwd, useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import { ExplorerActions } from '@app/ui/explorer-actions';
import { ExplorerContextProvider } from '@app/ui/explorer-context/Explorer.context';
import { ExplorerPanel } from '@app/ui/explorer-panel';

type ExplorerPanelContainerProps = { explorerId: string };

export const ExplorerPanelContainer = React.memo<ExplorerPanelContainerProps>(
  function ExplorerPanelContainer({ explorerId }) {
    const cwd = useCwd(explorerId);
    const focusedExplorerId = useIdOfFocusedExplorerPanel();

    const isActiveExplorer = explorerId === focusedExplorerId;

    return (
      <ExplorerContextProvider key={URI.from(cwd).toString()} explorerId={explorerId}>
        <>
          {isActiveExplorer && (
            <>
              <CwdBreadcrumbs />
              <ExplorerActions />
              <ExplorerPanel />
            </>
          )}
        </>
      </ExplorerContextProvider>
    );
  },
);
