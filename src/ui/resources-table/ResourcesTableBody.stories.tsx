import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { functions } from '@app/base/utils/functions.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { ResourceForUI } from '@app/domain/types';
import { createStoreInstance } from '@app/global-state/store';
import { dispatchRef, storeRef } from '@app/operations/global-modules';
import { mapFileStatToResource } from '@app/platform/file-system';
import { DataTable } from '@app/ui/elements/DataTable/DataTable';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import {
  ExplorerDerivedValuesContextProvider,
  ExplorerOperationsContextProvider,
  ExplorerState,
  ExplorerStateContextProvider,
  ExplorerStateUpdateFunctions,
} from '@app/ui/explorer-context';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { ResourcesTableRow } from '@app/ui/resources-table/ResourcesTableBody';

import { fakeFileStat } from '@app-test/fake-data/fake-data';

const fakeResource = mapFileStatToResource(fakeFileStat);
const { resourceName, extension } = uriHelper.extractNameAndExtension(fakeResource.uri);
const fakeResourceForUI: ResourceForUI = {
  ...fakeResource,
  extension,
  name: resourceName,
  tags: [],
};

export default {
  title: 'ResourcesTable / ResourcesTableRow',
  component: ResourcesTableRow,
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
} as ComponentMeta<typeof ResourcesTableRow>;

const Template: ComponentStory<typeof ResourcesTableRow> = (args) => (
  <DataTable>
    <TableBody>
      <ResourcesTableRow {...args} />
    </TableBody>
  </DataTable>
);

export const RenameOfRowActive = Template.bind({});
RenameOfRowActive.args = {
  resourceForRow: fakeResourceForUI,
  idxOfResourceForRow: 0,
};
RenameOfRowActive.decorators = [
  (story) => {
    const explorerState: ExplorerState = {
      filterInput: '',
      selection: {
        keysOfSelectedResources: [],
        keyOfResourceSelectionGotStartedWith: undefined,
      },
      keyOfResourceToRename: fakeResource.key,
    };

    const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = {
      setFilterInput: functions.noop,
      setKeysOfSelectedResources: functions.noop,
      setKeyOfResourceToRename: functions.noop,
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
          setKeysOfSelectedResources={explorerStateUpdateFunctions.setKeysOfSelectedResources}
        >
          <ExplorerOperationsContextProvider>{story()}</ExplorerOperationsContextProvider>
        </ExplorerDerivedValuesContextProvider>
      </ExplorerStateContextProvider>
    );
  },
];
