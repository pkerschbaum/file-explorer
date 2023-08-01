import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { assertIsUnreachable, check } from '#pkg/base/utils/assert.util';
import { formatter } from '#pkg/base/utils/formatter.util';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import { useDraftPasteState } from '#pkg/global-state/slices/processes.hooks';
import { CreateFolder } from '#pkg/ui/actions-bar/CreateFolder';
import type { ButtonHandle } from '#pkg/ui/components-library';
import {
  Box,
  Button,
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
  ViewComfyIcon,
} from '#pkg/ui/components-library';
import { PRINTED_KEY } from '#pkg/ui/constants';
import {
  useFilterInput,
  useSelectedShownResources,
  useSetFilterInput,
  useCopySelectedResources,
  useCutSelectedResources,
  useOpenSelectedResources,
  usePasteResourcesIntoExplorer,
  useScheduleDeleteSelectedResources,
  useTriggerRenameForSelectedResources,
  useRegisterCwdSegmentShortcuts,
  useSetActiveResourcesView,
  useSelectAll,
} from '#pkg/ui/cwd-segment-context';
import {
  DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED,
  ShortcutPriority,
} from '#pkg/ui/GlobalShortcutsContext';
import { useClipboardResources } from '#pkg/ui/hooks/clipboard-resources.hooks';
import { useDebouncedValue } from '#pkg/ui/utils/react.util';

export const ActionsBar: React.FC = () => {
  const draftPasteState = useDraftPasteState();

  const selectedShownResources = useSelectedShownResources();

  const selectAll = useSelectAll();
  const setActiveResourcesView = useSetActiveResourcesView();
  const openSelectedResources = useOpenSelectedResources();
  const copySelectedResources = useCopySelectedResources();
  const cutSelectedResources = useCutSelectedResources();
  const pasteResourcesIntoExplorer = usePasteResourcesIntoExplorer();
  const triggerRenameForSelectedResources = useTriggerRenameForSelectedResources();
  const scheduleDeleteSelectedResources = useScheduleDeleteSelectedResources();

  const setActiveResourcesViewButtonHandleRef = React.useRef<ButtonHandle>(null);
  const openButtonHandleRef = React.useRef<ButtonHandle>(null);
  const copyButtonHandleRef = React.useRef<ButtonHandle>(null);
  const cutButtonHandleRef = React.useRef<ButtonHandle>(null);
  const pasteButtonHandleRef = React.useRef<ButtonHandle>(null);
  const triggerRenameButtonHandleRef = React.useRef<ButtonHandle>(null);
  const scheduleDeleteButtonHandleRef = React.useRef<ButtonHandle>(null);
  const triggerCreateNewFolderButtonHandleRef = React.useRef<ButtonHandle>(null);

  const registerShortcutsResult = useRegisterCwdSegmentShortcuts({
    selectAllShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.A,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: selectAll,
    },
    setActiveResourcesViewShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.T,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(setActiveResourcesViewButtonHandleRef.current);
        setActiveResourcesViewButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    openShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.ENTER,
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
          key: PRINTED_KEY.C,
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
          key: PRINTED_KEY.X,
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
          key: PRINTED_KEY.V,
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
          key: PRINTED_KEY.R,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(triggerRenameButtonHandleRef.current);
        triggerRenameButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    scheduleDeleteShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.DELETE,
          modifiers: {
            ctrl: 'SET',
            alt: 'NOT_SET',
          },
        },
      ],
      handler: () => {
        invariant(scheduleDeleteButtonHandleRef.current);
        scheduleDeleteButtonHandleRef.current.triggerSyntheticPress();
      },
    },
    triggerCreateNewFolderShortcut: {
      keybindings: [
        {
          key: PRINTED_KEY.N,
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
  });

  const singleResourceActionsDisabled = selectedShownResources.length !== 1;
  const multipleResourcesActionsDisabled = selectedShownResources.length < 1;

  return (
    <ActionBarContainer role="menubar">
      <Box style={{ alignSelf: 'flex-end' }}>
        <FilterInput />
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
        />
        <Button
          handleRef={setActiveResourcesViewButtonHandleRef}
          onPress={() =>
            setActiveResourcesView((currentValue) => {
              if (currentValue === undefined || currentValue === 'table') {
                return 'gallery';
              } else if (currentValue === 'gallery') {
                return 'table';
              } else {
                assertIsUnreachable(currentValue);
              }
            })
          }
          startIcon={<ViewComfyIcon />}
          endIcon={registerShortcutsResult.setActiveResourcesViewShortcut?.icon}
          enableLayoutAnimation
        >
          Toggle View
        </Button>
      </ActionBarButtons>
    </ActionBarContainer>
  );
};

const FilterInput: React.FC = () => {
  const filterInputRef = React.useRef<HTMLInputElement>(null);

  useRegisterCwdSegmentShortcuts({
    focusFilterInputShortcut: {
      priority: ShortcutPriority.LOW,
      condition: (e) => !e.altKey && !e.ctrlKey && !e.shiftKey,
      handler: () => {
        invariant(filterInputRef.current);
        filterInputRef.current.focus();
      },
      disablePreventDefault: true,
    },
  });

  const filterInput = useFilterInput();
  const setFilterInput = useSetFilterInput();
  const [localFilterInput, setLocalFilterInput] = React.useState(filterInput);

  const debouncedFilterInput = useDebouncedValue(localFilterInput, 100);
  React.useEffect(
    function syncFilterInputAfterDebounce() {
      setFilterInput(debouncedFilterInput);
    },
    [debouncedFilterInput, setFilterInput],
  );

  return (
    <TextField
      inputRef={filterInputRef}
      inputProps={DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.datasetAttr}
      placeholder="Filter"
      aria-label="Filter"
      autoFocus={check.isNonEmptyString(localFilterInput)}
      value={localFilterInput}
      onChange={(newValue) => {
        const trimmedValue = newValue.trimStart();
        setLocalFilterInput(trimmedValue);

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
`;
