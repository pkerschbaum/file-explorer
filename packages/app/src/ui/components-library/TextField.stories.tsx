import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';

import { createStoreInstance } from '@app/global-state/store';
import { Box } from '@app/ui/components-library/Box';
import { TextField } from '@app/ui/components-library/TextField';
import { createQueryClient, Globals } from '@app/ui/Globals';

import { initializeStorybookPlatformModules } from '@app-storybook/storybook-utils';

export default {
  title: 'Component Library / TextField',
  component: TextField,
  loaders: [
    async () => {
      await initializeStorybookPlatformModules();
      const store = await createStoreInstance();
      const queryClient = createQueryClient();
      return { store, queryClient };
    },
  ],
  decorators: [
    (story, { loaded }) => (
      <Globals queryClient={loaded.queryClient} store={loaded.store}>
        {story()}
      </Globals>
    ),
  ],
} as ComponentMeta<typeof TextField>;

const Template: ComponentStory<typeof TextField> = (args) => (
  <Box style={{ width: 200 }}>
    <TextField placeholder="My Textfield" aria-label="My Textfield" {...args} />
  </Box>
);

export const NoTextEntered_Default = Template.bind({});

export const NoTextEntered_Focus = Template.bind({});
NoTextEntered_Focus.play = async ({ canvasElement }) => {
  const textbox = await within(canvasElement).findByRole('textbox', { name: 'My Textfield' });
  // eslint-disable-next-line @typescript-eslint/await-thenable
  await userEvent.click(textbox);
};
