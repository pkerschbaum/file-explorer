import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createStoreInstance, RootStore } from '@app/global-state/store';
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

const Template: ComponentStory<typeof ResourcesGallery> = (args, { loaded }) => (
  <ExplorerContextProvider
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    explorerId={(loaded.store as RootStore).getState().explorersSlice.focusedExplorerPanelId!}
  >
    <ResourcesGallery {...args} />
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
