import { Box } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd, useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { ActionsBar } from '@app/ui/actions-bar';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
import { ResourcesTable } from '@app/ui/resources-table';

export const EXPLORER_CWDBREADCRUMBS_GRID_AREA = 'shell-explorer-cwd-breadcrumbs';
export const EXPLORER_ACTIONSBAR_GRID_AREA = 'shell-explorer-actions-bar';
export const EXPLORER_RESOURCESTABLE_GRID_AREA = 'shell-explorer-resources-table';

type ExplorerPanelProps = { explorerId: string };

export const ExplorerPanel = React.memo<ExplorerPanelProps>(function ExplorerPanel({ explorerId }) {
  const cwd = useCwd(explorerId);
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  const isActiveExplorer = explorerId === focusedExplorerId;

  return (
    <>
      <ExplorerContextProvider
        key={uriHelper.getComparisonKey(cwd)}
        explorerId={explorerId}
        isActiveExplorer={isActiveExplorer}
      >
        <CwdBreadcrumbsContainer hidden={!isActiveExplorer}>
          <CwdBreadcrumbs />
        </CwdBreadcrumbsContainer>
        <ActionsBarContainer hidden={!isActiveExplorer}>
          <ActionsBar />
        </ActionsBarContainer>
        <ResourcesTableContainer hidden={!isActiveExplorer}>
          <ResourcesTable />
        </ResourcesTableContainer>
      </ExplorerContextProvider>
    </>
  );
});

const CwdBreadcrumbsContainer = styled(Box)`
  /* Overlap the CwdBreadcrumbs with the WindowDragRegion above it */
  margin-top: -20px;
  -webkit-app-region: no-drag;

  width: fit-content;
  grid-area: ${EXPLORER_CWDBREADCRUMBS_GRID_AREA};
  padding-bottom: ${(props) => props.theme.spacing()};
  margin-bottom: ${(props) => props.theme.spacing()};
`;

const ActionsBarContainer = styled(Box)`
  grid-area: ${EXPLORER_ACTIONSBAR_GRID_AREA};
  padding-bottom: ${(props) => props.theme.spacing()};
`;

const ResourcesTableContainer = styled(Box)`
  grid-area: ${EXPLORER_RESOURCESTABLE_GRID_AREA};
  padding-bottom: ${(props) => props.theme.spacing(0.5)};
`;
