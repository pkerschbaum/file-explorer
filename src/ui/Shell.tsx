import * as React from 'react';
import { Box, Tabs, Tab, Button, IconButton, Tooltip } from '@mui/material';
import styled from '@mui/styled-engine';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { commonStyles } from '@app/ui/Common.styles';
import { Stack } from '@app/ui/layouts/Stack';
import { ExplorerPanelContainer } from '@app/ui/ExplorerPanelContainer';
import { ProcessCard } from '@app/ui/process/ProcessCard';
import { useExplorers, useFocusedExplorerId } from '@app/global-state/slices/explorers.hooks';
import { useProcesses } from '@app/global-state/slices/processes.hooks';
import {
  useAddExplorerPanel,
  useChangeFocusedExplorer,
  useRemoveExplorerPanel,
} from '@app/operations/app.hooks';
import { BACKGROUND_COLOR, tabIndicatorSpanClassName } from '@app/ui/theme';
import { KEYS } from '@app/ui/constants';
import { useWindowEvent } from '@app/ui/utils/react.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { arrays } from '@app/base/utils/arrays.util';
import { objects } from '@app/base/utils/objects.util';

export const Shell: React.FC = () => {
  const explorers = useExplorers();
  const focusedExplorerId = useFocusedExplorerId();
  const processes = useProcesses();

  const { addExplorerPanel } = useAddExplorerPanel();
  const { changeFocusedExplorer } = useChangeFocusedExplorer();
  const { removeExplorerPanel } = useRemoveExplorerPanel();

  // on mount, add first (initial) explorer panel
  React.useEffect(() => {
    void addExplorerPanel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function switchFocusedExplorer(direction: 'UP' | 'DOWN') {
    const focusedExplorerIdx = explorers.findIndex(
      (explorer) => explorer.explorerId === focusedExplorerId,
    );

    if (
      focusedExplorerIdx === -1 ||
      (direction === 'UP' && focusedExplorerIdx === 0) ||
      (direction === 'DOWN' && focusedExplorerIdx === explorers.length - 1)
    ) {
      return;
    }

    const explorerIdxToSwitchTo =
      direction === 'UP' ? focusedExplorerIdx - 1 : focusedExplorerIdx + 1;

    changeFocusedExplorer(explorers[explorerIdxToSwitchTo].explorerId);
  }

  useWindowEvent('keydown', [
    {
      condition: (e) => e.ctrlKey && e.key === KEYS.PAGE_UP,
      handler: () => switchFocusedExplorer('UP'),
    },
    {
      condition: (e) => e.ctrlKey && e.key === KEYS.PAGE_DOWN,
      handler: () => switchFocusedExplorer('DOWN'),
    },
    {
      condition: (e) => e.ctrlKey && e.key === KEYS.T,
      handler: addExplorerPanel,
    },
  ]);

  const explorersToShow = explorers.filter((explorer) => !explorer.scheduledToRemove);
  const removeExplorerActionDisabled = explorersToShow.length < 2;

  return (
    <RootContainer className="show-file-icons">
      <TabsArea direction="column" alignItems="stretch">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={focusedExplorerId}
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
        {focusedExplorerId !== undefined &&
          explorersToShow.map(({ explorerId }) => (
            <TabPanel key={explorerId} value={focusedExplorerId} index={explorerId}>
              <ExplorerPanelContainer explorerId={explorerId} />
            </TabPanel>
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

type TabPanelProps = {
  index: string;
  value: string;
  children: React.ReactNode;
};

const TabPanel: React.FC<TabPanelProps> = ({ value, index, children }) => {
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
