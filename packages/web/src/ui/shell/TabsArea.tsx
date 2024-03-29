import * as React from 'react';
import { styled } from 'styled-components';
import invariant from 'tiny-invariant';

import { formatter as formatter2 } from '@file-explorer/code-oss-ecma/formatter.util';

import type { ExplorerPanelEntry } from '#pkg/global-state/slices/explorers.hooks';
import {
  extractCwdSegmentsFromExplorerPanel,
  useIdOfFocusedExplorerPanel,
} from '#pkg/global-state/slices/explorers.hooks';
import {
  addExplorerPanel,
  changeFocusedExplorer,
  removeExplorerPanel,
} from '#pkg/operations/app.operations';
import type { ButtonHandle } from '#pkg/ui/components-library';
import {
  Box,
  Button,
  IconButton,
  Tabs,
  Tab,
  useTab,
  AddCircleOutlineOutlinedIcon,
  CloseOutlinedIcon,
} from '#pkg/ui/components-library';
import { PRINTED_KEY } from '#pkg/ui/constants';
import { useRegisterGlobalShortcuts } from '#pkg/ui/GlobalShortcutsContext';

type TabsAreaProps = {
  explorersToShow: ExplorerPanelEntry[];
};

export const TabsArea: React.FC<TabsAreaProps> = ({ explorersToShow }) => {
  const idOfFocusedExplorerPanel = useIdOfFocusedExplorerPanel();

  const addTabButtonHandleRef = React.useRef<ButtonHandle>(null);

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
    await addExplorerPanel(
      focusedExplorer ? extractCwdSegmentsFromExplorerPanel(focusedExplorer) : undefined,
    );
  }

  const registerShortcutsResult = useRegisterGlobalShortcuts({
    addNewTabShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.T,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'SET',
          },
        },
      ],
      handler: () => addTabButtonHandleRef.current?.triggerSyntheticPress(),
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

          const formattedUriSegments = formatter2.uriSegments(
            extractCwdSegmentsFromExplorerPanel(explorer).map((segment) => segment.uri),
          );
          const formattedUriSegmentToRender = formattedUriSegments.at(-1);
          invariant(formattedUriSegmentToRender);

          return (
            <Tab key={explorer.explorerId} value={explorer.explorerId}>
              <ExplorerTabContent
                value={explorer.explorerId}
                label={formattedUriSegmentToRender}
                isFocusedExplorer={isFocusedExplorer}
                isPrevExplorer={isPrevExplorer}
                isNextExplorer={isNextExplorer}
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
  isFocusedExplorer: boolean;
  isPrevExplorer: boolean;
  isNextExplorer: boolean;
  onRemove: () => void;
  removeExplorerActionDisabled: boolean;
};

const ExplorerTabContent: React.FC<ExplorerTabContentProps> = (props) => {
  const { onSelect } = useTab({ value: props.value });
  const tabButtonHandleRef = React.useRef<ButtonHandle>(null);

  const registerShortcutsResult = useRegisterGlobalShortcuts({
    changeToPrevTabShortcut: {
      keybindings: !props.isPrevExplorer
        ? []
        : [
            {
              key: PRINTED_KEY.ARROW_UP,
              modifiers: {
                ctrl: 'NOT_SET',
                alt: 'SET',
              },
            },
          ],
      handler: () => tabButtonHandleRef.current?.triggerSyntheticPress(),
    },
    changeToNextTabShortcut: {
      keybindings: !props.isNextExplorer
        ? []
        : [
            {
              key: PRINTED_KEY.ARROW_DOWN,
              modifiers: {
                ctrl: 'NOT_SET',
                alt: 'SET',
              },
            },
          ],
      handler: () => tabButtonHandleRef.current?.triggerSyntheticPress(),
    },
    removeTabShortcut: {
      keybindings: !props.isFocusedExplorer
        ? []
        : [
            {
              key: PRINTED_KEY.W,
              modifiers: {
                ctrl: 'NOT_SET',
                alt: 'SET',
              },
            },
          ],
      handler: props.onRemove,
    },
  });

  const buttonEndIcon =
    registerShortcutsResult.changeToPrevTabShortcut.icon ??
    registerShortcutsResult.changeToNextTabShortcut.icon;
  const removeTabShortcutModifiersAreActive =
    registerShortcutsResult.removeTabShortcut.icon !== undefined;

  return (
    <>
      <TabButton
        onPress={onSelect}
        handleRef={tabButtonHandleRef}
        endIcon={buttonEndIcon}
        enableLayoutAnimation="position"
      >
        {props.label}
      </TabButton>
      {!props.removeExplorerActionDisabled && (
        <TabIconButton
          size="sm"
          aria-label="Close Tab"
          tooltipContent={
            <CloseTabButtonTooltipContent>
              <Box>Close Tab</Box>
              {registerShortcutsResult.removeTabShortcut.icon}
            </CloseTabButtonTooltipContent>
          }
          tooltipPlacement="right"
          tooltipOverrideIsOpen={removeTabShortcutModifiersAreActive ? true : undefined}
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

const CloseTabButtonTooltipContent = styled(Box)`
  display: flex;
  gap: var(--spacing-2);
`;
