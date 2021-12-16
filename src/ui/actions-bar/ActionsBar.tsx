import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { useDraftPasteState } from '@app/global-state/slices/processes.hooks';
import { CreateFolder } from '@app/ui/actions-bar/CreateFolder';
import {
  Box,
  Button,
  ButtonHandle,
  ContentCopyOutlinedIcon,
  ContentCutOutlinedIcon,
  ContentPasteOutlinedIcon,
  DeleteOutlinedIcon,
  Divider,
  EditOutlinedIcon,
  LaunchOutlinedIcon,
  TextField,
  Tooltip,
  useTooltip,
} from '@app/ui/components-library';
import { KEY } from '@app/ui/constants';
import {
  useFilterInput,
  useSelectedShownResources,
  useSetFilterInput,
  useChangeSelectionByKeyboard,
  useCopySelectedResources,
  useCreateFolderInExplorer,
  useCutSelectedResources,
  useOpenSelectedResources,
  usePasteResourcesIntoExplorer,
  useScheduleDeleteSelectedResources,
  useTriggerRenameForSelectedResources,
  useRegisterExplorerShortcuts,
} from '@app/ui/explorer-context';
import { DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED } from '@app/ui/GlobalShortcutsContext';
import { useClipboardResources } from '@app/ui/hooks/clipboard-resources.hooks';

export const ActionsBar: React.FC = () => {
  const draftPasteState = useDraftPasteState();

  const selectedShownResources = useSelectedShownResources();

  const openSelectedResources = useOpenSelectedResources();
  const copySelectedResources = useCopySelectedResources();
  const cutSelectedResources = useCutSelectedResources();
  const pasteResourcesIntoExplorer = usePasteResourcesIntoExplorer();
  const triggerRenameForSelectedResources = useTriggerRenameForSelectedResources();
  const scheduleDeleteSelectedResources = useScheduleDeleteSelectedResources();
  const createFolderInExplorer = useCreateFolderInExplorer();
  const changeSelectionByKeyboard = useChangeSelectionByKeyboard();

  const openButtonHandleRef = React.useRef<ButtonHandle>(null);
  const copyButtonHandleRef = React.useRef<ButtonHandle>(null);
  const cutButtonHandleRef = React.useRef<ButtonHandle>(null);
  const pasteButtonHandleRef = React.useRef<ButtonHandle>(null);
  const triggerRenameButtonHandleRef = React.useRef<ButtonHandle>(null);
  const scheduleDeleteButtonHandleRef = React.useRef<ButtonHandle>(null);
  const triggerCreateNewFolderButtonHandleRef = React.useRef<ButtonHandle>(null);

  const filterInputRef = React.useRef<HTMLInputElement>(null);

  const registerShortcutsResult = useRegisterExplorerShortcuts({
    openShortcut: {
      keybindings: [
        {
          key: KEY.ENTER,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(openButtonHandleRef.current);
        openButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    copyShortcut: {
      keybindings: [
        {
          key: KEY.C,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(copyButtonHandleRef.current);
        copyButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    cutShortcut: {
      keybindings: [
        {
          key: KEY.X,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(cutButtonHandleRef.current);
        cutButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    pasteShortcut: {
      keybindings: [
        {
          key: KEY.V,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(pasteButtonHandleRef.current);
        pasteButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    triggerRenameShortcut: {
      keybindings: [
        {
          key: KEY.R,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: (e) => {
        invariant(triggerRenameButtonHandleRef.current);
        triggerRenameButtonHandleRef.current.triggerSyntheticPress();
        // avoid reload of window (default browser action for CTRL+R)
        e.preventDefault();
      },
    },
    scheduleDeleteShortcut: {
      keybindings: [
        {
          key: KEY.DELETE,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: (e) => {
        invariant(scheduleDeleteButtonHandleRef.current);
        scheduleDeleteButtonHandleRef.current.triggerSyntheticPress();
        // prevent the default action of the DELETE key (e.g. deletion of a character in the "Filter" textbox)
        e.preventDefault();
      },
    },
    triggerCreateNewFolderShortcut: {
      keybindings: [
        {
          key: KEY.N,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(triggerCreateNewFolderButtonHandleRef.current);
        triggerCreateNewFolderButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    changeSelectionByKeyboardShortcut: {
      keybindings: [
        {
          key: KEY.ARROW_UP,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.ARROW_DOWN,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.A,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.PAGE_UP,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
        {
          key: KEY.PAGE_DOWN,
          modifiers: {
            ctrl: 'NOT_SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: (e) => changeSelectionByKeyboard(e),
    },
    focusFilterInputShortcut: {
      condition: (e) =>
        !e.altKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        e.key !== KEY.TAB &&
        e.key !== KEY.ESC &&
        filterInputRef.current !== null,
      handler: () => {
        if (filterInputRef.current !== null) {
          filterInputRef.current.focus();
        }
      },
    },
  });

  const singleResourceActionsDisabled = selectedShownResources.length !== 1;
  const multipleResourcesActionsDisabled = selectedShownResources.length < 1;

  return (
    <ActionBarContainer>
      <Box style={{ alignSelf: 'flex-end' }}>
        <FilterInput filterInputRef={filterInputRef} />
      </Box>

      <Divider orientation="vertical" />

      <ActionBarButtons>
        <Button
          handleRef={openButtonHandleRef}
          onPress={openSelectedResources}
          isDisabled={singleResourceActionsDisabled}
          startIcon={<LaunchOutlinedIcon />}
          endIcon={!singleResourceActionsDisabled && registerShortcutsResult.openShortcut?.icon}
          enableLayoutAnimation
        >
          Open
        </Button>
        <Button
          handleRef={copyButtonHandleRef}
          onPress={copySelectedResources}
          isDisabled={multipleResourcesActionsDisabled}
          startIcon={<ContentCopyOutlinedIcon />}
          endIcon={!multipleResourcesActionsDisabled && registerShortcutsResult.copyShortcut?.icon}
          enableLayoutAnimation
        >
          Copy
        </Button>
        <Button
          handleRef={cutButtonHandleRef}
          onPress={cutSelectedResources}
          isDisabled={multipleResourcesActionsDisabled}
          startIcon={<ContentCutOutlinedIcon />}
          endIcon={!multipleResourcesActionsDisabled && registerShortcutsResult.cutShortcut?.icon}
          enableLayoutAnimation
        >
          Cut
        </Button>
        <Button
          handleRef={pasteButtonHandleRef}
          variant={draftPasteState === undefined ? undefined : 'contained'}
          onPress={pasteResourcesIntoExplorer}
          isDisabled={draftPasteState === undefined}
          startIcon={<ContentPasteOutlinedIcon />}
          endIcon={draftPasteState !== undefined && registerShortcutsResult.pasteShortcut?.icon}
          enableLayoutAnimation
        >
          Paste
          <PasteInfoBadge />
        </Button>
        <Button
          handleRef={triggerRenameButtonHandleRef}
          onPress={triggerRenameForSelectedResources}
          isDisabled={singleResourceActionsDisabled}
          startIcon={<EditOutlinedIcon />}
          endIcon={
            !singleResourceActionsDisabled && registerShortcutsResult.triggerRenameShortcut?.icon
          }
          enableLayoutAnimation
        >
          Rename
        </Button>
        <Button
          handleRef={scheduleDeleteButtonHandleRef}
          onPress={scheduleDeleteSelectedResources}
          isDisabled={multipleResourcesActionsDisabled}
          startIcon={<DeleteOutlinedIcon />}
          endIcon={
            !multipleResourcesActionsDisabled &&
            registerShortcutsResult.scheduleDeleteShortcut?.icon
          }
          enableLayoutAnimation
        >
          Delete
        </Button>
        <CreateFolder
          buttonHandleRef={triggerCreateNewFolderButtonHandleRef}
          buttonEndIcon={registerShortcutsResult.triggerCreateNewFolderShortcut?.icon}
          onSubmit={createFolderInExplorer}
        />
      </ActionBarButtons>
    </ActionBarContainer>
  );
};

type FilterInputProps = {
  filterInputRef: React.RefObject<HTMLInputElement>;
};

const FilterInput: React.FC<FilterInputProps> = ({ filterInputRef }) => {
  const filterInput = useFilterInput();
  const setFilterInput = useSetFilterInput();

  return (
    <TextField
      inputRef={filterInputRef}
      inputProps={DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.datasetAttr}
      placeholder="Filter"
      aria-label="Filter"
      value={filterInput}
      onChange={(newValue) => {
        const trimmedValue = newValue.trimStart();
        setFilterInput(trimmedValue);

        // if input is empty now, blur the input field
        if (trimmedValue === '' && filterInputRef.current !== null) {
          filterInputRef.current.blur();
        }
      }}
    />
  );
};

const ActionBarContainer = styled(Box)`
  display: flex;
  gap: var(--spacing-2);
`;

const ActionBarButtons = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  flex-wrap: wrap;
`;

const PasteInfoBadge: React.FC = () => {
  const clipboardResources = useClipboardResources();
  const draftPasteState = useDraftPasteState();

  const triggerRef = React.useRef<HTMLDivElement>(null);
  const { triggerProps, tooltipInstance } = useTooltip({
    triggerRef,
    tooltip: {
      offset: { mainAxis: 8 },
    },
  });

  if (draftPasteState === undefined || clipboardResources.length === 0) {
    return null;
  }

  return (
    <>
      <StyledBadge ref={triggerRef} {...triggerProps}>
        {draftPasteState.pasteShouldMove ? <ContentCutOutlinedIcon /> : <ContentCopyOutlinedIcon />}
      </StyledBadge>

      <Tooltip tooltipInstance={tooltipInstance}>
        <ClipboardResourcesList>
          {clipboardResources.map((resource) => (
            <Box key={uriHelper.getComparisonKey(resource)}>{formatter.resourcePath(resource)}</Box>
          ))}
        </ClipboardResourcesList>
      </Tooltip>
    </>
  );
};

const StyledBadge = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;

  color: var(--color-fg-0);
  background-color: var(--color-bg-1);
  border-radius: 50%;
  padding: 5px;
  /* compensate vertical padding so that the container does not grow because of the StyledBadge */
  margin-block: -5px;
`;

const ClipboardResourcesList = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2);

  word-break: break-all;
  white-space: pre-wrap;
`;
