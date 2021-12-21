import * as React from 'react';
import styled, { css } from 'styled-components';

import { uriHelper } from '@app/base/utils/uri-helper';
import { useCwd, useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { ActionsBar } from '@app/ui/actions-bar';
import { Box } from '@app/ui/components-library';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import { ExplorerContextProvider, useActiveResourcesView } from '@app/ui/explorer-context';
import { ResourcesGallery } from '@app/ui/resources-gallery';
import { ResourcesTable } from '@app/ui/resources-table';

export const EXPLORER_CWDBREADCRUMBS_GRID_AREA = 'shell-explorer-cwd-breadcrumbs';
export const EXPLORER_ACTIONSBAR_GRID_AREA = 'shell-explorer-actions-bar';
export const EXPLORER_RESOURCESVIEW_GRID_AREA = 'shell-explorer-resources-view';

type ExplorerPanelProps = {
  explorerId: string;
  customTitleBarUsed: boolean;
};

export const ExplorerPanel = React.memo<ExplorerPanelProps>(function ExplorerPanel({
  explorerId,
  customTitleBarUsed,
}) {
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
        <CwdBreadcrumbsContainer hide={!isActiveExplorer} customTitleBarUsed={customTitleBarUsed}>
          <CwdBreadcrumbs />
        </CwdBreadcrumbsContainer>
        <ActionsBarContainer hide={!isActiveExplorer}>
          <ActionsBar />
        </ActionsBarContainer>
        <ResourcesViewContainer hide={!isActiveExplorer}>
          <ResourcesView />
        </ResourcesViewContainer>
      </ExplorerContextProvider>
    </>
  );
});

const CwdBreadcrumbsContainer = styled(Box)<{ hide: boolean; customTitleBarUsed: boolean }>`
  visibility: ${({ hide }) => (hide ? 'hidden' : undefined)};

  /* If a custom title bar is used, overlap the CwdBreadcrumbs with the WindowDragRegion above it */
  ${({ customTitleBarUsed }) => {
    if (customTitleBarUsed) {
      return css`
        margin-top: -24px;
        -webkit-app-region: no-drag;
      `;
    }
  }}

  width: fit-content;
  grid-area: ${EXPLORER_CWDBREADCRUMBS_GRID_AREA};
`;

const ActionsBarContainer = styled(Box)<{ hide: boolean }>`
  visibility: ${({ hide }) => (hide ? 'hidden' : undefined)};

  grid-area: ${EXPLORER_ACTIONSBAR_GRID_AREA};
`;

const ResourcesViewContainer = styled(Box)<{ hide: boolean }>`
  visibility: ${({ hide }) => (hide ? 'hidden' : undefined)};

  grid-area: ${EXPLORER_RESOURCESVIEW_GRID_AREA};
  min-height: 0;
  height: 100%;
  max-height: 100%;

  /* add some padding-top for optical alignment */
  padding-top: 1px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ResourcesView: React.FC = () => {
  const activeResourcesView = useActiveResourcesView();
  return activeResourcesView === 'table' ? <ResourcesTable /> : <ResourcesGallery />;
};
