import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { DELETE_PROCESS_STATUS, PROCESS_TYPE } from '@app/domain/types';
import { ProcessCard } from '@app/ui/process/ProcessCard';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ProcessCard',
  component: ProcessCard,
  decorators: [
    (story) => {
      return <Box sx={{ maxWidth: 250 }}>{story()}</Box>;
    },
  ],
} as ComponentMeta<typeof ProcessCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ProcessCard> = (args) => <ProcessCard {...args} />;

export const PendingForUserInput = Template.bind({});
PendingForUserInput.args = {
  process: {
    id: '1',
    type: PROCESS_TYPE.DELETE,
    uris: [
      {
        authority: '',
        fragment: '',
        path: '/home/dir/test-file.txt',
        query: '',
        scheme: 'file',
      },
    ],
    status: DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT,
  },
};
