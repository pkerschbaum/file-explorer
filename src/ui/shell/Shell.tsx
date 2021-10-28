import { Box } from '@mui/material';
import { isWindows } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { useExplorerPanels } from '@app/global-state/slices/explorers.hooks';
import { addExplorerPanel } from '@app/operations/app.operations';
import { EXPLORER_ACTIONSBAR_GRID_AREA } from '@app/ui/actions-bar/ActionsBar';
import { EXPLORER_CWDBREADCRUMBS_GRID_AREA } from '@app/ui/cwd-breadcrumbs/CwdBreadcrumbs';
import { ExplorerPanel } from '@app/ui/explorer-panel/ExplorerPanel';
import { EXPLORER_FILESTABLE_GRID_AREA } from '@app/ui/files-table/FilesTable';
import { ROOTCONTAINER_PADDING_RIGHT_FACTOR } from '@app/ui/shell/constants';
import { ProcessesArea } from '@app/ui/shell/ProcessesArea';
import { TabsArea } from '@app/ui/shell/TabsArea';
import { TitleBar } from '@app/ui/shell/TitleBar';

export const Shell: React.FC = () => {
  const explorerPanels = useExplorerPanels();

  // on mount, add first (initial) explorer panel
  React.useEffect(() => {
    void addExplorerPanel();
  }, []);

  const explorersToShow = explorerPanels.filter((explorer) => !explorer.scheduledToRemove);

  return (
    <RootContainer>
      {isWindows && <TitleBar />}

      <TabsArea explorersToShow={explorersToShow} />

      {explorersToShow.map(({ explorerId }) => (
        <ExplorerPanel key={explorerId} explorerId={explorerId} />
      ))}

      <ProcessesArea />
    </RootContainer>
  );
};

const WINDOWS_GRID_CONFIGURATION = css`
  grid-template-rows: 28px max-content max-content 1fr max-content;
  grid-template-areas:
    'shell-title-bar shell-title-bar'
    'shell-explorer-tabs ${EXPLORER_CWDBREADCRUMBS_GRID_AREA}'
    'shell-explorer-tabs ${EXPLORER_ACTIONSBAR_GRID_AREA}'
    'shell-explorer-tabs ${EXPLORER_FILESTABLE_GRID_AREA}'
    'shell-processes shell-processes';
`;

const NON_WINDOWS_GRID_CONFIGURATION = css`
  grid-template-rows: max-content max-content 1fr max-content;
  grid-template-areas:
    'shell-explorer-tabs ${EXPLORER_CWDBREADCRUMBS_GRID_AREA}'
    'shell-explorer-tabs ${EXPLORER_ACTIONSBAR_GRID_AREA}'
    'shell-explorer-tabs ${EXPLORER_FILESTABLE_GRID_AREA}'
    'shell-processes shell-processes';
`;

const RootContainer = styled(Box)`
  height: 100%;

  display: grid;
  grid-template-columns: 200px 1fr;
  ${isWindows ? WINDOWS_GRID_CONFIGURATION : NON_WINDOWS_GRID_CONFIGURATION}
  grid-row-gap: ${(props) => props.theme.spacing(0.5)};
  grid-column-gap: ${(props) => props.theme.spacing(2)};
  padding-right: ${(props) => props.theme.spacing(ROOTCONTAINER_PADDING_RIGHT_FACTOR)};
`;
