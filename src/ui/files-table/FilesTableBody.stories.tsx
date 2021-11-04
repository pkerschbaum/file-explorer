import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { functions } from '@app/base/utils/functions.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { FileForUI } from '@app/domain/types';
import { createStoreInstance } from '@app/global-state/store';
import { dispatchRef, storeRef } from '@app/operations/global-modules';
import { mapFileStatToFile } from '@app/platform/file-system';
import { DataTable } from '@app/ui/elements/DataTable/DataTable';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import {
  ExplorerDerivedValuesContextProvider,
  ExplorerOperationsContextProvider,
  ExplorerState,
  ExplorerStateContextProvider,
  ExplorerStateUpdateFunctions,
} from '@app/ui/explorer-context';
import { FilesTableRow } from '@app/ui/files-table/FilesTableBody';
import { createQueryClient, Globals } from '@app/ui/Globals';

import { fakeFileStat } from '@app-test/fake-data/fake-data';

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
              'test-explorerid': { cwd: URI.parse(`${Schemas.inMemory}:///home/testdir`) },
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

export const RenameOfRowActive = Template.bind({});
RenameOfRowActive.args = {
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
          <ExplorerOperationsContextProvider>{story()}</ExplorerOperationsContextProvider>
        </ExplorerDerivedValuesContextProvider>
      </ExplorerStateContextProvider>
    );
  },
];
