import type { ComponentMeta, ComponentStory } from '@storybook/react';
import invariant from 'tiny-invariant';

import { extractCwdSegmentsFromExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import type { RootStore } from '@app/global-state/store';
import { createStoreInstance } from '@app/global-state/store';
import { CwdSegmentContextProvider } from '@app/ui/cwd-segment-context';
import { ExplorerContextProvider } from '@app/ui/explorer-context';
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
    <ExplorerContextProvider explorerId={explorerId}>
      <CwdSegmentContextProvider segmentIdx={currentSegmentIdx}>
        <ResourcesGallery {...args} />
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
