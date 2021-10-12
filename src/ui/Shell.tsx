import * as React from 'react';
import { Box, Tabs, Tab, Button, IconButton, Tooltip } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { styles } from '@app/ui/Shell.styles';
import { commonStyles } from '@app/ui/Common.styles';
import { Stack } from '@app/ui/layouts/Stack';
import { ExplorerPanelContainer } from '@app/ui/ExplorerPanelContainer';
import { ProcessCard } from '@app/ui/process/ProcessCard';
import {
  useFileProviderExplorers,
  useFileProviderFocusedExplorerId,
  useFileProviderProcesses,
} from '@app/platform/store/file-provider/file-provider.hooks';
import {
  useAddExplorerPanel,
  useChangeFocusedExplorer,
  useRemoveExplorerPanel,
} from '@app/platform/app.hooks';
import { tabIndicatorSpanClassName } from '@app/ui/theme';
import { KEYS } from '@app/ui/constants';
import { useWindowEvent } from '@app/ui/utils/react.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { arrays } from '@app/base/utils/arrays.util';
import { objects } from '@app/base/utils/objects.util';

export const Shell: React.FC = () => {
  const explorers = useFileProviderExplorers();
  const focusedExplorerId = useFileProviderFocusedExplorerId();
  const processes = useFileProviderProcesses();

  const { addExplorerPanel } = useAddExplorerPanel();
  const { changeFocusedExplorer } = useChangeFocusedExplorer();
  const { removeExplorerPanel } = useRemoveExplorerPanel();

  // on mount, add first (initial) explorer panel
  React.useEffect(() => {
    addExplorerPanel();
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
    <Box className="show-file-icons" css={[styles.container, commonStyles.fullHeight]}>
      <Stack css={styles.tabsArea} direction="column" alignItems="stretch">
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
      </Stack>

      <Box
        css={[
          styles.activeExplorerArea,
          commonStyles.fullHeight,
          commonStyles.flex.shrinkAndFitHorizontal,
        ]}
      >
        {focusedExplorerId !== undefined &&
          explorersToShow.map(({ explorerId }) => (
            <TabPanel key={explorerId} value={focusedExplorerId} index={explorerId}>
              <ExplorerPanelContainer explorerId={explorerId} />
            </TabPanel>
          ))}
      </Box>

      {processes.length > 0 && (
        <Stack
          css={[styles.processesArea, commonStyles.flex.disableShrinkChildren]}
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
        </Stack>
      )}
    </Box>
  );
};

type ExplorerPanelTabProps = {
  label: string;
  removeExplorerActionDisabled: boolean;
  onRemove: () => void;
};

const ExplorerPanelTab = React.memo<ExplorerPanelTabProps>(function ExplorerPanelTab(props) {
  return (
    <Button css={commonStyles.fullWidth} component="div">
      <Stack css={commonStyles.fullWidth} justifyContent="space-between">
        <Box component="span">{props.label}</Box>
        <Tooltip title={props.removeExplorerActionDisabled ? '' : 'Close tab'}>
          <Box component="span">
            <IconButton
              css={styles.tabIconButton}
              size="small"
              disabled={props.removeExplorerActionDisabled}
              onClick={(e) => {
                e.stopPropagation();
                props.onRemove();
              }}
            >
              <CloseOutlinedIcon />
            </IconButton>
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
  return (
    <Box
      css={[
        commonStyles.overlayChild,
        commonStyles.fullHeight,
        commonStyles.fullWidth,
        value !== index ? commonStyles.hidden : undefined,
      ]}
    >
      {children}
    </Box>
  );
};
