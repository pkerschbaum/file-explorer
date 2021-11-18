import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { Box, Button, Divider, Tooltip } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { formatter } from '@app/base/utils/formatter.util';
import { functions } from '@app/base/utils/functions.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { config } from '@app/config';
import { RESOURCE_TYPE } from '@app/domain/types';
import { useDraftPasteState } from '@app/global-state/slices/processes.hooks';
import { useTags } from '@app/global-state/slices/tags.hooks';
import { addTagsToResources } from '@app/operations/resource.operations';
import { addTag, removeTags } from '@app/operations/tag.operations';
import { AddTag } from '@app/ui/actions-bar/AddTag';
import { CreateFolder } from '@app/ui/actions-bar/CreateFolder';
import { KEYS } from '@app/ui/constants';
import { TextBox } from '@app/ui/elements/TextBox';
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
} from '@app/ui/explorer-context';
import { useClipboardResources } from '@app/ui/hooks/clipboard-resources.hooks';
import { Stack } from '@app/ui/layouts/Stack';
import { EventHandler, useWindowEvent } from '@app/ui/utils/react.util';

export const EXPLORER_ACTIONSBAR_GRID_AREA = 'shell-explorer-actions-bar';
export const DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED = {
  datasetAttr: {
    'data-window-keydownhandlers-enabled': 'true',
  },
  attrCamelCased: 'windowKeydownhandlersEnabled',
} as const;
export const DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE = {
  attrCamelCased: 'lastFocusWasVisible',
} as const;

export const ActionsBar: React.FC = () => {
  const draftPasteState = useDraftPasteState();
  const tags = useTags();

  const selectedShownResources = useSelectedShownResources();

  const copySelectedResources = useCopySelectedResources();
  const cutSelectedResources = useCutSelectedResources();
  const pasteResourcesIntoExplorer = usePasteResourcesIntoExplorer();
  const triggerRenameForSelectedResources = useTriggerRenameForSelectedResources();
  const changeSelectionByKeyboard = useChangeSelectionByKeyboard();
  const openSelectedResources = useOpenSelectedResources();
  const scheduleDeleteSelectedResources = useScheduleDeleteSelectedResources();
  const createFolderInExplorer = useCreateFolderInExplorer();

  const filterInputRef = React.useRef<HTMLDivElement>(null);

  /**
   * The following keydown handlers allow navigation of the directory content.
   *
   * If the user navigates from one focusable HTML element to the next one using {Tab}/{Shift+Tab},
   * keydown events should NOT be overridden (otherwise, the user would not be able to e.g. activate
   * a button using {Enter}).
   * That's why we check the data attribute "LAST_FOCUS_WAS_VISIBLE"; this data attribute is set by
   * a global focus event listener in Globals.tsx and indicates if the event target matched the CSS
   * pseudo class ":focus-visible" the last time it was focused.
   * ":focus-visible" is set by the browser if a focus should be made evident on the element,
   * it is set if the element was focused by keyboard but it is NOT set if the element was focused
   * by click. Therefore it's the ideal pseudo class to determine if the user navigated to the event
   * target via keyboard ({Tab}/{Shift+Tab}).
   *
   * There is one exception to the aforementioned rule: if the keydown event target is the explorer
   * filter component, keydown handlers should still be active (in order to allow rapid filtering/navigation
   * via keyboard).
   */
  const propagateHandler: EventHandler<'keydown'> = {
    condition: (e) =>
      !(e.target instanceof HTMLElement) ||
      (e.target.dataset[DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE.attrCamelCased] !== 'false' &&
        e.target.dataset[DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.attrCamelCased] !== 'true'),
    handler: functions.noop,
    continuePropagation: true,
  };
  useWindowEvent('keydown', [
    propagateHandler,
    { condition: (e) => e.ctrlKey && e.key === KEYS.C, handler: copySelectedResources },
    { condition: (e) => e.ctrlKey && e.key === KEYS.X, handler: cutSelectedResources },
    { condition: (e) => e.ctrlKey && e.key === KEYS.V, handler: pasteResourcesIntoExplorer },
    {
      condition: (e) => e.key === KEYS.F2 || (e.altKey && e.key === KEYS.R),
      handler: triggerRenameForSelectedResources,
    },
    {
      condition: (e) =>
        e.key === KEYS.ARROW_UP ||
        e.key === KEYS.ARROW_DOWN ||
        (e.ctrlKey && e.key === KEYS.A) ||
        (!e.ctrlKey && e.key === KEYS.PAGE_UP) ||
        (!e.ctrlKey && e.key === KEYS.PAGE_DOWN),
      handler: (e) => changeSelectionByKeyboard(e),
    },
    { condition: (e) => e.key === KEYS.ENTER, handler: openSelectedResources },
    { condition: (e) => e.key === KEYS.DELETE, handler: scheduleDeleteSelectedResources },
    {
      condition: (e) =>
        !e.altKey &&
        !e.ctrlKey &&
        e.key !== KEYS.SHIFT &&
        e.key !== KEYS.TAB &&
        e.key !== KEYS.ESC &&
        e.key !== KEYS.F2 &&
        filterInputRef.current !== null,
      handler: () => {
        if (filterInputRef.current !== null) {
          filterInputRef.current.focus();
        }
      },
    },
  ]);

  const singleResourceActionsDisabled = selectedShownResources.length !== 1;
  const multipleResourcesActionsDisabled = selectedShownResources.length < 1;
  const multipleDirectoriesActionsDisabled =
    selectedShownResources.length < 1 ||
    selectedShownResources.some((resource) => resource.resourceType !== RESOURCE_TYPE.DIRECTORY);

  return (
    <ActionsBarContainer alignItems="stretch">
      <Stack alignItems="flex-end">
        <FilterInput filterInputRef={filterInputRef} />
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Stack wrap>
        <Button
          onClick={openSelectedResources}
          disabled={singleResourceActionsDisabled}
          startIcon={<LaunchOutlinedIcon />}
        >
          Open
        </Button>
        <Button
          onClick={copySelectedResources}
          disabled={multipleResourcesActionsDisabled}
          startIcon={<ContentCopyOutlinedIcon />}
        >
          Copy
        </Button>
        <Button
          onClick={cutSelectedResources}
          disabled={multipleResourcesActionsDisabled}
          startIcon={<ContentCutOutlinedIcon />}
        >
          Cut
        </Button>
        <Button
          variant={draftPasteState === undefined ? undefined : 'contained'}
          onClick={pasteResourcesIntoExplorer}
          disabled={draftPasteState === undefined}
          startIcon={<ContentPasteOutlinedIcon />}
        >
          Paste
          <PasteInfoBadge />
        </Button>
        <Button
          onClick={triggerRenameForSelectedResources}
          disabled={singleResourceActionsDisabled}
          startIcon={<EditOutlinedIcon />}
        >
          Rename
        </Button>
        <Button
          onClick={scheduleDeleteSelectedResources}
          disabled={multipleResourcesActionsDisabled}
          startIcon={<DeleteOutlinedIcon />}
        >
          Delete
        </Button>
        <CreateFolder onSubmit={createFolderInExplorer} />
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
    </ActionsBarContainer>
  );
};

const ActionsBarContainer = styled(Stack)`
  grid-area: ${EXPLORER_ACTIONSBAR_GRID_AREA};
  padding-bottom: ${(props) => props.theme.spacing()};
`;

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
        <Stack direction="column" alignItems="flex-start" sx={{ wordBreak: 'break-all' }}>
          {clipboardResources.map((resource) => (
            <TextBox key={uriHelper.getComparisonKey(resource)} fontSize="sm">
              {formatter.resourcePath(resource)}
            </TextBox>
          ))}
        </Stack>
      }
      arrow
      disableInteractive={false}
    >
      <StyledBadge>
        {draftPasteState.pasteShouldMove ? (
          <ContentCutOutlinedIcon fontSize="small" />
        ) : (
          <ContentCopyOutlinedIcon fontSize="small" />
        )}
      </StyledBadge>
    </Tooltip>
  );
};

const StyledBadge = styled(Box)`
  position: absolute;
  right: -8px;
  bottom: -16px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: ${(props) => props.theme.palette.text.primary};
  background-color: ${(props) => props.theme.palette.background.paper};
  border: 2px solid ${(props) => props.theme.palette.background.default};
  padding: 3px;
  border-radius: 50%;
`;
