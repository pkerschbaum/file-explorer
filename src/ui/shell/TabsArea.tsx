import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Tabs, Tab, Button, IconButton, Tooltip } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { objects } from '@app/base/utils/objects.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import {
  ExplorerPanelEntry,
  useIdOfFocusedExplorerPanel,
} from '@app/global-state/slices/explorers.hooks';
import {
  addExplorerPanel,
  changeFocusedExplorer,
  removeExplorerPanel,
} from '@app/operations/app.operations';
import { KEYS } from '@app/ui/constants';
import { Stack } from '@app/ui/layouts/Stack';
import { tabIndicatorSpanClassName } from '@app/ui/theme';
import { useWindowEvent } from '@app/ui/utils/react.util';

type TabsAreaProps = { explorersToShow: ExplorerPanelEntry[] };

export const TabsArea: React.FC<TabsAreaProps> = ({ explorersToShow }) => {
  const idOfFocusedExplorerPanel = useIdOfFocusedExplorerPanel();

  function switchFocusedExplorerPanel(direction: 'UP' | 'DOWN') {
    const focusedExplorerIdx = explorersToShow.findIndex(
      (explorer) => explorer.explorerId === idOfFocusedExplorerPanel,
    );

    if (
      focusedExplorerIdx === -1 ||
      (direction === 'UP' && focusedExplorerIdx === 0) ||
      (direction === 'DOWN' && focusedExplorerIdx === explorersToShow.length - 1)
    ) {
      return;
    }

    const explorerIdxToSwitchTo =
      direction === 'UP' ? focusedExplorerIdx - 1 : focusedExplorerIdx + 1;

    changeFocusedExplorer(explorersToShow[explorerIdxToSwitchTo].explorerId);
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

  const removeExplorerActionDisabled = explorersToShow.length < 2;

  return (
    <Stack direction="column" alignItems="stretch">
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
    </Stack>
  );
};

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
            <TabIconButton
              size="small"
              onClick={(e) => {
                // stop propagation so that the click on the close button does not get through to the button of the Tab
                e.stopPropagation();
                props.onRemove();
              }}
            >
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
  right: ${(props) => props.theme.spacing(1.5)};
`;

const TabIconButton = styled(IconButton)`
  border-radius: 0;
  padding: 0;
`;
