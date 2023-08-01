import type { ComponentMeta, ComponentStory } from '@storybook/react';
import invariant from 'tiny-invariant';

import type { IFileStatWithMetadata } from '@app/base/files';
import { extractCwdSegmentsFromExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import type { RootStore } from '@app/global-state/store';
import { createStoreInstance } from '@app/global-state/store';
import { CwdSegmentContextProvider } from '@app/ui/cwd-segment-context';
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

const Template: ComponentStory<typeof ResourcesTable> = (args, { loaded }) => {
  const globalState = (loaded.store as RootStore).getState();
  const explorerId = globalState.explorersSlice.focusedExplorerPanelId;
  invariant(explorerId);
  const currentSegmentIdx =
    extractCwdSegmentsFromExplorerPanel(globalState.explorersSlice.explorerPanels[explorerId])
      .length - 1;

  return (
    <ExplorerContextProvider explorerId={explorerId}>
      <CwdSegmentContextProvider segmentIdx={currentSegmentIdx}>
        <ResourcesTable {...args} />
      </CwdSegmentContextProvider>
    </ExplorerContextProvider>
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
    globalThis.modules.fileSystem.resolve = () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return new Promise<IFileStatWithMetadata>(() => {});
    };
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];
