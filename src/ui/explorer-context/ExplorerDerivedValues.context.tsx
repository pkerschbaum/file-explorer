import { matchSorter } from 'match-sorter';
import * as React from 'react';

import { arrays } from '@app/base/utils/arrays.util';
import { check } from '@app/base/utils/assert.util';
import { FileForUI, FILE_TYPE } from '@app/domain/types';
import { useEnrichFilesWithTags } from '@app/global-state/slices/tags.hooks';
import type {
  ExplorerContextProviderProps,
  ExplorerState,
  ExplorerStateUpdateFunctions,
} from '@app/ui/explorer-context/ExplorerState.context';
import { useFilesForUI } from '@app/ui/hooks/files.hooks';
import { createSelectableContext, usePrevious } from '@app/ui/utils/react.util';

type ExplorerDerivedValuesContext = {
  explorerId: string;
  dataAvailable: boolean;
  filesToShow: FileForUI[];
  selectedShownFiles: FileForUI[];
};

const selectableContext =
  createSelectableContext<ExplorerDerivedValuesContext>('ExplorerDerivedValues');
const useExplorerDerivedValuesSelector = selectableContext.useContextSelector;
const DerivedValuesContextProvider = selectableContext.Provider;

type ExplorerDerivedValuesContextProviderProps = ExplorerContextProviderProps & {
  explorerState: ExplorerState;
  setKeysOfSelectedFiles: ExplorerStateUpdateFunctions['setKeysOfSelectedFiles'];
};

export const ExplorerDerivedValuesContextProvider: React.FC<ExplorerDerivedValuesContextProviderProps> =
  ({ explorerState, setKeysOfSelectedFiles, explorerId, children }) => {
    const { files, dataAvailable } = useFilesForUI(explorerId);

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

    const selectedShownFiles = React.useMemo(
      () =>
        filesToShow.filter((file) =>
          explorerState.selection.keysOfSelectedFiles.includes(file.key),
        ),
      [filesToShow, explorerState.selection.keysOfSelectedFiles],
    );

    // if no file is selected, reset selection
    React.useEffect(() => {
      if (selectedShownFiles.length === 0 && filesToShow.length > 0) {
        setKeysOfSelectedFiles([filesToShow[0].key]);
      }
    }, [selectedShownFiles.length, filesToShow, setKeysOfSelectedFiles]);

    // every time the filter input changes, reset selection
    const prevFilterInput = usePrevious(explorerState.filterInput);
    const filterInputChanged = explorerState.filterInput !== prevFilterInput;
    React.useEffect(() => {
      if (filterInputChanged && filesToShow.length > 0) {
        setKeysOfSelectedFiles([filesToShow[0].key]);
      }
    }, [filesToShow, filterInputChanged, setKeysOfSelectedFiles]);

    return (
      <DerivedValuesContextProvider
        value={{
          explorerId,
          dataAvailable,
          filesToShow,
          selectedShownFiles,
        }}
      >
        {children}
      </DerivedValuesContextProvider>
    );
  };

export function useExplorerId() {
  return useExplorerDerivedValuesSelector((explorerValues) => explorerValues.explorerId);
}

export function useFilesToShow() {
  return useExplorerDerivedValuesSelector((explorerValues) => explorerValues.filesToShow);
}

export function useDataAvailable() {
  return useExplorerDerivedValuesSelector((explorerValues) => explorerValues.dataAvailable);
}

export function useSelectedShownFiles() {
  return useExplorerDerivedValuesSelector((explorerValues) => explorerValues.selectedShownFiles);
}
