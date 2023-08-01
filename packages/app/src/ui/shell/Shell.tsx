import * as React from 'react';
import styled, { css } from 'styled-components';

import { platform } from '#pkg/base/platform';
import { useExplorerPanels } from '#pkg/global-state/slices/explorers.hooks';
import { Box } from '#pkg/ui/components-library';
import { ExplorerPanel, EXPLORER_PANEL_GRID_AREA } from '#pkg/ui/explorer-panel/ExplorerPanel';
import { ROOTCONTAINER_PADDING_FACTOR, TITLEBAR_HEIGHT } from '#pkg/ui/shell/constants';
import { ProcessesArea } from '#pkg/ui/shell/ProcessesArea';
import { TabsArea } from '#pkg/ui/shell/TabsArea';
import { TitleBar, TITLE_BAR_GRID_AREA } from '#pkg/ui/shell/TitleBar';
import { UserPreferencesButton } from '#pkg/ui/user-preferences';

export const TABS_AND_PROCESSES_GRID_AREA = 'shell-tabs-and-processes';

const useCustomTitleBar = platform.isWindows;

export const Shell = React.memo(function Shell() {
  const explorerPanels = useExplorerPanels();

  const explorersToShow = explorerPanels.filter((explorer) => !explorer.markedForRemoval);

  return (
    <RootContainer>
      {useCustomTitleBar && <TitleBar />}

      <TabsAndProcesses>
        <TabsArea explorersToShow={explorersToShow} customTitleBarUsed={useCustomTitleBar} />
        <ProcessesArea />
      </TabsAndProcesses>

      {explorersToShow.map(({ explorerId }) => (
        <ExplorerPanel
          key={explorerId}
          explorerId={explorerId}
          customTitleBarUsed={useCustomTitleBar}
        />
      ))}

      <UserPreferencesButton customTitleBarUsed={useCustomTitleBar} />
    </RootContainer>
  );
});

const CUSTOM_TITLE_BAR_GRID_CONFIGURATION = css`
  grid-template-rows: ${TITLEBAR_HEIGHT}px 1fr;
  grid-template-areas:
    '${TITLE_BAR_GRID_AREA} ${TITLE_BAR_GRID_AREA}'
    '${TABS_AND_PROCESSES_GRID_AREA} ${EXPLORER_PANEL_GRID_AREA}';
`;

const NON_CUSTOM_TITLE_BAR_GRID_CONFIGURATION = css`
  grid-template-rows: 1fr;
  grid-template-areas: '${TABS_AND_PROCESSES_GRID_AREA} ${EXPLORER_PANEL_GRID_AREA}';
`;

const RootContainer = styled(Box)`
  height: 100%;

  display: grid;
  grid-template-columns: 250px 1fr;
  ${useCustomTitleBar
    ? CUSTOM_TITLE_BAR_GRID_CONFIGURATION
    : NON_CUSTOM_TITLE_BAR_GRID_CONFIGURATION}
  grid-row-gap: var(--spacing-2);
  grid-column-gap: var(--spacing-4);

  ${() =>
    !useCustomTitleBar &&
    css`
      padding-top: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
    `}
  padding-right: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
  padding-left: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
`;

const TabsAndProcesses = styled(Box)`
  min-height: 0;
  height: 100%;
  max-height: 100%;
  grid-area: ${TABS_AND_PROCESSES_GRID_AREA};

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-4);
`;
