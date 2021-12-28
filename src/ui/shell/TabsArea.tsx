import * as React from 'react';
import styled from 'styled-components';

import { formatter } from '@app/base/utils/formatter.util';
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
  Box,
  ButtonHandle,
  Button,
  IconButton,
  Tabs,
  Tab,
  useTab,
  AddCircleOutlineOutlinedIcon,
  CloseOutlinedIcon,
} from '@app/ui/components-library';
import { KEY } from '@app/ui/constants';
import { useRegisterGlobalShortcuts } from '@app/ui/GlobalShortcutsContext';

type TabsAreaProps = { explorersToShow: ExplorerPanelEntry[] };

export const TabsArea: React.FC<TabsAreaProps> = ({ explorersToShow }) => {
  const idOfFocusedExplorerPanel = useIdOfFocusedExplorerPanel();

  const addTabButtonHandleRef = React.useRef<ButtonHandle>(null);
  const prevTabButtonHandleRef = React.useRef<ButtonHandle>(null);
  const nextTabButtonHandleRef = React.useRef<ButtonHandle>(null);

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
    await addExplorerPanel(focusedExplorer?.cwdSegments);
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
      handler: () => prevTabButtonHandleRef.current?.triggerSyntheticPress(),
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
      handler: () => nextTabButtonHandleRef.current?.triggerSyntheticPress(),
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
    <TabsAreaContainer>
      <Tabs selectedValue={idOfFocusedExplorerPanel} setSelectedValue={changeFocusedExplorer}>
        {explorersToShow.map((explorer, explorerIdx) => {
          const isFocusedExplorer = explorerIdx === focusedExplorerIdx;
          const isPrevExplorer = explorerIdx === explorerIdxPrevious;
          const isNextExplorer = explorerIdx === explorerIdxNext;

          const formattedUriSegments = formatter.uriSegments(
            explorer.cwdSegments.map((segment) => segment.uri),
          );
          const formattedUriSegmentToRender = formattedUriSegments[formattedUriSegments.length - 1];

          return (
            <Tab key={explorer.explorerId} value={explorer.explorerId}>
              <ExplorerTabContent
                value={explorer.explorerId}
                label={formattedUriSegmentToRender}
                buttonHandleRef={
                  isPrevExplorer
                    ? prevTabButtonHandleRef
                    : isNextExplorer
                    ? nextTabButtonHandleRef
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
            </Tab>
          );
        })}
      </Tabs>
      <Button
        handleRef={addTabButtonHandleRef}
        onPress={duplicateFocusedExplorerPanel}
        startIcon={<AddCircleOutlineOutlinedIcon />}
        endIcon={registerShortcutsResult.addNewTabShortcut.icon}
        enableLayoutAnimation
      >
        Add tab
      </Button>
    </TabsAreaContainer>
  );
};

const TabsAreaContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
`;

type ExplorerTabContentProps = {
  value: string;
  label: string;
  buttonHandleRef?: React.RefObject<ButtonHandle>;
  buttonEndIcon?: React.ReactNode;
  onRemove: () => void;
  removeExplorerActionDisabled: boolean;
};

const ExplorerTabContent: React.FC<ExplorerTabContentProps> = (props) => {
  const { onSelect } = useTab({ value: props.value });

  return (
    <>
      <TabButton onPress={onSelect} handleRef={props.buttonHandleRef} endIcon={props.buttonEndIcon}>
        {props.label}
      </TabButton>
      {!props.removeExplorerActionDisabled && (
        <TabIconButton
          size="sm"
          aria-label="Close Tab"
          tooltipContent="Close Tab"
          tooltipPlacement="right"
          onPress={props.onRemove}
          disablePadding
        >
          <CloseOutlinedIcon />
        </TabIconButton>
      )}
    </>
  );
};

const TabButton = styled(Button)`
  width: 100%;
  justify-content: start;
  text-align: start;
  /* make some space on the right side available for the (absolutely positioned) TabCloseButton */
  padding-right: var(--spacing-8);
`;

const TabIconButton = styled(IconButton)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: var(--spacing-2);
  margin-block: auto;
  height: fit-content;

  border-radius: 0;
`;
