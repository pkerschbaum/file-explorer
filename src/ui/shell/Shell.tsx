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
import {
  ROOTCONTAINER_PADDING_BOTTOM_FACTOR,
  ROOTCONTAINER_PADDING_LEFT_FACTOR,
  ROOTCONTAINER_PADDING_RIGHT_FACTOR,
} from '@app/ui/shell/constants';
import { ProcessesArea } from '@app/ui/shell/ProcessesArea';
import { TabsArea } from '@app/ui/shell/TabsArea';
import { TitleBar, TITLE_BAR_GRID_AREA } from '@app/ui/shell/TitleBar';
import {
  UserPreferencesButton,
  UserPreferencesSidebar,
  USER_PREFERENCES_BUTTON_GRID_AREA,
  USER_PREFERENCES_SIDEBAR_GRID_AREA,
} from '@app/ui/user-preferences';

export const Shell: React.FC = () => {
  const [userPreferencesSidebarOpen, setUserPreferencesSidebarOpen] = React.useState(false);

  const explorerPanels = useExplorerPanels();

  const explorersToShow = explorerPanels.filter((explorer) => !explorer.scheduledToRemove);

  return (
    <RootContainer userPreferencesSidebarOpen={userPreferencesSidebarOpen}>
      {isWindows && <TitleBar />}

      <TabsAndProcesses>
        <TabsArea explorersToShow={explorersToShow} />
        <ProcessesArea />
      </TabsAndProcesses>

      {explorersToShow.map(({ explorerId }) => (
        <ExplorerPanel key={explorerId} explorerId={explorerId} />
      ))}

      <UserPreferencesButton
        userPreferencesSidebarOpen={userPreferencesSidebarOpen}
        setUserPreferencesSidebarOpen={setUserPreferencesSidebarOpen}
      />

      <UserPreferencesSidebar userPreferencesSidebarOpen={userPreferencesSidebarOpen} />
    </RootContainer>
  );
};

const WINDOWS_GRID_CONFIGURATION = (userPreferencesSidebarOpen: boolean) => css`
  grid-template-rows: 28px max-content max-content 1fr max-content;
  grid-template-areas:
    '${TITLE_BAR_GRID_AREA} ${TITLE_BAR_GRID_AREA} ${TITLE_BAR_GRID_AREA} ${userPreferencesSidebarOpen &&
    TITLE_BAR_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_CWDBREADCRUMBS_GRID_AREA} ${USER_PREFERENCES_BUTTON_GRID_AREA} ${userPreferencesSidebarOpen &&
    USER_PREFERENCES_BUTTON_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_ACTIONSBAR_GRID_AREA} ${USER_PREFERENCES_BUTTON_GRID_AREA} ${userPreferencesSidebarOpen &&
    USER_PREFERENCES_BUTTON_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_RESOURCESTABLE_GRID_AREA} ${EXPLORER_RESOURCESTABLE_GRID_AREA} ${userPreferencesSidebarOpen &&
    USER_PREFERENCES_SIDEBAR_GRID_AREA}';
`;

const NON_WINDOWS_GRID_CONFIGURATION = (userPreferencesSidebarOpen: boolean) => css`
  grid-template-rows: max-content max-content 1fr max-content;
  grid-template-areas:
    'shell-tabs-and-processes ${EXPLORER_CWDBREADCRUMBS_GRID_AREA} ${USER_PREFERENCES_BUTTON_GRID_AREA} ${userPreferencesSidebarOpen &&
    USER_PREFERENCES_BUTTON_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_ACTIONSBAR_GRID_AREA} ${USER_PREFERENCES_BUTTON_GRID_AREA} ${userPreferencesSidebarOpen &&
    USER_PREFERENCES_BUTTON_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_RESOURCESTABLE_GRID_AREA} ${EXPLORER_RESOURCESTABLE_GRID_AREA} ${userPreferencesSidebarOpen &&
    USER_PREFERENCES_SIDEBAR_GRID_AREA}';
`;

const RootContainer = styled(Box)<{ userPreferencesSidebarOpen: boolean }>`
  height: 100%;

  display: grid;
  grid-template-columns: ${({ userPreferencesSidebarOpen }) =>
    userPreferencesSidebarOpen ? '250px 1fr max-content max-content' : '250px 1fr max-content'};
  ${({ userPreferencesSidebarOpen }) =>
    isWindows
      ? WINDOWS_GRID_CONFIGURATION(userPreferencesSidebarOpen)
      : NON_WINDOWS_GRID_CONFIGURATION(userPreferencesSidebarOpen)}
  grid-row-gap: ${(props) => props.theme.spacing(0.5)};
  grid-column-gap: ${(props) => props.theme.spacing(2)};
  padding-left: ${(props) => props.theme.spacing(ROOTCONTAINER_PADDING_LEFT_FACTOR)};
  padding-right: ${(props) => props.theme.spacing(ROOTCONTAINER_PADDING_RIGHT_FACTOR)};
  padding-bottom: ${(props) => props.theme.spacing(ROOTCONTAINER_PADDING_BOTTOM_FACTOR)};
`;

const TabsAndProcesses = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--spacing-4);

  grid-area: shell-tabs-and-processes;
  overflow-y: auto;

  /* Overlap the TabsArea with the WindowDragRegion above it */
  margin-top: -20px;
  -webkit-app-region: no-drag;

  /* 
   * Stretch to the end of the RootContainer (i.e., revert the padding-bottom of the RootContainer
   * via negative margin-bottom).
   * The goal is to get a more aesthetically pleasant overflow-y behavior: If the tabs and processes
   * are too many to fit into the TabsAndProcesses container, the resulting overflow will reach till
   * the lower border of the RootContainer.
   */
  margin-bottom: ${(props) => props.theme.spacing(-ROOTCONTAINER_PADDING_BOTTOM_FACTOR)};
`;
