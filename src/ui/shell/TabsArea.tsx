import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import * as React from 'react';
import styled from 'styled-components';

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
import {
  ActionButton,
  ActionButtonRef,
  IconButton,
  Stack,
  Tab,
  tabIndicatorSpanClassName,
  Tabs,
  Tooltip,
} from '@app/ui/components-library';
import { KEY } from '@app/ui/constants';
import { useRegisterGlobalShortcuts } from '@app/ui/GlobalShortcutsContext';

type TabsAreaProps = { explorersToShow: ExplorerPanelEntry[] };

export const TabsArea: React.FC<TabsAreaProps> = ({ explorersToShow }) => {
  const idOfFocusedExplorerPanel = useIdOfFocusedExplorerPanel();

  const addTabButtonRef = React.useRef<ActionButtonRef>(null);
  const prevTabButtonRef = React.useRef<ActionButtonRef>(null);
  const nextTabButtonRef = React.useRef<ActionButtonRef>(null);

  const focusedExplorer = explorersToShow.find(
    (explorer) => explorer.explorerId === idOfFocusedExplorerPanel,
  );
  const focusedExplorerIdx = explorersToShow.findIndex(
    (explorer) => explorer.explorerId === idOfFocusedExplorerPanel,
  );
  const explorerIdxPrevious = focusedExplorerIdx === 0 ? undefined : focusedExplorerIdx - 1;
  const explorerIdxNext =
    focusedExplorerIdx === explorersToShow.length - 1 ? undefined : focusedExplorerIdx + 1;
  const previousExplorer =
    explorerIdxPrevious === undefined ? undefined : explorersToShow[explorerIdxPrevious];

  async function duplicateFocusedExplorerPanel() {
    await addExplorerPanel(focusedExplorer?.cwd);
  }

  const registerShortcutsResult = useRegisterGlobalShortcuts({
    changeToPrevTabShortcut: {
      keybindings: [
        {
          key: KEY.ARROW_UP,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'SET',
          },
        },
      ],
      handler: () => prevTabButtonRef.current?.triggerSyntheticClick(),
    },
    changeToNextTabShortcut: {
      keybindings: [
        {
          key: KEY.ARROW_DOWN,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'SET',
          },
        },
      ],
      handler: () => nextTabButtonRef.current?.triggerSyntheticClick(),
    },
    addNewTabShortcut: {
      keybindings: [
        {
          key: KEY.T,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'SET',
          },
        },
      ],
      handler: duplicateFocusedExplorerPanel,
    },
  });

  const removeExplorerActionDisabled = explorersToShow.length < 2;

  return (
    <Stack direction="column" alignItems="stretch">
      <Tabs
        orientation="vertical"
        value={idOfFocusedExplorerPanel}
        onChange={(_, newValue: string) => changeFocusedExplorer(newValue)}
        TabIndicatorProps={{ children: <span className={tabIndicatorSpanClassName} /> }}
      >
        {explorersToShow.map((explorer, explorerIdx) => {
          const isFocusedExplorer = explorerIdx === focusedExplorerIdx;
          const isPrevExplorer = explorerIdx === explorerIdxPrevious;
          const isNextExplorer = explorerIdx === explorerIdxNext;

          const uriSlugs = uriHelper.splitUriIntoSlugs(explorer.cwd);
          const uriSlugToRender = uriSlugs[uriSlugs.length - 1];

          return (
            <Tab
              key={explorer.explorerId}
              component="div"
              disableRipple
              label={
                <ExplorerPanelTab
                  label={uriSlugToRender.formatted}
                  buttonRef={
                    isPrevExplorer
                      ? prevTabButtonRef
                      : isNextExplorer
                      ? nextTabButtonRef
                      : undefined
                  }
                  buttonEndIcon={
                    isPrevExplorer
                      ? registerShortcutsResult.changeToPrevTabShortcut.icon
                      : isNextExplorer
                      ? registerShortcutsResult.changeToNextTabShortcut.icon
                      : undefined
                  }
                  onRemove={() =>
                    removeExplorerPanel(
                      explorer.explorerId,
                      !isFocusedExplorer ? undefined : previousExplorer?.explorerId,
                    )
                  }
                  removeExplorerActionDisabled={removeExplorerActionDisabled}
                />
              }
              value={explorer.explorerId}
            />
          );
        })}
      </Tabs>
      <ActionButton
        ref={addTabButtonRef}
        onClick={duplicateFocusedExplorerPanel}
        StartIconComponent={AddCircleOutlineOutlinedIcon}
        endIcon={registerShortcutsResult.addNewTabShortcut.icon}
      >
        Add tab
      </ActionButton>
    </Stack>
  );
};

type ExplorerPanelTabProps = {
  label: string;
  buttonRef?: React.Ref<ActionButtonRef>;
  buttonEndIcon?: React.ReactNode;
  onRemove: () => void;
  removeExplorerActionDisabled: boolean;
};

const ExplorerPanelTab: React.FC<ExplorerPanelTabProps> = (props) => {
  return (
    <>
      <ActionButton
        ref={props.buttonRef}
        endIcon={props.buttonEndIcon}
        disableLayoutAnimation
        sx={{
          width: '100%',
          justifyContent: 'start',
          textAlign: 'start',
          // make some space on the right side available for the (absolutely positioned) TabCloseButton
          paddingRight: (theme) => theme.spacing(4.5),
        }}
      >
        {props.label}
      </ActionButton>
      {!props.removeExplorerActionDisabled && (
        <Tooltip title="Close Tab">
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
        </Tooltip>
      )}
    </>
  );
};

const TabIconButton = styled(IconButton)`
  position: absolute;
  right: ${(props) => props.theme.spacing(1.5)};
  border-radius: 0;
  padding: 0;
`;
