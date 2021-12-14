import { isWindows } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { useExplorerPanels } from '@app/global-state/slices/explorers.hooks';
import { Box } from '@app/ui/components-library';
import {
  ExplorerPanel,
  EXPLORER_ACTIONSBAR_GRID_AREA,
  EXPLORER_CWDBREADCRUMBS_GRID_AREA,
  EXPLORER_RESOURCESTABLE_GRID_AREA,
} from '@app/ui/explorer-panel/ExplorerPanel';
import { ROOTCONTAINER_PADDING_FACTOR } from '@app/ui/shell/constants';
import { ProcessesArea } from '@app/ui/shell/ProcessesArea';
import { TabsArea } from '@app/ui/shell/TabsArea';
import { TitleBar, TITLE_BAR_GRID_AREA } from '@app/ui/shell/TitleBar';
import {
  UserPreferencesButton,
  UserPreferencesSidebar,
  USER_PREFERENCES_BUTTON_GRID_AREA,
  USER_PREFERENCES_SIDEBAR_GRID_AREA,
} from '@app/ui/user-preferences';

const useCustomTitleBar = isWindows;

export const Shell: React.FC = () => {
  const [userPreferencesSidebarOpen, setUserPreferencesSidebarOpen] = React.useState(false);

  const explorerPanels = useExplorerPanels();

  const explorersToShow = explorerPanels.filter((explorer) => !explorer.scheduledToRemove);

  return (
    <RootContainer userPreferencesSidebarOpen={userPreferencesSidebarOpen}>
      {useCustomTitleBar && <TitleBar />}

      <TabsAndProcesses>
        <TabsArea explorersToShow={explorersToShow} />
        <ProcessesArea />
      </TabsAndProcesses>

      {explorersToShow.map(({ explorerId }) => (
        <ExplorerPanel
          key={explorerId}
          explorerId={explorerId}
          customTitleBarUsed={useCustomTitleBar}
        />
      ))}

      <UserPreferencesButton
        userPreferencesSidebarOpen={userPreferencesSidebarOpen}
        setUserPreferencesSidebarOpen={setUserPreferencesSidebarOpen}
      />

      <UserPreferencesSidebar userPreferencesSidebarOpen={userPreferencesSidebarOpen} />
    </RootContainer>
  );
};

const CUSTOM_TITLE_BAR_GRID_CONFIGURATION = css<{ userPreferencesSidebarOpen: boolean }>`
  grid-template-rows: 28px max-content max-content 1fr max-content;
  grid-template-areas:
    '${TITLE_BAR_GRID_AREA} ${TITLE_BAR_GRID_AREA} ${TITLE_BAR_GRID_AREA} ${({
      userPreferencesSidebarOpen,
    }) => userPreferencesSidebarOpen && TITLE_BAR_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_CWDBREADCRUMBS_GRID_AREA} ${USER_PREFERENCES_BUTTON_GRID_AREA} ${({
      userPreferencesSidebarOpen,
    }) => userPreferencesSidebarOpen && USER_PREFERENCES_BUTTON_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_ACTIONSBAR_GRID_AREA} ${USER_PREFERENCES_BUTTON_GRID_AREA} ${({
      userPreferencesSidebarOpen,
    }) => userPreferencesSidebarOpen && USER_PREFERENCES_BUTTON_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_RESOURCESTABLE_GRID_AREA} ${EXPLORER_RESOURCESTABLE_GRID_AREA} ${({
      userPreferencesSidebarOpen,
    }) => userPreferencesSidebarOpen && USER_PREFERENCES_SIDEBAR_GRID_AREA}';
`;

const NON_CUSTOM_TITLE_BAR_GRID_CONFIGURATION = css<{ userPreferencesSidebarOpen: boolean }>`
  grid-template-rows: max-content max-content 1fr max-content;
  grid-template-areas:
    'shell-tabs-and-processes ${EXPLORER_CWDBREADCRUMBS_GRID_AREA} ${USER_PREFERENCES_BUTTON_GRID_AREA} ${({
      userPreferencesSidebarOpen,
    }) => userPreferencesSidebarOpen && USER_PREFERENCES_BUTTON_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_ACTIONSBAR_GRID_AREA} ${USER_PREFERENCES_BUTTON_GRID_AREA} ${({
      userPreferencesSidebarOpen,
    }) => userPreferencesSidebarOpen && USER_PREFERENCES_BUTTON_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_RESOURCESTABLE_GRID_AREA} ${EXPLORER_RESOURCESTABLE_GRID_AREA} ${({
      userPreferencesSidebarOpen,
    }) => userPreferencesSidebarOpen && USER_PREFERENCES_SIDEBAR_GRID_AREA}';
`;

const RootContainer = styled(Box)<{ userPreferencesSidebarOpen: boolean }>`
  height: 100%;

  display: grid;
  grid-template-columns: ${({ userPreferencesSidebarOpen }) =>
    userPreferencesSidebarOpen ? '250px 1fr max-content max-content' : '250px 1fr max-content'};
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
  padding-bottom: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
  padding-left: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
`;

const TabsAndProcesses = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-4);

  grid-area: shell-tabs-and-processes;
  overflow-y: auto;

  /* If a custom title bar is used, overlap the TabsArea with the WindowDragRegion above it */
  ${() => {
    if (useCustomTitleBar) {
      return css`
        margin-top: -24px;
        -webkit-app-region: no-drag;
      `;
    }
  }}

  /* 
   * Stretch to the end of the RootContainer (i.e., revert the padding-bottom of the RootContainer
   * via negative margin-bottom).
   * The goal is to get a more aesthetically pleasant overflow-y behavior: If the tabs and processes
   * are too many to fit into the TabsAndProcesses container, the resulting overflow will reach till
   * the lower border of the RootContainer.
   */
  margin-bottom: calc(-1 * ${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
`;
