import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { Box, Button, Divider, TextField, Tooltip } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { functions } from '@app/base/utils/functions.util';
import { config } from '@app/config';
import { FILE_TYPE } from '@app/domain/types';
import { useTags } from '@app/global-state/slices/persisted.hooks';
import { useDraftPasteState } from '@app/global-state/slices/processes.hooks';
import { addTags } from '@app/operations/file.operations';
import { addTag, removeTags } from '@app/operations/tag.operations';
import { AddTag } from '@app/ui/actions-bar/AddTag';
import { CreateFolder } from '@app/ui/actions-bar/CreateFolder';
import { KEYS } from '@app/ui/constants';
import { TextBox } from '@app/ui/elements/TextBox';
import {
  useFilterInput,
  useSelectedShownFiles,
  useSetFilterInput,
  useChangeSelectionByKeyboard,
  useCopySelectedFiles,
  useCreateFolderInExplorer,
  useCutSelectedFiles,
  useOpenSelectedFiles,
  usePasteFilesInExplorer,
  useScheduleDeleteSelectedFiles,
  useTriggerRenameForSelectedFiles,
} from '@app/ui/explorer-context';
import { useClipboardResources } from '@app/ui/hooks/clipboard-resources.hooks';
import { Stack } from '@app/ui/layouts/Stack';
import { useWindowEvent } from '@app/ui/utils/react.util';

export const EXPLORER_ACTIONSBAR_GRID_AREA = 'shell-explorer-actions-bar';
export const DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED = {
  datasetAttr: {
    'data-window-keydownhandlers-enabled': 'true',
  },
  attrCamelCased: 'windowKeydownhandlersEnabled',
} as const;

export const ActionsBar: React.FC = () => {
  const draftPasteState = useDraftPasteState();
  const tags = useTags();

  const selectedShownFiles = useSelectedShownFiles();

  const copySelectedFiles = useCopySelectedFiles();
  const cutSelectedFiles = useCutSelectedFiles();
  const pasteFilesInExplorer = usePasteFilesInExplorer();
  const triggerRenameForSelectedFiles = useTriggerRenameForSelectedFiles();
  const changeSelectionByKeyboard = useChangeSelectionByKeyboard();
  const openSelectedFiles = useOpenSelectedFiles();
  const scheduleDeleteSelectedFiles = useScheduleDeleteSelectedFiles();
  const createFolderInExplorer = useCreateFolderInExplorer();

  const filterInputRef = React.useRef<HTMLDivElement>(null);

  /*
   * The following keydown handlers allow navigation of the directory content.
   *
   * All keydown events which are targeted at specific HTML elements (like buttons) should not be overridden,
   * that's why the first keydown handler will just execute NOOP if the target of the keydown event is
   * _not_ the <body> element.
   * There is one exception though: if the keydown event is targeted at the explorer filter component,
   * keydown handlers should still be active to allow rapid filtering/navigation via keyboard.
   */
  useWindowEvent('keydown', [
    {
      condition: (e) =>
        !(e.target instanceof HTMLElement) ||
        e.target.dataset[DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.attrCamelCased] !== 'true',
      handler: functions.noop,
      continuePropagation: true,
    },
    { condition: (e) => e.ctrlKey && e.key === KEYS.C, handler: copySelectedFiles },
    { condition: (e) => e.ctrlKey && e.key === KEYS.X, handler: cutSelectedFiles },
    { condition: (e) => e.ctrlKey && e.key === KEYS.V, handler: pasteFilesInExplorer },
    {
      condition: (e) => e.key === KEYS.F2 || (e.altKey && e.key === KEYS.R),
      handler: triggerRenameForSelectedFiles,
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
    { condition: (e) => e.key === KEYS.ENTER, handler: openSelectedFiles },
    { condition: (e) => e.key === KEYS.DELETE, handler: scheduleDeleteSelectedFiles },
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

  const singleFileActionsDisabled = selectedShownFiles.length !== 1;
  const multipleFilesActionsDisabled = selectedShownFiles.length < 1;
  const multipleDirectoriesActionsDisabled =
    selectedShownFiles.length < 1 ||
    selectedShownFiles.some((file) => file.fileType !== FILE_TYPE.DIRECTORY);

  return (
    <ActionsBarContainer alignItems="stretch">
      <Stack alignItems="flex-end">
        <FilterInput filterInputRef={filterInputRef} />
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Stack wrap>
        <Button
          onClick={openSelectedFiles}
          disabled={singleFileActionsDisabled}
          startIcon={<LaunchOutlinedIcon />}
        >
          Open
        </Button>
        <Button
          onClick={copySelectedFiles}
          disabled={multipleFilesActionsDisabled}
          startIcon={<ContentCopyOutlinedIcon />}
        >
          Copy
        </Button>
        <Button
          onClick={cutSelectedFiles}
          disabled={multipleFilesActionsDisabled}
          startIcon={<ContentCutOutlinedIcon />}
        >
          Cut
        </Button>
        <Button
          variant={draftPasteState === undefined ? undefined : 'contained'}
          onClick={pasteFilesInExplorer}
          disabled={draftPasteState === undefined}
          startIcon={<ContentPasteOutlinedIcon />}
        >
          Paste
          <PasteInfoBadge />
        </Button>
        <Button
          onClick={triggerRenameForSelectedFiles}
          disabled={singleFileActionsDisabled}
          startIcon={<EditOutlinedIcon />}
        >
          Rename
        </Button>
        <Button
          onClick={scheduleDeleteSelectedFiles}
          disabled={multipleFilesActionsDisabled}
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
              await addTags(
                selectedShownFiles.map((file) => file.uri),
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
            <TextBox key={resource.fsPath} fontSize="sm">
              {resource.fsPath}
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
