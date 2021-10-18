import * as React from 'react';
import { Box, Tabs, Tab, Button, IconButton, Tooltip } from '@mui/material';
import styled from '@mui/styled-engine';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { commonStyles } from '@app/ui/Common.styles';
import { Stack } from '@app/ui/layouts/Stack';
import { ExplorerPanelContainer } from '@app/ui/ExplorerPanelContainer';
import { ProcessCard } from '@app/ui/process/ProcessCard';
import {
  useExplorerPanels,
  useIdOfFocusedExplorerPanel,
} from '@app/global-state/slices/explorers.hooks';
import { useProcesses } from '@app/global-state/slices/processes.hooks';
import {
  addExplorerPanel,
  changeFocusedExplorer,
  removeExplorerPanel,
} from '@app/operations/app.operations';
import { BACKGROUND_COLOR, tabIndicatorSpanClassName } from '@app/ui/theme';
import { KEYS } from '@app/ui/constants';
import { useWindowEvent } from '@app/ui/utils/react.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { arrays } from '@app/base/utils/arrays.util';
import { objects } from '@app/base/utils/objects.util';

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
        <Button onClick={addExplorerPanel}>
          <Stack>
            <AddCircleOutlineOutlinedIcon fontSize="small" />
            Add tab
          </Stack>
        </Button>
      </TabsArea>

      <ActiveExplorerArea>
        {idOfFocusedExplorerPanel !== undefined &&
          explorersToShow.map(({ explorerId }) => (
            <HiddenIfInactiveTabPanel
              key={explorerId}
              value={idOfFocusedExplorerPanel}
              index={explorerId}
            >
              <ExplorerPanelContainer explorerId={explorerId} />
            </HiddenIfInactiveTabPanel>
          ))}
      </ActiveExplorerArea>

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

type ExplorerPanelTabProps = {
  label: string;
  removeExplorerActionDisabled: boolean;
  onRemove: () => void;
};

const ExplorerPanelTab = React.memo<ExplorerPanelTabProps>(function ExplorerPanelTab(props) {
  return (
    <Button component="div" sx={{ width: '100%' }}>
      <Stack justifyContent="space-between" sx={{ width: '100%' }}>
        <Box component="span">{props.label}</Box>
        <Tooltip title={props.removeExplorerActionDisabled ? '' : 'Close tab'}>
          <Box component="span">
            <TabIconButton
              size="small"
              disabled={props.removeExplorerActionDisabled}
              onClick={(e) => {
                e.stopPropagation();
                props.onRemove();
              }}
            >
              <CloseOutlinedIcon />
            </TabIconButton>
          </Box>
        </Tooltip>
      </Stack>
    </Button>
  );
}, objects.shallowIsEqualIgnoreFunctions);

type HiddenIfInactiveTabPanelProps = {
  index: string;
  value: string;
  children: React.ReactNode;
};

const HiddenIfInactiveTabPanel: React.FC<HiddenIfInactiveTabPanelProps> = ({
  value,
  index,
  children,
}) => {
  return <OverlayTabPanel panelHidden={value !== index}>{children}</OverlayTabPanel>;
};

const RootContainer = styled(Box)`
  height: 100%;
  background-color: ${BACKGROUND_COLOR};
  padding-top: ${(props) => props.theme.spacing()};

  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr max-content;
  grid-template-areas:
    'explorer-tabs active-explorer-panel'
    'processes processes';
  grid-column-gap: ${(props) => props.theme.spacing()};
`;

const TabsArea = styled(Stack)`
  grid-area: explorer-tabs;
  padding-top: ${(props) => props.theme.spacing()};
  padding-bottom: ${(props) => props.theme.spacing()};
  padding-left: ${(props) => props.theme.spacing()};
`;

const ActiveExplorerArea = styled(Box)`
  height: 100%;
  grid-area: active-explorer-panel;
  padding-top: ${(props) => props.theme.spacing(0.5)};
  padding-right: ${(props) => props.theme.spacing()};
  padding-bottom: ${(props) => props.theme.spacing(2)};

  ${commonStyles.flex.shrinkAndFitHorizontal}
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

const OverlayTabPanel = styled(Box)<{ panelHidden: boolean }>`
  height: 100%;
  width: 100%;
  grid-column: 1;
  grid-row: 1;

  display: ${(props) => props.panelHidden && 'none'};
`;
