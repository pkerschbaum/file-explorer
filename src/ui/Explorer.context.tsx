import * as React from 'react';
import { matchSorter } from 'match-sorter';
import { useImmer, Updater } from 'use-immer';
import { createContext, useContextSelector } from 'use-context-selector';

import { arrays } from '@app/base/utils/arrays.util';
import { check } from '@app/base/utils/assert.util';
import { FileForUI, FILE_TYPE } from '@app/domain/types';
import { useEnrichFilesWithTags } from '@app/global-state/slices/persisted.hooks';
import { useFilesForUI } from '@app/ui/hooks/files.hooks';
import { usePrevious } from '@app/ui/utils/react.util';

type ExplorerContextState = {
  filterInput: string;
  selection: {
    idsOfSelectedFiles: string[];
    fileIdSelectionGotStartedWith: string | undefined;
  };
  fileToRenameId: string | undefined;
};

type ExplorerContextValues = ExplorerContextState & {
  updateExplorerState: Updater<ExplorerContextState>;

  // computed/pass-through values
  explorerId: string;
  dataAvailable: boolean;
  filesToShow: FileForUI[];
  selectedFiles: FileForUI[];
};

const explorerValuesContext = createContext<null | ExplorerContextValues>(null);

function useExplorerValuesContext<Selected>(
  selector: (explorerValues: ExplorerContextValues) => Selected,
) {
  return useContextSelector(explorerValuesContext, (value) => {
    if (value === null) {
      throw new Error(`explorerValuesContext is not available`);
    }
    return selector(value);
  });
}

type ExplorerContextProviderProps = {
  explorerId: string;
  children: React.ReactElement;
};

export const ExplorerContextProvider: React.FC<ExplorerContextProviderProps> = (props) => {
  const [explorerState, updateExplorerState] = useImmer<ExplorerContextState>({
    filterInput: '',
    selection: {
      idsOfSelectedFiles: [],
      fileIdSelectionGotStartedWith: undefined,
    },
    fileToRenameId: undefined,
  });

  const { files, dataAvailable } = useFilesForUI(props.explorerId);

  const setIdsOfSelectedFiles = React.useCallback(
    (newIds: string[]) => {
      updateExplorerState((draft) => {
        draft.selection = {
          idsOfSelectedFiles: newIds,
          fileIdSelectionGotStartedWith:
            newIds.length === 1 ? newIds[0] : draft.selection.fileIdSelectionGotStartedWith,
        };
      });
    },
    [updateExplorerState],
  );

  const selectedFiles = React.useMemo(
    () =>
      files.filter(
        (file) => !!explorerState.selection.idsOfSelectedFiles.find((id) => id === file.id),
      ),
    [files, explorerState.selection.idsOfSelectedFiles],
  );

  const filesWithTags = useEnrichFilesWithTags(files);

  /*
   * Compute files to show:
   * - if no filter input is given, just sort the files.
   *   Directories first and files second. Each section sorted by name.
   * - otherwise, let "match-sorter" do its job for filtering and sorting.
   */
  const filesToShow: FileForUI[] = React.useMemo(() => {
    let result;

    if (check.isEmptyString(explorerState.filterInput)) {
      result = arrays
        .wrap(filesWithTags)
        .stableSort((a, b) => {
          if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
            return -1;
          } else if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
            return 1;
          }
          return 0;
        })
        .stableSort((a, b) => {
          if (a.fileType === FILE_TYPE.DIRECTORY && b.fileType === FILE_TYPE.FILE) {
            return -1;
          } else if (a.fileType === FILE_TYPE.FILE && b.fileType === FILE_TYPE.DIRECTORY) {
            return 1;
          }
          return 0;
        })
        .getValue();
    } else {
      result = arrays
        .wrap(filesWithTags)
        .matchSort(explorerState.filterInput, {
          // avoid "WORD STARTS WITH" ranking of match-sorter by replacing each blank with another character
          keys: [(file) => file.name.replace(' ', '_')],
          threshold: matchSorter.rankings.CONTAINS,
        })
        .getValue();
    }

    return result;
  }, [explorerState.filterInput, filesWithTags]);

  // if no file is selected, reset selection
  React.useEffect(() => {
    if (selectedFiles.length === 0 && filesToShow.length > 0) {
      setIdsOfSelectedFiles([filesToShow[0].id]);
    }
  }, [selectedFiles.length, filesToShow, setIdsOfSelectedFiles]);

  // every time the filter input changes, reset selection
  const prevFilterInput = usePrevious(explorerState.filterInput);
  const filterInputChanged = explorerState.filterInput !== prevFilterInput;
  React.useEffect(() => {
    if (filterInputChanged && filesToShow.length > 0) {
      setIdsOfSelectedFiles([filesToShow[0].id]);
    }
  }, [filesToShow, filterInputChanged, setIdsOfSelectedFiles]);

  return (
    <explorerValuesContext.Provider
      value={{
        ...explorerState,
        updateExplorerState,

        explorerId: props.explorerId,
        dataAvailable,
        filesToShow,
        selectedFiles,
      }}
    >
      {props.children}
    </explorerValuesContext.Provider>
  );
};

export function useFilterInput() {
  return useExplorerValuesContext((explorerValues) => explorerValues.filterInput);
}

export function useFileIdSelectionGotStartedWith() {
  return useExplorerValuesContext(
    (explorerValues) => explorerValues.selection.fileIdSelectionGotStartedWith,
  );
}

export function useIdsOfSelectedFiles() {
  return useExplorerValuesContext((explorerValues) => explorerValues.selection.idsOfSelectedFiles);
}

export function useFileToRenameId() {
  return useExplorerValuesContext((explorerValues) => explorerValues.fileToRenameId);
}

// computed/pass-through values
export function useExplorerId() {
  return useExplorerValuesContext((explorerValues) => explorerValues.explorerId);
}

export function useFilesToShow() {
  return useExplorerValuesContext((explorerValues) => explorerValues.filesToShow);
}

export function useDataAvailable() {
  return useExplorerValuesContext((explorerValues) => explorerValues.dataAvailable);
}

export function useSelectedFiles() {
  return useExplorerValuesContext((explorerValues) => explorerValues.selectedFiles);
}

export function useSetFilterInput() {
  const updateExplorerState = useExplorerValuesContext(
    (explorerValues) => explorerValues.updateExplorerState,
  );
  return React.useCallback(
    (newValue: string) => {
      updateExplorerState((draft) => {
        draft.filterInput = newValue;
      });
    },
    [updateExplorerState],
  );
}

export function useSetIdsOfSelectedFiles() {
  const updateExplorerState = useExplorerValuesContext(
    (explorerValues) => explorerValues.updateExplorerState,
  );
  return React.useCallback(
    (newIds: string[]) => {
      updateExplorerState((draft) => {
        draft.selection = {
          idsOfSelectedFiles: newIds,
          fileIdSelectionGotStartedWith:
            newIds.length === 1 ? newIds[0] : draft.selection.fileIdSelectionGotStartedWith,
        };
      });
    },
    [updateExplorerState],
  );
}

export function useSetFileToRenameId() {
  const updateExplorerState = useExplorerValuesContext(
    (explorerValues) => explorerValues.updateExplorerState,
  );
  return React.useCallback(
    (newValue: string | undefined) => {
      updateExplorerState((draft) => {
        draft.fileToRenameId = newValue;
      });
    },
    [updateExplorerState],
  );
}
