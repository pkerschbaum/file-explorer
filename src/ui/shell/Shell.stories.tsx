import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createStoreInstance } from '@app/global-state/store';
import { Shell } from '@app/ui/shell';

import { fakeDeleteProcess, fakePasteProcess } from '@app-test/utils/fake-data';

import {
  GlobalDefaultWrapper,
  initializeFakePlatformModules,
  loadCssRulesAndAddToStyleTag,
} from '@app-storybook/storybook-utils';

export default {
  title: 'Shell',
  component: Shell,
  parameters: {
    layout: 'fullscreen',
  },
  loaders: [
    loadCssRulesAndAddToStyleTag,
    async () => {
      await initializeFakePlatformModules();
      const store = await createStoreInstance({
        preloadedState: {
          processesSlice: {
            processes: [fakePasteProcess, fakeDeleteProcess],
          },
        },
      });
      return { store };
    },
  ],
  decorators: [
    (story, { loaded }) => (
      <GlobalDefaultWrapper store={loaded.store}>{story()}</GlobalDefaultWrapper>
    ),
  ],
} as ComponentMeta<typeof Shell>;

const Template: ComponentStory<typeof Shell> = (args) => <Shell {...args} />;

export const DefaultCase = Template.bind({});
