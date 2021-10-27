import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import MinimizeOutlinedIcon from '@mui/icons-material/MinimizeOutlined';
import { Box, Tabs, Tab, Button, IconButton, Tooltip } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { arrays } from '@app/base/utils/arrays.util';
import { objects } from '@app/base/utils/objects.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import {
  useExplorerPanels,
  useIdOfFocusedExplorerPanel,
} from '@app/global-state/slices/explorers.hooks';
import { useProcesses } from '@app/global-state/slices/processes.hooks';
import {
  addExplorerPanel,
  changeFocusedExplorer,
  removeExplorerPanel,
  windowClose,
  windowMinimize,
  windowToggleMaximized,
} from '@app/operations/app.operations';
import { KEYS } from '@app/ui/constants';
import { BREADCRUMBS_GRID_AREA } from '@app/ui/cwd-breadcrumbs/CwdBreadcrumbs';
import { EXPLORERACTIONS_GRID_AREA } from '@app/ui/explorer-actions/ExplorerActions';
import { ExplorerPanelContainer } from '@app/ui/ExplorerPanelContainer';
import { EXPLORERPANELFILES_GRID_AREA } from '@app/ui/files-table/FilesTable';
import { Stack } from '@app/ui/layouts/Stack';
import { ProcessCard } from '@app/ui/process/ProcessCard';
import { tabIndicatorSpanClassName } from '@app/ui/theme';
import { useWindowEvent } from '@app/ui/utils/react.util';

export const Shell: React.FC = () => {
  const explorerPanels = useExplorerPanels();
  const idOfFocusedExplorerPanel = useIdOfFocusedExplorerPanel();
  const processes = useProcesses();

  // on mount, add first (initial) explorer panel
  React.useEffect(() => {
    void addExplorerPanel();
  }, []);

  function switchFocusedExplorerPanel(direction: 'UP' | 'DOWN') {
    const focusedExplorerIdx = explorerPanels.findIndex(
      (explorer) => explorer.explorerId === idOfFocusedExplorerPanel,
    );

    if (
      focusedExplorerIdx === -1 ||
      (direction === 'UP' && focusedExplorerIdx === 0) ||
      (direction === 'DOWN' && focusedExplorerIdx === explorerPanels.length - 1)
    ) {
      return;
    }

    const explorerIdxToSwitchTo =
      direction === 'UP' ? focusedExplorerIdx - 1 : focusedExplorerIdx + 1;

    changeFocusedExplorer(explorerPanels[explorerIdxToSwitchTo].explorerId);
  }

  useWindowEvent('keydown', [
    {
      condition: (e) => e.ctrlKey && e.key === KEYS.PAGE_UP,
      handler: () => switchFocusedExplorerPanel('UP'),
    },
    {
      condition: (e) => e.ctrlKey && e.key === KEYS.PAGE_DOWN,
      handler: () => switchFocusedExplorerPanel('DOWN'),
    },
    {
      condition: (e) => e.ctrlKey && e.key === KEYS.T,
      handler: addExplorerPanel,
    },
  ]);

  const explorersToShow = explorerPanels.filter((explorer) => !explorer.scheduledToRemove);
  const removeExplorerActionDisabled = explorersToShow.length < 2;

  return (
    <RootContainer>
      <TitleBar />

      <TabsArea direction="column" alignItems="stretch">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={idOfFocusedExplorerPanel}
          onChange={(_, newValue) => changeFocusedExplorer(newValue)}
          TabIndicatorProps={{ children: <span className={tabIndicatorSpanClassName} /> }}
        >
          {explorersToShow.map((explorer) => (
            <Tab
              key={explorer.explorerId}
              component="div"
              disableRipple
              label={
                <ExplorerPanelTab
                  label={uriHelper.extractNameAndExtension(explorer.cwd).fileName}
                  removeExplorerActionDisabled={removeExplorerActionDisabled}
                  onRemove={() => removeExplorerPanel(explorer.explorerId)}
                />
              }
              value={explorer.explorerId}
            />
          ))}
        </Tabs>
        <Button onClick={addExplorerPanel} startIcon={<AddCircleOutlineOutlinedIcon />}>
          Add tab
        </Button>
      </TabsArea>

      {idOfFocusedExplorerPanel !== undefined &&
        explorersToShow.map(({ explorerId }) => (
          <ExplorerPanelContainer key={explorerId} explorerId={explorerId} />
        ))}

      {processes.length > 0 && (
        <ProcessesArea
          spacing={2}
          alignItems="flex-start"
          boxProps={{
            onKeyDown: (e) => {
              // stop propagation so that global navigation handlers do not fire when interacting with processes using the keyboard
              e.stopPropagation();
            },
          }}
        >
          {arrays.reverse(processes).map((process) => (
            <ProcessCard key={process.id} process={process} />
          ))}
        </ProcessesArea>
      )}
    </RootContainer>
  );
};

const TitleBar: React.FC = () => {
  return (
    <TitleBarContainer justifyContent="end">
      <TitleBarWindowControls spacing={0} alignItems="stretch">
        <TitleBarButton onClick={windowMinimize}>
          <MinimizeOutlinedIcon />
        </TitleBarButton>
        <TitleBarButton onClick={windowToggleMaximized}>
          <FullscreenOutlinedIcon />
        </TitleBarButton>
        <TitleBarCloseButton onClick={windowClose}>
          <CloseOutlinedIcon />
        </TitleBarCloseButton>
      </TitleBarWindowControls>
    </TitleBarContainer>
  );
};

const TitleBarContainer = styled(Stack)`
  grid-area: titlebar;

  /* https://www.electronjs.org/docs/latest/tutorial/window-customization#set-custom-draggable-region */
  -webkit-app-region: drag;
`;

const TitleBarWindowControls = styled(Stack)`
  height: 100%;
  justify-self: end;

  /* hide overflow because of the -1px margin trick applied on the last TitleBarButton to eliminate dead click space */
  overflow: hidden;

  /* https://www.electronjs.org/docs/latest/tutorial/window-customization#set-custom-draggable-region */
  -webkit-app-region: no-drag;
`;

const TitleBarButton = styled(Button)`
  min-width: 0;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;
  color: inherit;
  background-color: inherit;
  cursor: default;

  &:last-of-type {
    /* add 1px of negative margin in the top right corner because otherwise, some subtle dead click space is there */
    margin-top: -1px;
    margin-right: -1px;
  }
`;

const TitleBarCloseButton = styled(TitleBarButton)`
  &:hover {
    background-color: ${(props) => props.theme.palette.error.main};
  }
`;

type ExplorerPanelTabProps = {
  label: string;
  removeExplorerActionDisabled: boolean;
  onRemove: () => void;
};

const ExplorerPanelTab = React.memo<ExplorerPanelTabProps>(function ExplorerPanelTab(props) {
  return (
    <>
      <Button
        sx={{
          width: '100%',
          justifyContent: 'start',
          textAlign: 'start',
          // make some space on the right side available for the (absolutely positioned) TabCloseButton
          paddingRight: (theme) => theme.spacing(4.5),
        }}
      >
        {props.label}
      </Button>
      {!props.removeExplorerActionDisabled && (
        <Tooltip title="Close tab">
          <TabCloseButton>
            <TabIconButton size="small" onClick={props.onRemove}>
              <CloseOutlinedIcon />
            </TabIconButton>
          </TabCloseButton>
        </Tooltip>
      )}
    </>
  );
}, objects.shallowIsEqualIgnoreFunctions);

const TabCloseButton = styled.span`
  position: absolute;
  right: ${(props) => props.theme.spacing()};
`;

const RootContainer = styled(Box)`
  height: 100%;

  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 28px max-content max-content 1fr max-content;
  grid-template-areas:
    'titlebar titlebar'
    'explorer-tabs ${BREADCRUMBS_GRID_AREA}'
    'explorer-tabs ${EXPLORERACTIONS_GRID_AREA}'
    'explorer-tabs ${EXPLORERPANELFILES_GRID_AREA}'
    'processes processes';
  grid-row-gap: ${(props) => props.theme.spacing(0.5)};
  grid-column-gap: ${(props) => props.theme.spacing(2)};
`;

const TabsArea = styled(Stack)`
  grid-area: explorer-tabs;
  padding-top: ${(props) => props.theme.spacing(0.5)};
  padding-bottom: ${(props) => props.theme.spacing()};
  padding-left: ${(props) => props.theme.spacing()};
`;

const ProcessesArea = styled(Stack)`
  padding-bottom: ${(props) => props.theme.spacing()};
  grid-area: processes;
  overflow-x: auto;

  & > *:first-of-type {
    margin-left: ${(props) => props.theme.spacing()};
  }
  & > *:last-of-type {
    margin-right: ${(props) => props.theme.spacing()};
  }

  & > * {
    flex-shrink: 0;
  }
`;

const TabIconButton = styled(IconButton)`
  border-radius: 0;
  padding: 0;
`;
