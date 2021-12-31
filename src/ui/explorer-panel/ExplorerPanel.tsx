import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { uriHelper } from '@app/base/utils/uri-helper';
import {
  useCwdSegments,
  useIdOfFocusedExplorerPanel,
} from '@app/global-state/slices/explorers.hooks';
import { ActionsBar } from '@app/ui/actions-bar';
import { Box } from '@app/ui/components-library';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import { CwdSegmentContextProvider, useActiveResourcesView } from '@app/ui/cwd-segment-context';
import { ResourcesGallery } from '@app/ui/resources-gallery';
import { ResourcesTable } from '@app/ui/resources-table';
import { createContext } from '@app/ui/utils/react.util';

export const EXPLORER_CWDBREADCRUMBS_GRID_AREA = 'shell-explorer-cwd-breadcrumbs';
export const EXPLORER_ACTIONSBAR_GRID_AREA = 'shell-explorer-actions-bar';
export const EXPLORER_RESOURCESVIEW_GRID_AREA = 'shell-explorer-resources-view';

const explorerRootContext = createContext<{ explorerId: string }>('ExplorerRootContext');
const useExplorerRootContext = explorerRootContext.useContextValue;
export const ExplorerRootContextProvider = explorerRootContext.Provider;

export function useExplorerId() {
  return useExplorerRootContext().explorerId;
}

type ExplorerPanelProps = {
  explorerId: string;
  customTitleBarUsed: boolean;
};

export const ExplorerPanel = React.memo<ExplorerPanelProps>(function ExplorerPanel({
  explorerId,
  customTitleBarUsed,
}) {
  const cwdSegments = useCwdSegments(explorerId);
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  const isActiveExplorer = explorerId === focusedExplorerId;
  const activeAnimationVariant = isActiveExplorer ? 'open' : 'closed';

  return (
    <ExplorerRootContextProvider value={{ explorerId }}>
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

      <AnimatePresence initial={false}>
        {cwdSegments.map((segment, idx) => {
          const isLastSegment = idx === cwdSegments.length - 1;

          return (
            <CwdSegmentContextProvider
              key={uriHelper.getComparisonKey(segment.uri)}
              segmentIdx={idx}
            >
              {isLastSegment && (
                <ActionsBarContainer
                  variants={{
                    closed: { display: 'none' },
                    open: { display: 'block' },
                  }}
                  animate={activeAnimationVariant}
                >
                  <ActionsBar />
                </ActionsBarContainer>
              )}

              <ResourcesViewContainer
                variants={{
                  closed: { display: 'none' },
                  open: { display: 'flex' },
                }}
                animate={activeAnimationVariant}
              >
                <ResourcesView />
              </ResourcesViewContainer>
            </CwdSegmentContextProvider>
          );
        })}
      </AnimatePresence>
    </ExplorerRootContextProvider>
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
  z-index: 0;

  display: flex;
  flex-direction: column;

  /* add some padding-top for optical alignment */
  padding-top: 1px;

  /* hide overflow for folder navigation animations */
  overflow: hidden;
`;

const ResourcesView: React.FC = () => {
  const activeResourcesView = useActiveResourcesView();

  return (
    <ResourcesViewSlideBox
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ ease: 'easeOut', duration: 0.5 }}
    >
      {activeResourcesView === 'gallery' ? <ResourcesGallery /> : <ResourcesTable />}
    </ResourcesViewSlideBox>
  );
};

const ResourcesViewSlideBox = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-0);
`;
