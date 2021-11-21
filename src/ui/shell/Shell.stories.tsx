import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createStoreInstance } from '@app/global-state/store';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

import { fakeDeleteProcess, fakePasteProcess } from '@app-test/utils/fake-data';

import { initializeStorybookPlatformModules } from '@app-storybook/storybook-utils';

export default {
  title: 'Shell',
  component: Shell,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story, { loaded }) => (
      <Globals queryClient={loaded.queryClient} store={loaded.store}>
        {story()}
      </Globals>
    ),
  ],
} as ComponentMeta<typeof Shell>;

const Template: ComponentStory<typeof Shell> = (args) => <Shell {...args} />;

export const SimpleCase = Template.bind({});
(SimpleCase as any).loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];

export const WithProcesses = Template.bind({});
(WithProcesses as any).loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    const store = await createStoreInstance({
      preloadedState: {
        processesSlice: {
          processes: [fakePasteProcess, fakeDeleteProcess],
        },
      },
    });
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];
