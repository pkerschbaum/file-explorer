import * as React from 'react';
import styled, { css } from 'styled-components';

import { useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { ActionsBar } from '@app/ui/actions-bar';
import { Box } from '@app/ui/components-library';
import { KEY } from '@app/ui/constants';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import {
  ExplorerContextProvider,
  useActiveResourcesView,
  useRegisterExplorerShortcuts,
  useSelectAll,
} from '@app/ui/explorer-context';
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
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  const isActiveExplorer = explorerId === focusedExplorerId;
  const activeAnimationVariant = isActiveExplorer ? 'open' : 'closed';

  return (
    <ExplorerContextProvider explorerId={explorerId}>
      <CwdBreadcrumbsContainer
        variants={{
          closed: { display: 'none' },
          open: { display: 'block' },
        }}
        animate={activeAnimationVariant}
        customTitleBarUsed={customTitleBarUsed}
      >
        <CwdBreadcrumbs />
      </CwdBreadcrumbsContainer>
      <ActionsBarContainer
        variants={{
          closed: { display: 'none' },
          open: { display: 'block' },
        }}
        animate={activeAnimationVariant}
      >
        <ActionsBar />
      </ActionsBarContainer>
      <ResourcesViewContainer
        variants={{
          closed: { display: 'none' },
          open: { display: 'flex' },
        }}
        animate={activeAnimationVariant}
      >
        <ResourcesView />
      </ResourcesViewContainer>
    </ExplorerContextProvider>
  );
});

const CwdBreadcrumbsContainer = styled(Box)<{ customTitleBarUsed: boolean }>`
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

const ActionsBarContainer = styled(Box)`
  grid-area: ${EXPLORER_ACTIONSBAR_GRID_AREA};
`;

const ResourcesViewContainer = styled(Box)`
  grid-area: ${EXPLORER_RESOURCESVIEW_GRID_AREA};
  min-height: 0;
  height: 100%;
  max-height: 100%;

  /* add some padding-top for optical alignment */
  padding-top: 1px;
  flex-direction: column;
  align-items: stretch;
`;

const ResourcesView: React.FC = () => {
  const activeResourcesView = useActiveResourcesView();
  const selectAll = useSelectAll();

  useRegisterExplorerShortcuts({
    selectAllShortcut: {
      keybindings: [
        {
          key: KEY.A,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: (e) => {
        e.preventDefault();
        selectAll();
      },
    },
  });

  return activeResourcesView === 'gallery' ? <ResourcesGallery /> : <ResourcesTable />;
};
