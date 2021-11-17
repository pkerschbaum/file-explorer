import { Box } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd, useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { ActionsBar } from '@app/ui/actions-bar';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
import { ResourcesTable } from '@app/ui/resources-table';

export const EXPLORER_RESOURCESTABLE_GRID_AREA = 'shell-explorer-resources-table';

type ExplorerPanelProps = { explorerId: string };

export const ExplorerPanel = React.memo<ExplorerPanelProps>(function ExplorerPanel({ explorerId }) {
  const cwd = useCwd(explorerId);
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  const isActiveExplorer = explorerId === focusedExplorerId;

  return (
    <>
      {isActiveExplorer && <CwdBreadcrumbs explorerId={explorerId} />}
      <ExplorerContextProvider key={uriHelper.getComparisonKey(cwd)} explorerId={explorerId}>
        {isActiveExplorer && (
          <>
            <ActionsBar />
            <ResourcesTableContainer>
              <ResourcesTable />
            </ResourcesTableContainer>
          </>
        )}
      </ExplorerContextProvider>
    </>
  );
});

const ResourcesTableContainer = styled(Box)`
  grid-area: ${EXPLORER_RESOURCESTABLE_GRID_AREA};
  padding-bottom: ${(props) => props.theme.spacing(0.5)};
`;
