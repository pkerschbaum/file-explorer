import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import invariant from 'tiny-invariant';

import { extractCwdSegmentsFromExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { createStoreInstance, RootStore } from '@app/global-state/store';
import { fileSystemRef } from '@app/operations/global-modules';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
import { ExplorerRootContextProvider } from '@app/ui/explorer-panel/ExplorerPanel';
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

const Template: ComponentStory<typeof ResourcesTable> = (args, { loaded }) => {
  const globalState = (loaded.store as RootStore).getState();
  const explorerId = globalState.explorersSlice.focusedExplorerPanelId;
  invariant(explorerId);
  const currentSegmentIdx =
    extractCwdSegmentsFromExplorerPanel(globalState.explorersSlice.explorerPanels[explorerId])
      .length - 1;

  return (
    <ExplorerRootContextProvider value={{ explorerId }}>
      <ExplorerContextProvider segmentIdx={currentSegmentIdx}>
        <ResourcesTable {...args} />
      </ExplorerContextProvider>
    </ExplorerRootContextProvider>
  );
};

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
