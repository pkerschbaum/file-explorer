import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import invariant from 'tiny-invariant';

import { extractCwdSegmentsFromExplorerPanel } from '#pkg/global-state/slices/explorers.hooks';
import type { RootStore } from '#pkg/global-state/store';
import { createStoreInstance } from '#pkg/global-state/store';
import { CwdSegmentContextProvider } from '#pkg/ui/cwd-segment-context';
import { ExplorerContextProvider } from '#pkg/ui/explorer-context';
import { createQueryClient, Globals } from '#pkg/ui/Globals';
import { ResourcesGallery } from '#pkg/ui/resources-gallery';

import { initializeStorybookPlatformModules } from '#pkg-storybook/storybook-utils';

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
} as Meta<typeof ResourcesGallery>;

const Template: StoryFn<typeof ResourcesGallery> = (args, { loaded }) => {
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

export const DefaultCase: StoryObj = {
  render: Template,

  loaders: [
    async () => {
      await initializeStorybookPlatformModules();
      const store = await createStoreInstance();
      const queryClient = createQueryClient();
      return { store, queryClient };
    },
  ],
};
