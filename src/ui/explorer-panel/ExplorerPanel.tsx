import * as React from 'react';

import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd, useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { ActionsBar } from '@app/ui/actions-bar';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
import { ResourcesTable } from '@app/ui/resources-table';

type ExplorerPanelProps = { explorerId: string };

export const ExplorerPanel = React.memo<ExplorerPanelProps>(function ExplorerPanel({ explorerId }) {
  const cwd = useCwd(explorerId);
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  const isActiveExplorer = explorerId === focusedExplorerId;

  return (
    <ExplorerContextProvider key={uriHelper.getComparisonKey(cwd)} explorerId={explorerId}>
      {isActiveExplorer && (
        <>
          <CwdBreadcrumbs />
          <ActionsBar />
          <ResourcesTable />
        </>
      )}
    </ExplorerContextProvider>
  );
});
