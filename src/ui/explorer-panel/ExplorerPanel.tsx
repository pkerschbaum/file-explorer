import { AnimatePresence, Transition, Variants } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { uriHelper } from '@app/base/utils/uri-helper';
import {
  useCwdSegments,
  useIdOfFocusedExplorerPanel,
  useVersionOfExplorer,
} from '@app/global-state/slices/explorers.hooks';
import { ActionsBar } from '@app/ui/actions-bar';
import { Box, componentLibraryUtils } from '@app/ui/components-library';
import { CwdBreadcrumbs } from '@app/ui/cwd-breadcrumbs';
import { CwdSegmentContextProvider, useActiveResourcesView } from '@app/ui/cwd-segment-context';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
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
  const cwdSegments = useCwdSegments(explorerId);
  const versionOfExplorer = useVersionOfExplorer(explorerId);
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  const isActiveExplorer = explorerId === focusedExplorerId;
  const activeAnimationVariant = isActiveExplorer ? 'open' : 'closed';

  return (
    /**
     * "key" is set to the current version of the explorer so that if the version changes, everything
     * is remounted (thus, state is reinitialized) and no animations run.
     * This is e.g. needed if the CWD changes in "destructive" way (e.g. the user enters a new CWD
     * via the ChangeCwd form - no state should be kept then).
     */
    <ExplorerContextProvider explorerId={explorerId} key={versionOfExplorer}>
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
              <ActionsBarAndResourcesView
                isLastSegment={isLastSegment}
                activeAnimationVariant={activeAnimationVariant}
              />
            </CwdSegmentContextProvider>
          );
        })}
      </AnimatePresence>
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

const ActionsBarAndResourcesView = React.memo<{
  isLastSegment: boolean;
  activeAnimationVariant: string;
}>(function ActionBarAndResourcesView({ isLastSegment, activeAnimationVariant }) {
  return (
    <>
      {isLastSegment && (
        <ActionsBarContainer
          variants={{
            closed: { display: 'none' },
            open: { display: 'block' },
          }}
          animate={activeAnimationVariant}
          exit="closed"
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
        aria-hidden={!isLastSegment}
      >
        <ResourcesView />
      </ResourcesViewContainer>
    </>
  );
});

const ActionsBarContainer = styled(Box)`
  grid-area: ${EXPLORER_ACTIONSBAR_GRID_AREA};
`;

const ResourcesViewContainer = styled(Box)`
  grid-area: ${EXPLORER_RESOURCESVIEW_GRID_AREA};
  min-height: 0;
  height: 100%;
  max-height: 100%;
  /* TODO workaround: set z-index: 0 so that Backdrops rendered in the ProcessesArea are *above* the ResourcesViewContainer */
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
  const isAnimationAllowed = componentLibraryUtils.useIsAnimationAllowed();
  const variants = {
    closed: {
      x: '100%',
    },
    center: {
      x: 0,
      transitionEnd: {
        // workaround to fix trailing transform (https://github.com/framer/motion/issues/823#issuecomment-719582943)
        x: 0,
      },
    },
  };
  const animations: {
    variants?: Variants;
    initial?: keyof typeof variants;
    animate?: keyof typeof variants;
    exit?: keyof typeof variants;
    transition?: Transition;
  } = !isAnimationAllowed
    ? {}
    : {
        variants,
        initial: 'closed',
        animate: 'center',
        exit: 'closed',
        transition: { ease: 'easeOut', duration: 0.5 },
      };

  return (
    <ResourcesViewSlideBox {...animations}>
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
