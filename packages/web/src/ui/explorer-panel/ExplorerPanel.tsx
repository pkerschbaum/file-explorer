import type { Transition, Variants } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';

import {
  useCwdSegments,
  useIdOfFocusedExplorerPanel,
  useVersionOfExplorer,
} from '#pkg/global-state/slices/explorers.hooks';
import { ActionsBar } from '#pkg/ui/actions-bar';
import { Box, componentLibraryUtils } from '#pkg/ui/components-library';
import { CwdBreadcrumbs } from '#pkg/ui/cwd-breadcrumbs';
import { CwdSegmentContextProvider, useActiveResourcesView } from '#pkg/ui/cwd-segment-context';
import { ExplorerContextProvider } from '#pkg/ui/explorer-context';
import { ResourcesGallery } from '#pkg/ui/resources-gallery';
import { ResourcesTable } from '#pkg/ui/resources-table';
import { PREFERENCES_BUTTON_WIDTH, ROOTCONTAINER_PADDING_FACTOR } from '#pkg/ui/shell/constants';

export const EXPLORER_PANEL_GRID_AREA = 'shell-explorer-panel';

type ExplorerPanelProps = {
  explorerId: string;
};

export const ExplorerPanel = React.memo<ExplorerPanelProps>(function ExplorerPanel({ explorerId }) {
  const cwdSegments = useCwdSegments(explorerId);
  const versionOfExplorer = useVersionOfExplorer(explorerId);
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  const isActiveExplorer = explorerId === focusedExplorerId;

  const styleProps: StyleProps = {
    hidden: !isActiveExplorer,
  };

  return (
    /**
     * "key" is set to the current version of the explorer so that if the version changes, everything
     * is remounted (thus, state is reinitialized) and no animations run.
     * This is e.g. needed if the CWD changes in "destructive" way (e.g. the user enters a new CWD
     * via the ChangeCwd form - no state should be kept then).
     */
    <ExplorerContextProvider explorerId={explorerId} key={versionOfExplorer}>
      <ExplorerPanelContainer styleProps={styleProps}>
        <CwdBreadcrumbsContainer styleProps={styleProps}>
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
                    styleProps={styleProps}
                    /**
                     * If the last segment changes, the resources view is animated using a slide in/out
                     * animation.
                     * For the actions bar we have to animate to display: 'none' on exit because otherwise,
                     * the "old" actions bar (i.e. the actions bar of the previous last segment) would
                     * stay until the end of the resources view slide in/out animation - effectively
                     * hiding the new actions bar.
                     */
                    variants={{
                      closed: { display: 'none' },
                      open: { display: 'block' },
                    }}
                    animate="open"
                    exit="closed"
                  >
                    <ActionsBar />
                  </ActionsBarContainer>
                )}

                <ResourcesView />
              </CwdSegmentContextProvider>
            );
          })}
        </AnimatePresence>
      </ExplorerPanelContainer>
    </ExplorerContextProvider>
  );
});

type StyleProps = {
  hidden: boolean;
};

const CWD_BREADCRUMBS_GRID_AREA = 'cwd-breadcrumbs';
const ACTIONS_BAR_GRID_AREA = 'action-bar';
const RESOURCES_VIEW_GRID_AREA = 'resources-view';

const ExplorerPanelContainer = styled(Box)<{ styleProps: StyleProps }>`
  grid-area: ${EXPLORER_PANEL_GRID_AREA};
  min-height: 0;
  height: 100%;
  max-height: 100%;

  ${({ styleProps }) =>
    styleProps.hidden &&
    css`
      visibility: hidden;
    `}

  padding-bottom: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: max-content max-content 1fr;
  grid-template-areas:
    '${CWD_BREADCRUMBS_GRID_AREA}'
    '${ACTIONS_BAR_GRID_AREA}'
    '${RESOURCES_VIEW_GRID_AREA}';
  grid-row-gap: var(--spacing-2);
`;

const CwdBreadcrumbsContainer = styled(Box)<{ styleProps: StyleProps }>`
  grid-area: ${CWD_BREADCRUMBS_GRID_AREA};
  justify-self: start;

  /* add margin-right to avoid overlapping with the user preferences button */
  margin-right: ${PREFERENCES_BUTTON_WIDTH}px;

  /* make sure to restore pointer events for children (needed if a custom title bar is used) */
  & > * {
    pointer-events: initial;
  }
`;

const ActionsBarContainer = styled(Box)<{ styleProps: StyleProps }>`
  grid-area: ${ACTIONS_BAR_GRID_AREA};
  justify-self: start;

  /* make sure to restore pointer events for children (needed if a custom title bar is used) */
  & > * {
    pointer-events: initial;
  }
`;

const ResourcesView: React.FC = React.memo(function ResourcesViewMemoized() {
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
    <ResourcesViewContainer>
      <ResourcesViewSlideBox {...animations}>
        {activeResourcesView === 'gallery' ? <ResourcesGallery /> : <ResourcesTable />}
      </ResourcesViewSlideBox>
    </ResourcesViewContainer>
  );
});

const ResourcesViewContainer = styled(Box)`
  grid-area: ${RESOURCES_VIEW_GRID_AREA};

  /* make sure to restore pointer events for children (needed if a custom title bar is used) */
  & > * {
    pointer-events: initial;
  }

  /* TODO workaround: set z-index: 0 so that Backdrops rendered in the ProcessesArea are *above* the ResourcesViewContainer */
  z-index: 0;

  /* hide overflow for folder navigation animations */
  overflow: hidden;
`;

const ResourcesViewSlideBox = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;

  background-color: var(--color-bg-0);
`;
