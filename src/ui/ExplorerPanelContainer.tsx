import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { useCwd, useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { ActionsBar } from '@app/ui/actions-bar';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
import { FilesTable } from '@app/ui/files-table';

type ExplorerPanelContainerProps = { explorerId: string };

export const ExplorerPanelContainer = React.memo<ExplorerPanelContainerProps>(
  function ExplorerPanelContainer({ explorerId }) {
    const cwd = useCwd(explorerId);
    const focusedExplorerId = useIdOfFocusedExplorerPanel();

    const isActiveExplorer = explorerId === focusedExplorerId;

    return (
      <ExplorerContextProvider key={URI.from(cwd).toString()} explorerId={explorerId}>
        {isActiveExplorer && (
          <>
            <CwdBreadcrumbs />
            <ActionsBar />
            <FilesTable />
          </>
        )}
      </ExplorerContextProvider>
    );
  },
);
