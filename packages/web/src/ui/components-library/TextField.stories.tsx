import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/testing-library';

import { createStoreInstance } from '#pkg/global-state/store';
import { Box } from '#pkg/ui/components-library/Box';
import { TextField } from '#pkg/ui/components-library/TextField';
import { createQueryClient, Globals } from '#pkg/ui/Globals';

import { initializeStorybookPlatformModules } from '#pkg-storybook/storybook-utils';

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
} as Meta<typeof TextField>;

const Template: StoryFn<typeof TextField> = (args) => (
  <Box style={{ width: 200 }}>
    <TextField placeholder="My Textfield" aria-label="My Textfield" {...args} />
  </Box>
);

export const NoTextEntered_Default: StoryObj = {
  render: Template,
};

export const NoTextEntered_Focus: StoryObj = {
  render: Template,

  play: async ({ canvasElement }) => {
    const textbox = await within(canvasElement).findByRole('textbox', { name: 'My Textfield' });
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await userEvent.click(textbox);
  },
};
