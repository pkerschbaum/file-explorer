import * as React from 'react';
import { matchSorter } from 'match-sorter';
import { Provider } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';

import { arrays } from '@app/base/utils/arrays.util';
import { strings } from '@app/base/utils/strings.util';
import { FileForUI, FILE_TYPE } from '@app/domain/types';
import { useEnrichFilesWithTags } from '@app/global-state/slices/persisted.hooks';
import { useFilesForUI } from '@app/ui/hooks/files.hooks';
import { scopedAtom, SyncSetAtom, usePrevious, useScopedAtom } from '@app/ui/utils/react.util';

const filterInputAtom = scopedAtom<string>();
const selectionAtom = scopedAtom<{
  idsOfSelectedFiles: string[];
  fileIdSelectionGotStartedWith: string | undefined;
}>();
const fileToRenameIdAtom = scopedAtom<string | undefined>();

const explorerIdAtom = scopedAtom<string>();
const dataAvailableAtom = scopedAtom<boolean>();
const filesAtom = scopedAtom<FileForUI[]>();
const filesToShowAtom = scopedAtom<FileForUI[]>();
const selectedFilesAtom = scopedAtom<FileForUI[]>();

type ExplorerContextProviderProps = {
  explorerId: string;
  children: React.ReactElement;
};

const SYMBOL_STATE_ATOMS_SCOPE = Symbol('EXPLORER_CONTEXT_STATE_ATOMS_SCOPE_SYMBOL');
const SYMBOL_DERIVED_VALUES_ATOMS_SCOPE = Symbol('EXPLORER_CONTEXT_DERIVED_VALUES_ATOMS_SCOPE');

export const ExplorerContextProvider: React.FC<ExplorerContextProviderProps> = (props) => {
  return (
    <Provider
      scope={SYMBOL_STATE_ATOMS_SCOPE}
      initialValues={[
        [filterInputAtom, ''],
        [
          selectionAtom,
          {
            idsOfSelectedFiles: [] as string[],
            fileIdSelectionGotStartedWith: undefined as string | undefined,
          },
        ],
        [fileToRenameIdAtom, undefined],
      ]}
    >
      <StateAtomsContainer {...props} />
    </Provider>
  );
};

const StateAtomsContainer: React.FC<ExplorerContextProviderProps> = (props) => {
  const { explorerId } = props;

  const [filterInput] = useScopedAtom(filterInputAtom, SYMBOL_STATE_ATOMS_SCOPE);
  const [selection, setSelection] = useScopedAtom(selectionAtom, SYMBOL_STATE_ATOMS_SCOPE);

  const { files, dataAvailable } = useFilesForUI(explorerId);

  const setIdsOfSelectedFiles = React.useCallback(
    (newIds: string[]) => {
      setSelection((oldState) => ({
        idsOfSelectedFiles: newIds,
        fileIdSelectionGotStartedWith:
          newIds.length === 1 ? newIds[0] : oldState.fileIdSelectionGotStartedWith,
      }));
    },
    [setSelection],
  );

  const { idsOfSelectedFiles } = selection;
  const selectedFiles = React.useMemo(
    () => files.filter((file) => !!idsOfSelectedFiles.find((id) => id === file.id)),
    [files, idsOfSelectedFiles],
  );

  const filesWithTags = useEnrichFilesWithTags(files);

  /*
   * Compute files to show:
   * - if no filter input is given, just sort the files.
   *   Directories first and files second. Each section sorted by name.
   * - otherwise, let "match-sorter" do its job for filtering and sorting.
   */
  const filesToShow = React.useMemo(() => {
    let result;

    if (strings.isNullishOrEmpty(filterInput)) {
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
        .matchSort(filterInput, {
          // avoid "WORD STARTS WITH" ranking of match-sorter by replacing each blank with another character
          keys: [(file) => file.name.replace(' ', '_')],
          threshold: matchSorter.rankings.CONTAINS,
        })
        .getValue();
    }

    return result;
  }, [filterInput, filesWithTags]);

  // if no file is selected, and every time the filter input changes, reset selection (just select the first file)
  const prevFilterInput = usePrevious(filterInput);
  const filterInputChanged = filterInput !== prevFilterInput;
  React.useEffect(() => {
    if ((idsOfSelectedFiles.length === 0 || filterInputChanged) && filesToShow.length > 0) {
      setIdsOfSelectedFiles([filesToShow[0].id]);
    }
  }, [idsOfSelectedFiles, filterInputChanged, filesToShow, setIdsOfSelectedFiles]);

  return (
    <Provider
      scope={SYMBOL_DERIVED_VALUES_ATOMS_SCOPE}
      initialValues={[
        [explorerIdAtom, explorerId],
        [dataAvailableAtom, dataAvailable],
        [filesAtom, filesWithTags],
        [filesToShowAtom, filesToShow],
        [selectedFilesAtom, selectedFiles],
      ]}
    >
      <DerivedValuesAtomsContainer
        {...props}
        dataAvailable={dataAvailable}
        filesWithTags={filesWithTags}
        filesToShow={filesToShow}
        selectedFiles={selectedFiles}
      />
    </Provider>
  );
};

type DerivedValuesAtomsContainerProps = ExplorerContextProviderProps & {
  dataAvailable: boolean;
  filesWithTags: FileForUI[];
  filesToShow: FileForUI[];
  selectedFiles: FileForUI[];
};

const DerivedValuesAtomsContainer: React.FC<DerivedValuesAtomsContainerProps> = ({
  explorerId,
  dataAvailable,
  filesWithTags,
  filesToShow,
  selectedFiles,
  children,
}) => {
  // propagate computed/pass-through values
  const setExplorerId: SyncSetAtom<typeof explorerIdAtom> = useUpdateAtom(
    explorerIdAtom,
    SYMBOL_DERIVED_VALUES_ATOMS_SCOPE,
  );
  const setDataAvailable: SyncSetAtom<typeof dataAvailableAtom> = useUpdateAtom(
    dataAvailableAtom,
    SYMBOL_DERIVED_VALUES_ATOMS_SCOPE,
  );
  const setFiles: SyncSetAtom<typeof filesAtom> = useUpdateAtom(
    filesAtom,
    SYMBOL_DERIVED_VALUES_ATOMS_SCOPE,
  );
  const setFilesToShow: SyncSetAtom<typeof filesToShowAtom> = useUpdateAtom(
    filesToShowAtom,
    SYMBOL_DERIVED_VALUES_ATOMS_SCOPE,
  );
  const setSelectedFiles: SyncSetAtom<typeof selectedFilesAtom> = useUpdateAtom(
    selectedFilesAtom,
    SYMBOL_DERIVED_VALUES_ATOMS_SCOPE,
  );

  React.useEffect(() => {
    setExplorerId(explorerId);
  }, [explorerId, setExplorerId]);
  React.useEffect(() => {
    setDataAvailable(dataAvailable);
  }, [dataAvailable, setDataAvailable]);
  React.useEffect(() => {
    setFiles(filesWithTags);
  }, [filesWithTags, setFiles]);
  React.useEffect(() => {
    setFilesToShow(filesToShow);
  }, [filesToShow, setFilesToShow]);
  React.useEffect(() => {
    setSelectedFiles(selectedFiles);
  }, [selectedFiles, setSelectedFiles]);

  return children;
};

export function useFilterInput() {
  const [filterInput] = useScopedAtom(filterInputAtom, SYMBOL_STATE_ATOMS_SCOPE);
  return filterInput;
}

export function useFileIdSelectionGotStartedWith() {
  const [selection] = useScopedAtom(selectionAtom, SYMBOL_STATE_ATOMS_SCOPE);
  return selection.fileIdSelectionGotStartedWith;
}

export function useIdsOfSelectedFiles() {
  const [selection] = useScopedAtom(selectionAtom, SYMBOL_STATE_ATOMS_SCOPE);
  return selection.idsOfSelectedFiles;
}

export function useFileToRenameId() {
  const [fileToRenameId] = useScopedAtom(fileToRenameIdAtom, SYMBOL_STATE_ATOMS_SCOPE);
  return fileToRenameId;
}

// computed/pass-through values
export function useExplorerId() {
  const [explorerId] = useScopedAtom(explorerIdAtom, SYMBOL_DERIVED_VALUES_ATOMS_SCOPE);
  return explorerId;
}

export function useFilesToShow() {
  const [filesToShow] = useScopedAtom(filesToShowAtom, SYMBOL_DERIVED_VALUES_ATOMS_SCOPE);
  return filesToShow;
}

export function useDataAvailable() {
  const [dataAvailable] = useScopedAtom(dataAvailableAtom, SYMBOL_DERIVED_VALUES_ATOMS_SCOPE);
  return dataAvailable;
}

export function useSelectedFiles() {
  const [selectedFiles] = useScopedAtom(selectedFilesAtom, SYMBOL_DERIVED_VALUES_ATOMS_SCOPE);
  return selectedFiles;
}

export function useFileToRename() {
  const [fileToRenameId] = useScopedAtom(fileToRenameIdAtom, SYMBOL_STATE_ATOMS_SCOPE);
  const [filesToShow] = useScopedAtom(filesToShowAtom, SYMBOL_DERIVED_VALUES_ATOMS_SCOPE);

  let fileToRename: FileForUI | undefined;
  if (fileToRenameId) {
    fileToRename = filesToShow.find((file) => file.id === fileToRenameId);
  }
  return fileToRename;
}

export function useSetFilterInput() {
  const setFilterInput: SyncSetAtom<typeof filterInputAtom> = useUpdateAtom(
    filterInputAtom,
    SYMBOL_STATE_ATOMS_SCOPE,
  );
  return setFilterInput;
}

export function useSetIdsOfSelectedFiles() {
  const setSelection = useUpdateAtom(selectionAtom, SYMBOL_STATE_ATOMS_SCOPE);
  const setIdsOfSelectedFiles = React.useCallback(
    (newIds: string[]) => {
      void setSelection((oldState) => ({
        idsOfSelectedFiles: newIds,
        fileIdSelectionGotStartedWith:
          newIds.length === 1 ? newIds[0] : oldState.fileIdSelectionGotStartedWith,
      }));
    },
    [setSelection],
  );
  return setIdsOfSelectedFiles;
}

export function useSetFileToRenameId() {
  const setFileToRenameId: SyncSetAtom<typeof fileToRenameIdAtom> = useUpdateAtom(
    fileToRenameIdAtom,
    SYMBOL_STATE_ATOMS_SCOPE,
  );
  return setFileToRenameId;
}
