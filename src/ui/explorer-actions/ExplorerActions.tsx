import * as React from 'react';
import { Box, Button, Divider, TextField, Tooltip } from '@mui/material';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import ContentCutOutlinedIcon from '@mui/icons-material/ContentCutOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

import { URI, UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';

import { config } from '@app/config';
import { styles } from '@app/ui/explorer-actions/ExplorerActions.styles';
import { commonStyles } from '@app/ui/Common.styles';
import { Stack } from '@app/ui/layouts/Stack';
import { TextBox } from '@app/ui/elements/TextBox';
import { AddTag } from '@app/ui/explorer-actions/AddTag';
import { CreateFolder } from '@app/ui/explorer-actions/CreateFolder';
import {
  useFileProviderCwd,
  useFileProviderDraftPasteState,
  useFileProviderFocusedExplorerId,
} from '@app/platform/store/file-provider/file-provider.hooks';
import {
  useAddTags,
  useCutOrCopyFiles,
  useOpenFile,
  useScheduleMoveFilesToTrash,
} from '@app/platform/file.hooks';
import {
  useChangeDirectory,
  useCreateFolder,
  usePasteFiles,
  useRevealCwdInOSExplorer,
} from '@app/platform/explorer.hooks';
import { useAddTag, useGetTags, useRemoveTags } from '@app/platform/tag.hooks';
import {
  useExplorerId,
  useFileIdSelectionGotStartedWith,
  useFilesToShow,
  useFilterInput,
  useIdsOfSelectedFiles,
  useSelectedFiles,
  useSetFileToRenameId,
  useSetFilterInput,
  useSetIdsOfSelectedFiles,
} from '@app/ui/Explorer.context';
import { useClipboardResources } from '@app/ui/NexClipboard.context';
import { FILE_TYPE } from '@app/platform/file-types';
import { KEYS, MOUSE_BUTTONS } from '@app/ui/constants';
import { useWindowEvent } from '@app/ui/utils/react.util';
import { functions } from '@app/base/utils/functions.util';

const EXPLORER_FILTER_INPUT_ID = 'explorer-filter-input';

export const ExplorerActions: React.FC = () => {
  const explorerId = useExplorerId();
  const focusedExplorerId = useFileProviderFocusedExplorerId();

  if (explorerId !== focusedExplorerId) {
    return null;
  }

  return <ExplorerActionsImpl />;
};

const ExplorerActionsImpl: React.FC = () => {
  const explorerId = useExplorerId();
  const cwd = useFileProviderCwd(explorerId);
  const filesToShow = useFilesToShow();
  const draftPasteState = useFileProviderDraftPasteState();
  const idsOfSelectedFiles = useIdsOfSelectedFiles();
  const setIdsOfSelectedFiles = useSetIdsOfSelectedFiles();
  const selectedFiles = useSelectedFiles();
  const fileIdSelectionGotStartedWith = useFileIdSelectionGotStartedWith();
  const setFileToRenameId = useSetFileToRenameId();

  const { changeDirectory } = useChangeDirectory(explorerId);
  const { openFile } = useOpenFile();
  const { cutOrCopyFiles } = useCutOrCopyFiles();
  const { pasteFiles } = usePasteFiles(explorerId);
  const { scheduleMoveFilesToTrash } = useScheduleMoveFilesToTrash();
  const { revealCwdInOSExplorer } = useRevealCwdInOSExplorer(explorerId);
  const { createFolder } = useCreateFolder(explorerId);
  const { getTags } = useGetTags();
  const { addTag } = useAddTag();
  const { addTags } = useAddTags();
  const { removeTags } = useRemoveTags();

  const filterInputRef = React.useRef<HTMLDivElement>(null);

  const scheduleDeleteSelectedFiles = () => {
    scheduleMoveFilesToTrash(selectedFiles.map((file) => file.uri));
  };

  async function openSelectedFiles() {
    if (selectedFiles.length === 1 && selectedFiles[0].fileType === FILE_TYPE.DIRECTORY) {
      await changeDirectory(selectedFiles[0].uri.path);
    } else {
      await Promise.all(
        selectedFiles
          .filter((selectedFile) => selectedFile.fileType === FILE_TYPE.FILE)
          .map((selectedFile) => openFile(selectedFile.uri)),
      );
    }
  }

  const cutOrCopySelectedFiles = (cut: boolean) => () => {
    return cutOrCopyFiles(
      selectedFiles.map((file) => file.uri),
      cut,
    );
  };
  const copySelectedFiles = cutOrCopySelectedFiles(false);
  const cutSelectedFiles = cutOrCopySelectedFiles(true);

  const triggerRenameForSelectedFiles = () => {
    if (selectedFiles.length !== 1) {
      return;
    }
    setFileToRenameId(selectedFiles[0].id);
  };

  async function navigateUp() {
    await changeDirectory(URI.joinPath(URI.from(cwd), '..').path);
  }

  function changeSelectedFile(e: KeyboardEvent) {
    e.preventDefault();

    if (filesToShow.length < 1) {
      return;
    }

    if (e.key === KEYS.ARROW_UP || e.key === KEYS.ARROW_DOWN) {
      const selectedFilesInfos = filesToShow
        .map((file, idx) => ({
          file,
          idx,
          isSelected: selectedFiles.some((selectedFile) => selectedFile.id === file.id),
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
              idsOfSelectedFiles.filter(
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
              ...idsOfSelectedFiles,
            ]);
          }
        } else if (e.key === KEYS.ARROW_DOWN) {
          if (selectedFilesInfos.length > 1 && !selectionWasStartedDownwards) {
            /*
             * SHIFT+DOWN is pressed, multiple files are selected, and the selection was started upwards.
             * --> The user wants to remove the first file from the selection.
             */
            setIdsOfSelectedFiles(
              idsOfSelectedFiles.filter((id) => id !== selectedFilesInfos[0].file.id),
            );
          } else if (filesToShow.length > lastSelectedFileIndex + 1) {
            /*
             * SHIFT+DOWN is pressed and the selection was started downwards. Or, there is only one file selected at the moment.
             * --> The user wants to add the file after all selected files to the selection.
             */
            setIdsOfSelectedFiles([
              ...idsOfSelectedFiles,
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
   * The first event handler determines whether the event target is any input field. If so, no
   * navigation handler is executed. This allows the user to type in input fields without triggering
   * navigation actions.
   * The only exception of this rule is the filter input field. Navigation actions get triggered even
   * if the filter field is focused. This allows the user to filter and navigate using the keyboard only.
   */
  useWindowEvent('keydown', [
    {
      condition: (e) =>
        e.target instanceof HTMLInputElement && e.target.id !== EXPLORER_FILTER_INPUT_ID,
      handler: functions.noop,
    },
    { condition: (e) => e.ctrlKey && e.key === KEYS.C, handler: copySelectedFiles },
    { condition: (e) => e.ctrlKey && e.key === KEYS.X, handler: cutSelectedFiles },
    { condition: (e) => e.ctrlKey && e.key === KEYS.V, handler: pasteFiles },
    { condition: (e) => e.key === KEYS.F2, handler: triggerRenameForSelectedFiles },
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
    { condition: (e) => e.altKey && e.key === KEYS.ARROW_LEFT, handler: navigateUp },
    {
      condition: (e) =>
        !e.altKey &&
        !e.ctrlKey &&
        e.key !== KEYS.SHIFT &&
        e.key !== KEYS.TAB &&
        e.key !== KEYS.F2 &&
        filterInputRef.current !== null,
      handler: () => {
        if (filterInputRef.current !== null) {
          filterInputRef.current.focus();
        }
      },
    },
  ]);

  /*
   * "auxclick" event is fired when the "back" button on a mouse (e.g. Logitech MX Master 2) is clicked.
   */
  useWindowEvent('auxclick', [
    { condition: (e) => e.button === MOUSE_BUTTONS.BACK, handler: navigateUp },
  ]);

  const singleFileActionsDisabled = selectedFiles.length !== 1;
  const multipleFilesActionsDisabled = selectedFiles.length < 1;
  const multipleDirectoriesActionsDisabled =
    selectedFiles.length < 1 || selectedFiles.some((file) => file.fileType !== FILE_TYPE.DIRECTORY);

  return (
    <Stack alignItems="stretch">
      <Stack alignItems="flex-end">
        <FilterInput filterInputRef={filterInputRef} />
      </Stack>
      <Divider orientation="vertical" flexItem />
      <Stack alignItems="flex-end">
        <Stack>
          <CwdInput cwd={cwd} onSubmit={changeDirectory} />
          <Button onClick={navigateUp}>
            <Stack>
              <ArrowUpwardOutlinedIcon fontSize="small" />
              Up
            </Stack>
          </Button>
          <Tooltip title="Reveal in OS File Explorer">
            <Button onClick={revealCwdInOSExplorer}>
              <Stack>
                <FolderOutlinedIcon fontSize="small" />
                Reveal
              </Stack>
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider orientation="vertical" flexItem />

      <Stack wrap>
        <Button onClick={openSelectedFiles} disabled={singleFileActionsDisabled}>
          <Stack>
            <LaunchOutlinedIcon fontSize="small" />
            Open
          </Stack>
        </Button>
        <Button onClick={copySelectedFiles} disabled={multipleFilesActionsDisabled}>
          <Stack>
            <ContentCopyOutlinedIcon fontSize="small" />
            Copy
          </Stack>
        </Button>
        <Button onClick={cutSelectedFiles} disabled={multipleFilesActionsDisabled}>
          <Stack>
            <ContentCutOutlinedIcon fontSize="small" />
            Cut
          </Stack>
        </Button>
        <Button
          variant={draftPasteState === undefined ? undefined : 'contained'}
          onClick={pasteFiles}
          disabled={draftPasteState === undefined}
        >
          <Stack>
            <ContentPasteOutlinedIcon fontSize="small" />
            Paste
            <PasteInfoBadge />
          </Stack>
        </Button>
        <Button onClick={triggerRenameForSelectedFiles} disabled={singleFileActionsDisabled}>
          <Stack>
            <EditOutlinedIcon fontSize="small" />
            Rename
          </Stack>
        </Button>
        <Button onClick={scheduleDeleteSelectedFiles} disabled={multipleFilesActionsDisabled}>
          <Stack>
            <DeleteOutlinedIcon fontSize="small" />
            Delete
          </Stack>
        </Button>
        <CreateFolder onSubmit={createFolder} />
        {config.featureFlags.tags && (
          <AddTag
            options={Object.entries(getTags()).map(([id, otherValues]) => ({
              ...otherValues,
              id,
            }))}
            onValueCreated={(tag) => addTag(tag)}
            onValueChosen={async (chosenTag) => {
              await addTags(
                selectedFiles.map((file) => file.uri),
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

type CwdInputProps = {
  cwd: UriComponents;
  onSubmit: (newCwdPath: string) => void;
};

const CwdInput: React.FC<CwdInputProps> = ({ cwd, onSubmit }) => {
  const [cwdInput, setCwdInput] = React.useState(cwd.path);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(cwdInput);
      }}
    >
      <TextField
        label="Current Directory"
        value={cwdInput}
        onChange={(e) => setCwdInput(e.target.value)}
      />
    </form>
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
      id={EXPLORER_FILTER_INPUT_ID}
      inputRef={filterInputRef}
      InputLabelProps={{ shrink: true }}
      onKeyDown={(e) => {
        /*
         * For some keys, the default action should be stopped (e.g. in case of ARROW_UP and
         * ARROW_DOWN, the cursor in the input field jumps to the start/end of the field). The event
         * must get propagated to the parent, this is needed for navigating the files using the
         * keyboard. For all other events, we stop propagation to avoid interference with the
         * keyboard navigation (e.g. CTRL+X would not only cut the text of the input field, but
         * also the files currently selected)
         */
        if (
          e.ctrlKey ||
          e.altKey ||
          e.key === KEYS.ARROW_UP ||
          e.key === KEYS.ARROW_DOWN ||
          e.key === KEYS.PAGE_UP ||
          e.key === KEYS.PAGE_DOWN ||
          e.key === KEYS.ENTER
        ) {
          e.preventDefault();
        }
      }}
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
  const draftPasteState = useFileProviderDraftPasteState();

  if (draftPasteState === undefined || clipboardResources.length === 0) {
    return null;
  }

  return (
    <Tooltip
      title={
        <Stack direction="column" alignItems="flex-start" css={commonStyles.text.breakAll}>
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
      <Box css={styles.pasteInfoBadge}>
        {draftPasteState.pasteShouldMove ? (
          <ContentCutOutlinedIcon fontSize="small" />
        ) : (
          <ContentCopyOutlinedIcon fontSize="small" />
        )}
      </Box>
    </Tooltip>
  );
};
