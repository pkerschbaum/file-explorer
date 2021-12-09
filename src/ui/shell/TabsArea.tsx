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
  Box,
  ButtonHandle,
  Button,
  Icon,
  IconButton,
  Tabs,
  Tab,
  useTab,
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

          const uriSlugs = uriHelper.splitUriIntoSlugs(explorer.cwd);
          const uriSlugToRender = uriSlugs[uriSlugs.length - 1];

          return (
            <Tab key={explorer.explorerId} value={explorer.explorerId}>
              <ExplorerTabContent
                value={explorer.explorerId}
                label={uriSlugToRender.formatted}
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
        startIcon={<Icon Component={AddCircleOutlineOutlinedIcon} />}
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
        <TabIconButton tooltipContent="Close Tab" size="small" onPress={props.onRemove}>
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
  padding-right: ${({ theme }) => theme.spacing(4)};
`;

const TabIconButton = styled(IconButton)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: ${(props) => props.theme.spacing(1)};
  margin-block: auto;
  height: fit-content;

  padding: 0;
  border-radius: 0;
`;
