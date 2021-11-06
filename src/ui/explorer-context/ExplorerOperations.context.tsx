import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as React from 'react';

import { FileForUI, FILE_TYPE } from '@app/domain/types';
import { changeDirectory, createFolder, pasteFiles } from '@app/operations/explorer.operations';
import {
  scheduleMoveFilesToTrash,
  openFiles,
  cutOrCopyFiles,
} from '@app/operations/file.operations';
import { KEYS } from '@app/ui/constants';
import {
  useExplorerId,
  useKeyOfFileSelectionGotStartedWith,
  useFilesToShow,
  useSelectedShownFiles,
  useSetKeyOfFileToRename,
  useSetKeysOfSelectedFiles,
} from '@app/ui/explorer-context';
import { createSelectableContext } from '@app/ui/utils/react.util';

type ExplorerOperationsContext = {
  copySelectedFiles: () => void;
  cutSelectedFiles: () => void;
  pasteFilesInExplorer: () => Promise<void>;
  triggerRenameForSelectedFiles: () => void;
  changeSelectionByKeyboard: (e: KeyboardEvent) => void;
  openSelectedFiles: () => void;
  scheduleDeleteSelectedFiles: () => void;
  createFolderInExplorer: (folderName: string) => Promise<void>;
  changeSelectionByClick: (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    file: FileForUI,
    idxOfFile: number,
  ) => void;
};

const selectableContext = createSelectableContext<ExplorerOperationsContext>('ExplorerOperations');
const useExplorerOperationsSelector = selectableContext.useContextSelector;
const OperationsContextProvider = selectableContext.Provider;

type ExplorerOperationsContextProviderProps = {
  children: React.ReactNode;
};

export const ExplorerOperationsContextProvider: React.FC<ExplorerOperationsContextProviderProps> =
  ({ children }) => {
    const explorerId = useExplorerId();
    const filesToShow = useFilesToShow();
    const setKeysOfSelectedFiles = useSetKeysOfSelectedFiles();
    const selectedShownFiles = useSelectedShownFiles();
    const keyOfFileSelectionGotStartedWith = useKeyOfFileSelectionGotStartedWith();
    const setKeyOfFileToRename = useSetKeyOfFileToRename();

    const { copySelectedFiles, cutSelectedFiles } = React.useMemo(() => {
      const fileUrisToCutOrCopy = selectedShownFiles.map((file) => file.uri);

      return {
        copySelectedFiles: () => cutOrCopyFiles(fileUrisToCutOrCopy, false),
        cutSelectedFiles: () => cutOrCopyFiles(fileUrisToCutOrCopy, true),
      };
    }, [selectedShownFiles]);

    const pasteFilesInExplorer = React.useCallback(() => pasteFiles(explorerId), [explorerId]);

    const triggerRenameForSelectedFiles = React.useCallback(() => {
      if (selectedShownFiles.length !== 1) {
        return;
      }
      setKeyOfFileToRename(selectedShownFiles[0].key);
    }, [selectedShownFiles, setKeyOfFileToRename]);

    const changeSelectionByKeyboard = React.useCallback(
      (e: KeyboardEvent) => {
        e.preventDefault();

        if (filesToShow.length < 1) {
          return;
        }

        if (e.key === KEYS.ARROW_UP || e.key === KEYS.ARROW_DOWN) {
          const keysOfSelectedShownFiles = selectedShownFiles.map((file) => file.key);
          const selectedFilesInfos = filesToShow
            .map((file, idx) => ({
              file,
              idx,
              isSelected: keysOfSelectedShownFiles.includes(file.key),
            }))
            .filter((entry) => entry.isSelected);
          const fileSelectionGotStartedWith_idx = selectedFilesInfos.find(
            (sfi) => sfi.file.key === keyOfFileSelectionGotStartedWith,
          )?.idx;

          if (selectedFilesInfos.length === 0 || fileSelectionGotStartedWith_idx === undefined) {
            // If no file is selected, just select the first file
            setKeysOfSelectedFiles([filesToShow[0].key]);
            return;
          }

          // If at least one file is selected, gather some infos essential for further processing
          const firstSelectedFile_idx = selectedFilesInfos[0].idx;
          const lastSelectedFile_idx = selectedFilesInfos[selectedFilesInfos.length - 1].idx;
          const selectionWasStartedDownwards =
            fileSelectionGotStartedWith_idx === firstSelectedFile_idx;

          if (!e.shiftKey) {
            if (e.key === KEYS.ARROW_UP && fileSelectionGotStartedWith_idx > 0) {
              /*
               * UP without shift key is pressed
               * --> select the file above the file which got selected first (if file above exists)
               */
              setKeysOfSelectedFiles([filesToShow[fileSelectionGotStartedWith_idx - 1].key]);
            } else if (
              e.key === KEYS.ARROW_DOWN &&
              filesToShow.length > fileSelectionGotStartedWith_idx + 1
            ) {
              /*
               * DOWN without shift key is pressed
               * --> select the file below the file which got selected first (if file below exists)
               */
              setKeysOfSelectedFiles([filesToShow[fileSelectionGotStartedWith_idx + 1].key]);
            }
          } else {
            if (e.key === KEYS.ARROW_UP) {
              if (selectedFilesInfos.length > 1 && selectionWasStartedDownwards) {
                /*
                 * SHIFT+UP is pressed, multiple files are selected, and the selection was started downwards.
                 * --> The user wants to remove the last file from the selection.
                 */
                setKeysOfSelectedFiles(
                  keysOfSelectedShownFiles.filter(
                    (id) => id !== selectedFilesInfos[selectedFilesInfos.length - 1].file.key,
                  ),
                );
              } else if (firstSelectedFile_idx > 0) {
                /*
                 * SHIFT+UP is pressed and the selection was started upwards. Or, there is only one file selected at the moment.
                 * --> The user wants to add the file above all selected files to the selection.
                 */
                setKeysOfSelectedFiles([
                  filesToShow[firstSelectedFile_idx - 1].key,
                  ...keysOfSelectedShownFiles,
                ]);
              }
            } else if (e.key === KEYS.ARROW_DOWN) {
              if (selectedFilesInfos.length > 1 && !selectionWasStartedDownwards) {
                /*
                 * SHIFT+DOWN is pressed, multiple files are selected, and the selection was started upwards.
                 * --> The user wants to remove the first file from the selection.
                 */
                setKeysOfSelectedFiles(
                  keysOfSelectedShownFiles.filter((id) => id !== selectedFilesInfos[0].file.key),
                );
              } else if (filesToShow.length > lastSelectedFile_idx + 1) {
                /*
                 * SHIFT+DOWN is pressed and the selection was started downwards. Or, there is only one file selected at the moment.
                 * --> The user wants to add the file after all selected files to the selection.
                 */
                setKeysOfSelectedFiles([
                  ...keysOfSelectedShownFiles,
                  filesToShow[lastSelectedFile_idx + 1].key,
                ]);
              }
            }
          }
        } else if (e.key === KEYS.PAGE_UP) {
          setKeysOfSelectedFiles([filesToShow[0].key]);
        } else if (e.key === KEYS.PAGE_DOWN) {
          setKeysOfSelectedFiles([filesToShow[filesToShow.length - 1].key]);
        } else if (e.key === KEYS.A) {
          setKeysOfSelectedFiles(filesToShow.map((file) => file.key));
        } else {
          throw new Error(`key not implemented. e.key=${e.key}`);
        }
      },
      [keyOfFileSelectionGotStartedWith, filesToShow, selectedShownFiles, setKeysOfSelectedFiles],
    );

    const openSelectedFiles = React.useCallback(async () => {
      if (
        selectedShownFiles.length === 1 &&
        selectedShownFiles[0].fileType === FILE_TYPE.DIRECTORY
      ) {
        await changeDirectory(explorerId, URI.from(selectedShownFiles[0].uri));
      } else {
        await openFiles(
          selectedShownFiles
            .filter((selectedFile) => selectedFile.fileType === FILE_TYPE.FILE)
            .map((selectedFile) => selectedFile.uri),
        );
      }
    }, [explorerId, selectedShownFiles]);

    const scheduleDeleteSelectedFiles = React.useCallback(() => {
      scheduleMoveFilesToTrash(selectedShownFiles.map((file) => file.uri));
    }, [selectedShownFiles]);

    const createFolderInExplorer = React.useCallback(
      (folderName: string) => createFolder(explorerId, folderName),
      [explorerId],
    );

    const changeSelectionByClick = React.useCallback(
      (e: React.MouseEvent<HTMLElement, MouseEvent>, file: FileForUI, idxOfFile: number) => {
        const fileIsSelected = !!selectedShownFiles.find(
          (selectedFile) => selectedFile.key === file.key,
        );
        function selectFiles(files: FileForUI[]) {
          setKeysOfSelectedFiles(files.map((file) => file.key));
        }

        if (e.ctrlKey) {
          // toggle selection of file which was clicked on
          if (fileIsSelected) {
            selectFiles(selectedShownFiles.filter((selectedFile) => selectedFile.key !== file.key));
          } else {
            selectFiles([...selectedShownFiles, file]);
          }
        } else if (e.shiftKey) {
          // select range of files
          if (keyOfFileSelectionGotStartedWith === undefined) {
            return;
          }

          const idxSelectionGotStartedWith = filesToShow.findIndex(
            (file) => file.key === keyOfFileSelectionGotStartedWith,
          );
          let idxSelectFrom = idxSelectionGotStartedWith;
          let idxSelectTo = idxOfFile;
          if (idxSelectTo < idxSelectFrom) {
            // swap values
            const tmp = idxSelectFrom;
            idxSelectFrom = idxSelectTo;
            idxSelectTo = tmp;
          }

          const filesToSelect = filesToShow.filter(
            (_, idx) => idx >= idxSelectFrom && idx <= idxSelectTo,
          );
          selectFiles(filesToSelect);
        } else {
          // no ctrl or shift key pressed --> just select the file which was clicked on
          selectFiles([file]);
        }
      },
      [keyOfFileSelectionGotStartedWith, filesToShow, selectedShownFiles, setKeysOfSelectedFiles],
    );

    return (
      <OperationsContextProvider
        value={{
          copySelectedFiles,
          cutSelectedFiles,
          pasteFilesInExplorer,
          triggerRenameForSelectedFiles,
          changeSelectionByKeyboard,
          openSelectedFiles,
          scheduleDeleteSelectedFiles,
          createFolderInExplorer,
          changeSelectionByClick,
        }}
      >
        {children}
      </OperationsContextProvider>
    );
  };

export function useCopySelectedFiles() {
  return useExplorerOperationsSelector((actions) => actions.copySelectedFiles);
}

export function useCutSelectedFiles() {
  return useExplorerOperationsSelector((actions) => actions.cutSelectedFiles);
}

export function usePasteFilesInExplorer() {
  return useExplorerOperationsSelector((actions) => actions.pasteFilesInExplorer);
}

export function useTriggerRenameForSelectedFiles() {
  return useExplorerOperationsSelector((actions) => actions.triggerRenameForSelectedFiles);
}

export function useChangeSelectionByKeyboard() {
  return useExplorerOperationsSelector((actions) => actions.changeSelectionByKeyboard);
}

export function useOpenSelectedFiles() {
  return useExplorerOperationsSelector((actions) => actions.openSelectedFiles);
}

export function useScheduleDeleteSelectedFiles() {
  return useExplorerOperationsSelector((actions) => actions.scheduleDeleteSelectedFiles);
}

export function useCreateFolderInExplorer() {
  return useExplorerOperationsSelector((actions) => actions.createFolderInExplorer);
}

export function useChangeSelectionByClick() {
  return useExplorerOperationsSelector((actions) => actions.changeSelectionByClick);
}
