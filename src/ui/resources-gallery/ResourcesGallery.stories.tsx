import { ComponentMeta, ComponentStory } from '@storybook/react';
import invariant from 'tiny-invariant';

import { extractCwdSegmentsFromExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { createStoreInstance, RootStore } from '@app/global-state/store';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
import { ExplorerRootContextProvider } from '@app/ui/explorer-panel/ExplorerPanel';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { ResourcesGallery } from '@app/ui/resources-gallery';

import { initializeStorybookPlatformModules } from '@app-storybook/storybook-utils';

export default {
  title: 'ResourcesGallery',
  component: ResourcesGallery,
  decorators: [
    (story, { loaded }) => (
      <Globals queryClient={loaded.queryClient} store={loaded.store}>
        {story()}
      </Globals>
    ),
  ],
} as ComponentMeta<typeof ResourcesGallery>;

const Template: ComponentStory<typeof ResourcesGallery> = (args, { loaded }) => {
  const globalState = (loaded.store as RootStore).getState();
  const explorerId = globalState.explorersSlice.focusedExplorerPanelId;
  invariant(explorerId);
  const currentSegmentIdx =
    extractCwdSegmentsFromExplorerPanel(globalState.explorersSlice.explorerPanels[explorerId])
      .length - 1;

  return (
    <ExplorerRootContextProvider value={{ explorerId }}>
      <ExplorerContextProvider segmentIdx={currentSegmentIdx}>
        <ResourcesGallery {...args} />
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
