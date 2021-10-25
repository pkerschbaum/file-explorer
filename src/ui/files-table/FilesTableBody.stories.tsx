import { ComponentMeta, ComponentStory } from '@storybook/react';

import { fakeFileStat } from '@app/platform/file-system.fake';
import { FilesTableRow } from '@app/ui/files-table/FilesTableBody';
import { FileForUI } from '@app/domain/types';
import { uriHelper } from '@app/base/utils/uri-helper';
import { mapFileStatToFile } from '@app/platform/file-system';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { createStoreInstance } from '@app/global-state/store';
import { dispatchRef, fileIconThemeRef, storeRef } from '@app/operations/global-modules';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { DataTable } from '@app/ui/elements/DataTable/DataTable';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import { functions } from '@app/base/utils/functions.util';
import {
  ExplorerDerivedValuesContextProvider,
  ExplorerState,
  ExplorerStateContextProvider,
  ExplorerStateUpdateFunctions,
} from '@app/ui/explorer-context/Explorer.context';
import { httpFileIconTheme } from '@app/platform/file-icon-theme.fake';

const fakeFile = mapFileStatToFile(fakeFileStat);
const { fileName, extension } = uriHelper.extractNameAndExtension(fakeFile.uri);
const fakeFileForUI: FileForUI = {
  ...fakeFile,
  extension,
  name: fileName,
  tags: [],
};

export default {
  title: 'FilesTable / FilesTableRow',
  component: FilesTableRow,
  decorators: [
    (story) => {
      const queryClient = createQueryClient();
      const store = createStoreInstance({
        preloadedState: {
          explorersSlice: {
            explorerPanels: {
              'test-explorerid': { cwd: URI.file('/home/dir') },
            },
          },
        },
      });
      storeRef.current = store;
      dispatchRef.current = store.dispatch;

      return (
        <Globals queryClient={queryClient} store={store}>
          {story()}
        </Globals>
      );
    },
  ],
} as ComponentMeta<typeof FilesTableRow>;

const Template: ComponentStory<typeof FilesTableRow> = (args) => (
  <DataTable>
    <TableBody>
      <FilesTableRow {...args} />
    </TableBody>
  </DataTable>
);

export const DeferredLoadFileIcon = Template.bind({});
DeferredLoadFileIcon.args = {
  filesToShow: [fakeFileForUI],
  fileForRow: fakeFileForUI,
  idxOfFileForRow: 0,
};
DeferredLoadFileIcon.decorators = [
  (story) => {
    fileIconThemeRef.current = {
      loadCssRules: httpFileIconTheme.loadCssRules,
      loadIconClasses: (...args) => {
        return new Promise((resolve) => {
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          setTimeout(async () => {
            const result = await httpFileIconTheme.loadIconClasses(...args);
            resolve(result);
          }, 3000);
        });
      },
    };

    const explorerState: ExplorerState = {
      filterInput: '',
      selection: {
        idsOfSelectedFiles: [],
        fileIdSelectionGotStartedWith: undefined,
      },
      fileToRenameId: undefined,
    };

    const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = {
      setFilterInput: functions.noop,
      setIdsOfSelectedFiles: functions.noop,
      setFileToRenameId: functions.noop,
    };

    return (
      <ExplorerStateContextProvider
        value={{
          ...explorerState,
          ...explorerStateUpdateFunctions,
        }}
      >
        <ExplorerDerivedValuesContextProvider
          explorerId="test-explorerid"
          explorerState={explorerState}
          setIdsOfSelectedFiles={explorerStateUpdateFunctions.setIdsOfSelectedFiles}
        >
          {story()}
        </ExplorerDerivedValuesContextProvider>
      </ExplorerStateContextProvider>
    );
  },
];

export const RenameOfRowActive = Template.bind({});
RenameOfRowActive.args = {
  filesToShow: [fakeFileForUI],
  fileForRow: fakeFileForUI,
  idxOfFileForRow: 0,
};
RenameOfRowActive.decorators = [
  (story) => {
    const explorerState: ExplorerState = {
      filterInput: '',
      selection: {
        idsOfSelectedFiles: [],
        fileIdSelectionGotStartedWith: undefined,
      },
      fileToRenameId: fakeFile.id,
    };

    const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = {
      setFilterInput: functions.noop,
      setIdsOfSelectedFiles: functions.noop,
      setFileToRenameId: functions.noop,
    };

    return (
      <ExplorerStateContextProvider
        value={{
          ...explorerState,
          ...explorerStateUpdateFunctions,
        }}
      >
        <ExplorerDerivedValuesContextProvider
          explorerId="test-explorerid"
          explorerState={explorerState}
          setIdsOfSelectedFiles={explorerStateUpdateFunctions.setIdsOfSelectedFiles}
        >
          {story()}
        </ExplorerDerivedValuesContextProvider>
      </ExplorerStateContextProvider>
    );
  },
];
