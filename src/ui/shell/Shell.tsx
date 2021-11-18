import { Box } from '@mui/material';
import { isWindows } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { useExplorerPanels } from '@app/global-state/slices/explorers.hooks';
import {
  ExplorerPanel,
  EXPLORER_ACTIONSBAR_GRID_AREA,
  EXPLORER_CWDBREADCRUMBS_GRID_AREA,
  EXPLORER_RESOURCESTABLE_GRID_AREA,
} from '@app/ui/explorer-panel/ExplorerPanel';
import { Stack } from '@app/ui/layouts/Stack';
import {
  ROOTCONTAINER_PADDING_LEFT_FACTOR,
  ROOTCONTAINER_PADDING_RIGHT_FACTOR,
} from '@app/ui/shell/constants';
import { ProcessesArea } from '@app/ui/shell/ProcessesArea';
import { TabsArea } from '@app/ui/shell/TabsArea';
import { TitleBar } from '@app/ui/shell/TitleBar';

export const Shell: React.FC = () => {
  const explorerPanels = useExplorerPanels();

  const explorersToShow = explorerPanels.filter((explorer) => !explorer.scheduledToRemove);

  return (
    <RootContainer>
      {isWindows && <TitleBar />}

      <TabsAndProcesses
        direction="column"
        justifyContent="space-between"
        alignItems="stretch"
        spacing={2}
      >
        <TabsArea explorersToShow={explorersToShow} />
        <ProcessesArea />
      </TabsAndProcesses>

      {explorersToShow.map(({ explorerId }) => (
        <ExplorerPanel key={explorerId} explorerId={explorerId} />
      ))}
    </RootContainer>
  );
};

const WINDOWS_GRID_CONFIGURATION = css`
  grid-template-rows: 28px max-content max-content 1fr max-content;
  grid-template-areas:
    'shell-title-bar shell-title-bar'
    'shell-tabs-and-processes ${EXPLORER_CWDBREADCRUMBS_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_ACTIONSBAR_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_RESOURCESTABLE_GRID_AREA}';
`;

const NON_WINDOWS_GRID_CONFIGURATION = css`
  grid-template-rows: max-content max-content 1fr max-content;
  grid-template-areas:
    'shell-tabs-and-processes ${EXPLORER_CWDBREADCRUMBS_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_ACTIONSBAR_GRID_AREA}'
    'shell-tabs-and-processes ${EXPLORER_RESOURCESTABLE_GRID_AREA}';
`;

const RootContainer = styled(Box)`
  height: 100%;

  display: grid;
  grid-template-columns: 250px 1fr;
  ${isWindows ? WINDOWS_GRID_CONFIGURATION : NON_WINDOWS_GRID_CONFIGURATION}
  grid-row-gap: ${(props) => props.theme.spacing(0.5)};
  grid-column-gap: ${(props) => props.theme.spacing(2)};
  padding-left: ${(props) => props.theme.spacing(ROOTCONTAINER_PADDING_LEFT_FACTOR)};
  padding-right: ${(props) => props.theme.spacing(ROOTCONTAINER_PADDING_RIGHT_FACTOR)};
  padding-bottom: ${(props) => props.theme.spacing()};
`;

const TabsAndProcesses = styled(Stack)`
  grid-area: shell-tabs-and-processes;

  /* Overlap the TabsArea with the WindowDragRegion above it */
  margin-top: -20px;
  -webkit-app-region: no-drag;
`;
