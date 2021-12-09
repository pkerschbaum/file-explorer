import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createStoreInstance, RootStore } from '@app/global-state/store';
import { fileSystemRef } from '@app/operations/global-modules';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { ResourcesTable } from '@app/ui/resources-table';

import { initializeStorybookPlatformModules } from '@app-storybook/storybook-utils';

export default {
  title: 'ResourcesTable',
  component: ResourcesTable,
  decorators: [
    (story, { loaded }) => (
      <Globals queryClient={loaded.queryClient} store={loaded.store}>
        {story()}
      </Globals>
    ),
  ],
} as ComponentMeta<typeof ResourcesTable>;

const Template: ComponentStory<typeof ResourcesTable> = (args, { loaded }) => (
  <ExplorerContextProvider
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    explorerId={(loaded.store as RootStore).getState().explorersSlice.focusedExplorerPanelId!}
    isActiveExplorer
  >
    <ResourcesTable {...args} />
  </ExplorerContextProvider>
);

export const DefaultCase = Template.bind({});
DefaultCase.loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];

export const ResourcesDataNotAvailable = Template.bind({});
ResourcesDataNotAvailable.loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    // never resolve file-system access in order to show loading state (skeletons)
    fileSystemRef.current.resolve = () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return new Promise<IFileStatWithMetadata>(() => {});
    };
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];
