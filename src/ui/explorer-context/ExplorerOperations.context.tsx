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
  useFileIdSelectionGotStartedWith,
  useFilesToShow,
  useSelectedShownFiles,
  useSetFileToRenameId,
  useSetIdsOfSelectedFiles,
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
    const setIdsOfSelectedFiles = useSetIdsOfSelectedFiles();
    const selectedShownFiles = useSelectedShownFiles();
    const fileIdSelectionGotStartedWith = useFileIdSelectionGotStartedWith();
    const setFileToRenameId = useSetFileToRenameId();

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
      setFileToRenameId(selectedShownFiles[0].id);
    }, [selectedShownFiles, setFileToRenameId]);

    const changeSelectionByKeyboard = React.useCallback(
      (e: KeyboardEvent) => {
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
      },
      [fileIdSelectionGotStartedWith, filesToShow, selectedShownFiles, setIdsOfSelectedFiles],
    );

    const openSelectedFiles = React.useCallback(async () => {
      if (
        selectedShownFiles.length === 1 &&
        selectedShownFiles[0].fileType === FILE_TYPE.DIRECTORY
      ) {
        await changeDirectory(explorerId, selectedShownFiles[0].uri.path);
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
          (selectedFile) => selectedFile.id === file.id,
        );
        function selectFiles(files: FileForUI[]) {
          setIdsOfSelectedFiles(files.map((file) => file.id));
        }

        if (e.ctrlKey) {
          // toggle selection of file which was clicked on
          if (fileIsSelected) {
            selectFiles(selectedShownFiles.filter((selectedFile) => selectedFile.id !== file.id));
          } else {
            selectFiles([...selectedShownFiles, file]);
          }
        } else if (e.shiftKey) {
          // select range of files
          if (fileIdSelectionGotStartedWith === undefined) {
            return;
          }

          const idxSelectionGotStartedWith = filesToShow.findIndex(
            (file) => file.id === fileIdSelectionGotStartedWith,
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
      [fileIdSelectionGotStartedWith, filesToShow, selectedShownFiles, setIdsOfSelectedFiles],
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
