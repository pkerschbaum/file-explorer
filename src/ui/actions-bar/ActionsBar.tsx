import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { Box, Divider, Tooltip } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { formatter } from '@app/base/utils/formatter.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { config } from '@app/config';
import { RESOURCE_TYPE } from '@app/domain/types';
import { useDraftPasteState } from '@app/global-state/slices/processes.hooks';
import { useTags } from '@app/global-state/slices/tags.hooks';
import { addTagsToResources } from '@app/operations/resource.operations';
import { addTag, removeTags } from '@app/operations/tag.operations';
import { AddTag } from '@app/ui/actions-bar/AddTag';
import { CreateFolder } from '@app/ui/actions-bar/CreateFolder';
import { KEY } from '@app/ui/constants';
import { ActionButton, ActionButtonRef } from '@app/ui/elements/ActionButton';
import { TextField } from '@app/ui/elements/TextField';
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
import { Stack } from '@app/ui/layouts/Stack';

export const ActionsBar: React.FC = () => {
  const draftPasteState = useDraftPasteState();
  const tags = useTags();

  const selectedShownResources = useSelectedShownResources();

  const openSelectedResources = useOpenSelectedResources();
  const copySelectedResources = useCopySelectedResources();
  const cutSelectedResources = useCutSelectedResources();
  const pasteResourcesIntoExplorer = usePasteResourcesIntoExplorer();
  const triggerRenameForSelectedResources = useTriggerRenameForSelectedResources();
  const scheduleDeleteSelectedResources = useScheduleDeleteSelectedResources();
  const createFolderInExplorer = useCreateFolderInExplorer();
  const changeSelectionByKeyboard = useChangeSelectionByKeyboard();

  const openButtonRef = React.useRef<ActionButtonRef>(null);
  const copyButtonRef = React.useRef<ActionButtonRef>(null);
  const cutButtonRef = React.useRef<ActionButtonRef>(null);
  const pasteButtonRef = React.useRef<ActionButtonRef>(null);
  const triggerRenameButtonRef = React.useRef<ActionButtonRef>(null);
  const scheduleDeleteButtonRef = React.useRef<ActionButtonRef>(null);
  const triggerCreateNewFolderButtonRef = React.useRef<ActionButtonRef>(null);

  const filterInputRef = React.useRef<HTMLDivElement>(null);

  const registerShortcutsResult = useRegisterExplorerShortcuts({
    openShortcut: {
      keybindings: [
        {
          key: KEY.ENTER,
        },
      ],
      handler: () => {
        invariant(openButtonRef.current);
        openButtonRef.current.triggerSyntheticClick();
      },
    },
    copyShortcut: {
      keybindings: [
        {
          key: KEY.C,
          modifiers: {
            ctrl: 'SET',
          },
        },
      ],
      handler: () => {
        invariant(copyButtonRef.current);
        copyButtonRef.current.triggerSyntheticClick();
      },
    },
    cutShortcut: {
      keybindings: [
        {
          key: KEY.X,
          modifiers: {
            ctrl: 'SET',
          },
        },
      ],
      handler: () => {
        invariant(cutButtonRef.current);
        cutButtonRef.current.triggerSyntheticClick();
      },
    },
    pasteShortcut: {
      keybindings: [
        {
          key: KEY.V,
          modifiers: {
            ctrl: 'SET',
          },
        },
      ],
      handler: () => {
        invariant(pasteButtonRef.current);
        pasteButtonRef.current.triggerSyntheticClick();
      },
    },
    triggerRenameShortcut: {
      keybindings: [
        {
          key: KEY.R,
          modifiers: {
            ctrl: 'SET',
          },
        },
      ],
      handler: (e) => {
        invariant(triggerRenameButtonRef.current);
        triggerRenameButtonRef.current.triggerSyntheticClick();
        // avoid reload of window (default browser action for CTRL+R)
        e.preventDefault();
      },
    },
    scheduleDeleteShortcut: {
      keybindings: [
        {
          key: KEY.DELETE,
        },
      ],
      handler: () => {
        invariant(scheduleDeleteButtonRef.current);
        scheduleDeleteButtonRef.current.triggerSyntheticClick();
      },
    },
    triggerCreateNewFolderShortcut: {
      keybindings: [
        {
          key: KEY.N,
          modifiers: {
            ctrl: 'SET',
          },
        },
      ],
      handler: () => {
        invariant(triggerCreateNewFolderButtonRef.current);
        triggerCreateNewFolderButtonRef.current.triggerSyntheticClick();
      },
    },
    changeSelectionByKeyboardShortcut: {
      keybindings: [
        {
          key: KEY.ARROW_UP,
        },
        {
          key: KEY.ARROW_DOWN,
        },
        {
          key: KEY.A,
          modifiers: {
            ctrl: 'SET',
          },
        },
        {
          key: KEY.PAGE_UP,
          modifiers: {
            ctrl: 'NOT_SET',
          },
        },
        {
          key: KEY.PAGE_DOWN,
          modifiers: {
            ctrl: 'NOT_SET',
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
  const multipleDirectoriesActionsDisabled =
    selectedShownResources.length < 1 ||
    selectedShownResources.some((resource) => resource.resourceType !== RESOURCE_TYPE.DIRECTORY);

  return (
    <Stack alignItems="stretch">
      <Stack alignItems="flex-end">
        <FilterInput filterInputRef={filterInputRef} />
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Stack wrap>
        <ActionButton
          ref={openButtonRef}
          onClick={openSelectedResources}
          disabled={singleResourceActionsDisabled}
          StartIconComponent={LaunchOutlinedIcon}
          endIcon={registerShortcutsResult.openShortcut?.icon}
        >
          Open
        </ActionButton>
        <ActionButton
          ref={copyButtonRef}
          onClick={copySelectedResources}
          disabled={multipleResourcesActionsDisabled}
          StartIconComponent={ContentCopyOutlinedIcon}
          endIcon={registerShortcutsResult.copyShortcut?.icon}
        >
          Copy
        </ActionButton>
        <ActionButton
          ref={cutButtonRef}
          onClick={cutSelectedResources}
          disabled={multipleResourcesActionsDisabled}
          StartIconComponent={ContentCutOutlinedIcon}
          endIcon={registerShortcutsResult.cutShortcut?.icon}
        >
          Cut
        </ActionButton>
        <ActionButton
          ref={pasteButtonRef}
          variant={draftPasteState === undefined ? undefined : 'contained'}
          onClick={pasteResourcesIntoExplorer}
          disabled={draftPasteState === undefined}
          StartIconComponent={ContentPasteOutlinedIcon}
          endIcon={registerShortcutsResult.pasteShortcut?.icon}
        >
          Paste
          <PasteInfoBadge />
        </ActionButton>
        <ActionButton
          ref={triggerRenameButtonRef}
          onClick={triggerRenameForSelectedResources}
          disabled={singleResourceActionsDisabled}
          StartIconComponent={EditOutlinedIcon}
          endIcon={registerShortcutsResult.triggerRenameShortcut?.icon}
        >
          Rename
        </ActionButton>
        <ActionButton
          ref={scheduleDeleteButtonRef}
          onClick={scheduleDeleteSelectedResources}
          disabled={multipleResourcesActionsDisabled}
          StartIconComponent={DeleteOutlinedIcon}
          endIcon={registerShortcutsResult.scheduleDeleteShortcut?.icon}
        >
          Delete
        </ActionButton>
        <CreateFolder
          actionButtonRef={triggerCreateNewFolderButtonRef}
          actionButtonEndIcon={registerShortcutsResult.triggerCreateNewFolderShortcut?.icon}
          onSubmit={createFolderInExplorer}
        />
        {config.featureFlags.tags && (
          <AddTag
            options={Object.entries(tags).map(([id, otherValues]) => ({
              ...otherValues,
              id,
            }))}
            onValueCreated={(tag) => addTag(tag)}
            onValueChosen={async (chosenTag) => {
              await addTagsToResources(
                selectedShownResources.map((resource) => resource.uri),
                [chosenTag.id],
              );
            }}
            onValueDeleted={(tag) => removeTags([tag.id])}
            disabled={multipleDirectoriesActionsDisabled}
          />
        )}
      </Stack>
    </Stack>
  );
};

type FilterInputProps = {
  filterInputRef: React.RefObject<HTMLDivElement>;
};

const FilterInput: React.FC<FilterInputProps> = ({ filterInputRef }) => {
  const filterInput = useFilterInput();
  const setFilterInput = useSetFilterInput();

  return (
    <TextField
      inputRef={filterInputRef}
      inputProps={DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.datasetAttr}
      InputLabelProps={{ shrink: true, sx: { userSelect: 'none' } }}
      label="Filter"
      value={filterInput}
      onChange={(e) => {
        const newVal = e.target.value.trimStart();
        setFilterInput(newVal);

        // if input is empty now, blur the input field
        if (newVal === '' && filterInputRef.current !== null) {
          filterInputRef.current.blur();
        }
      }}
    />
  );
};

const PasteInfoBadge: React.FC = () => {
  const clipboardResources = useClipboardResources();
  const draftPasteState = useDraftPasteState();

  if (draftPasteState === undefined || clipboardResources.length === 0) {
    return null;
  }

  return (
    <Tooltip
      title={
        <ClipboardResourcesList>
          {clipboardResources.map((resource) => (
            <Box key={uriHelper.getComparisonKey(resource)}>{formatter.resourcePath(resource)}</Box>
          ))}
        </ClipboardResourcesList>
      }
      arrow
      disableInteractive={false}
    >
      <StyledBadge>
        {draftPasteState.pasteShouldMove ? (
          <ContentCutOutlinedIcon fontSize="inherit" />
        ) : (
          <ContentCopyOutlinedIcon fontSize="inherit" />
        )}
      </StyledBadge>
    </Tooltip>
  );
};

const ClipboardResourcesList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing()};

  word-break: break-all;
  white-space: pre-wrap;
`;

const StyledBadge = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(props) => props.theme.palette.text.primary};
  background-color: ${(props) => props.theme.palette.background.paper};
  border: 2px solid ${(props) => props.theme.palette.background.default};
  padding: 3px;
  border-radius: 50%;
`;
