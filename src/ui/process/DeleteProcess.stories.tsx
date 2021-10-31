import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { NarrowUnion } from '@app/base/utils/types.util';
import { DeleteProcess, DELETE_PROCESS_STATUS } from '@app/domain/types';
import { ProcessCard } from '@app/ui/process/ProcessCard';

import { fakeDeleteProcessBase } from '@app-test/fake-data/fake-data';

export default {
  title: 'Processes / Delete',
  component: ProcessCard,
  decorators: [
    (story) => {
      return <Box sx={{ maxWidth: 250 }}>{story()}</Box>;
    },
  ],
} as ComponentMeta<typeof ProcessCard>;

const Template: ComponentStory<typeof ProcessCard> = (args) => <ProcessCard {...args} />;

const process_pendingForUserInput: NarrowUnion<
  DeleteProcess,
  'status',
  DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT
> = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT,
};
export const PendingForUserInput = Template.bind({});
PendingForUserInput.args = { process: process_pendingForUserInput };

const process_running: NarrowUnion<DeleteProcess, 'status', DELETE_PROCESS_STATUS.RUNNING> = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.RUNNING,
};
export const Running = Template.bind({});
Running.args = { process: process_running };

const process_success: NarrowUnion<DeleteProcess, 'status', DELETE_PROCESS_STATUS.SUCCESS> = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.SUCCESS,
};
export const Success = Template.bind({});
Success.args = { process: process_success };

const process_failure: NarrowUnion<DeleteProcess, 'status', DELETE_PROCESS_STATUS.FAILURE> = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.FAILURE,
  error: 'fake-error',
};
export const Failure = Template.bind({});
Failure.args = { process: process_failure };
