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
import { useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { useTags } from '@app/global-state/slices/persisted.hooks';
import { useDraftPasteState } from '@app/global-state/slices/processes.hooks';
import { changeDirectory, createFolder, pasteFiles } from '@app/operations/explorer.operations';
import {
  addTags,
  cutOrCopyFiles,
  openFiles,
  scheduleMoveFilesToTrash,
} from '@app/operations/file.operations';
import { addTag, removeTags } from '@app/operations/tag.operations';
import { KEYS } from '@app/ui/constants';
import { TextBox } from '@app/ui/elements/TextBox';
import { AddTag } from '@app/ui/explorer-actions/AddTag';
import { CreateFolder } from '@app/ui/explorer-actions/CreateFolder';
import {
  useExplorerId,
  useFileIdSelectionGotStartedWith,
  useFilesToShow,
  useFilterInput,
  useSelectedShownFiles,
  useSetFileToRenameId,
  useSetFilterInput,
  useSetIdsOfSelectedFiles,
} from '@app/ui/explorer-context/Explorer.context';
import { useClipboardResources } from '@app/ui/hooks/clipboard-resources.hooks';
import { Stack } from '@app/ui/layouts/Stack';
import { useWindowEvent } from '@app/ui/utils/react.util';

export const DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED = {
  datasetAttr: {
    'data-window-keydownhandlers-enabled': 'true',
  },
  attrCamelCased: 'windowKeydownhandlersEnabled',
} as const;

export const ExplorerActions: React.FC = () => {
  const explorerId = useExplorerId();
  const focusedExplorerId = useIdOfFocusedExplorerPanel();

  if (explorerId !== focusedExplorerId) {
    return null;
  }

  return <ExplorerActionsImpl />;
};

const ExplorerActionsImpl: React.FC = () => {
  const explorerId = useExplorerId();
  const filesToShow = useFilesToShow();
  const draftPasteState = useDraftPasteState();
  const setIdsOfSelectedFiles = useSetIdsOfSelectedFiles();
  const selectedShownFiles = useSelectedShownFiles();
  const fileIdSelectionGotStartedWith = useFileIdSelectionGotStartedWith();
  const setFileToRenameId = useSetFileToRenameId();

  const tags = useTags();

  const filterInputRef = React.useRef<HTMLDivElement>(null);

  const scheduleDeleteSelectedFiles = () => {
    scheduleMoveFilesToTrash(selectedShownFiles.map((file) => file.uri));
  };

  async function openSelectedFiles() {
    if (selectedShownFiles.length === 1 && selectedShownFiles[0].fileType === FILE_TYPE.DIRECTORY) {
      await changeDirectory(explorerId, selectedShownFiles[0].uri.path);
    } else {
      await openFiles(
        selectedShownFiles
          .filter((selectedFile) => selectedFile.fileType === FILE_TYPE.FILE)
          .map((selectedFile) => selectedFile.uri),
      );
    }
  }

  const cutOrCopySelectedFiles = (cut: boolean) => () => {
    return cutOrCopyFiles(
      selectedShownFiles.map((file) => file.uri),
      cut,
    );
  };
  const copySelectedFiles = cutOrCopySelectedFiles(false);
  const cutSelectedFiles = cutOrCopySelectedFiles(true);

  const triggerRenameForSelectedFiles = () => {
    if (selectedShownFiles.length !== 1) {
      return;
    }
    setFileToRenameId(selectedShownFiles[0].id);
  };

  function changeSelectedFile(e: KeyboardEvent) {
    e.preventDefault();

    if (filesToShow.length < 1) {
      return;
    }

    if (e.key === KEYS.ARROW_UP || e.key === KEYS.ARROW_DOWN) {
      const idsOfSelectedShownFiles = selectedShownFiles.map((file) => file.id);
      const selectedFilesInfos = filesToShow
        .map((file, idx) => ({
          file,
          idx,
          isSelected: idsOfSelectedShownFiles.includes(file.id),
        }))
        .filter((entry) => entry.isSelected);
      const fileIdSelectionGotStartedWithIndex = selectedFilesInfos.find(
        (sfi) => sfi.file.id === fileIdSelectionGotStartedWith,
      )?.idx;

      if (selectedFilesInfos.length === 0 || fileIdSelectionGotStartedWithIndex === undefined) {
        // If no file is selected, just select the first file
        setIdsOfSelectedFiles([filesToShow[0].id]);
        return;
      }

      // If at least one file is selected, gather some infos essential for further processing
      const firstSelectedFileIndex = selectedFilesInfos[0].idx;
      const lastSelectedFileIndex = selectedFilesInfos[selectedFilesInfos.length - 1].idx;
      const selectionWasStartedDownwards =
        fileIdSelectionGotStartedWithIndex === firstSelectedFileIndex;

      if (!e.shiftKey) {
        if (e.key === KEYS.ARROW_UP && fileIdSelectionGotStartedWithIndex > 0) {
          /*
           * UP without shift key is pressed
           * --> select the file above the file which got selected first (if file above exists)
           */
          setIdsOfSelectedFiles([filesToShow[fileIdSelectionGotStartedWithIndex - 1].id]);
        } else if (
          e.key === KEYS.ARROW_DOWN &&
          filesToShow.length > fileIdSelectionGotStartedWithIndex + 1
        ) {
          /*
           * DOWN without shift key is pressed
           * --> select the file below the file which got selected first (if file below exists)
           */
          setIdsOfSelectedFiles([filesToShow[fileIdSelectionGotStartedWithIndex + 1].id]);
        }
      } else {
        if (e.key === KEYS.ARROW_UP) {
          if (selectedFilesInfos.length > 1 && selectionWasStartedDownwards) {
            /*
             * SHIFT+UP is pressed, multiple files are selected, and the selection was started downwards.
             * --> The user wants to remove the last file from the selection.
             */
            setIdsOfSelectedFiles(
              idsOfSelectedShownFiles.filter(
                (id) => id !== selectedFilesInfos[selectedFilesInfos.length - 1].file.id,
              ),
            );
          } else if (firstSelectedFileIndex > 0) {
            /*
             * SHIFT+UP is pressed and the selection was started upwards. Or, there is only one file selected at the moment.
             * --> The user wants to add the file above all selected files to the selection.
             */
            setIdsOfSelectedFiles([
              filesToShow[firstSelectedFileIndex - 1].id,
              ...idsOfSelectedShownFiles,
            ]);
          }
        } else if (e.key === KEYS.ARROW_DOWN) {
          if (selectedFilesInfos.length > 1 && !selectionWasStartedDownwards) {
            /*
             * SHIFT+DOWN is pressed, multiple files are selected, and the selection was started upwards.
             * --> The user wants to remove the first file from the selection.
             */
            setIdsOfSelectedFiles(
              idsOfSelectedShownFiles.filter((id) => id !== selectedFilesInfos[0].file.id),
            );
          } else if (filesToShow.length > lastSelectedFileIndex + 1) {
            /*
             * SHIFT+DOWN is pressed and the selection was started downwards. Or, there is only one file selected at the moment.
             * --> The user wants to add the file after all selected files to the selection.
             */
            setIdsOfSelectedFiles([
              ...idsOfSelectedShownFiles,
              filesToShow[lastSelectedFileIndex + 1].id,
            ]);
          }
        }
      }
    } else if (e.key === KEYS.PAGE_UP) {
      setIdsOfSelectedFiles([filesToShow[0].id]);
    } else if (e.key === KEYS.PAGE_DOWN) {
      setIdsOfSelectedFiles([filesToShow[filesToShow.length - 1].id]);
    } else if (e.key === KEYS.A) {
      setIdsOfSelectedFiles(filesToShow.map((file) => file.id));
    } else {
      throw new Error(`key not implemented. e.key=${e.key}`);
    }
  }

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
    { condition: (e) => e.ctrlKey && e.key === KEYS.V, handler: () => pasteFiles(explorerId) },
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
      handler: (e) => changeSelectedFile(e),
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
    <Stack alignItems="stretch">
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
          onClick={() => pasteFiles(explorerId)}
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
        <CreateFolder onSubmit={(folderName) => createFolder(explorerId, folderName)} />
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
      InputLabelProps={{ shrink: true }}
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
