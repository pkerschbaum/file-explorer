import { Box } from '@mui/material';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { NarrowUnion } from '@app/base/utils/types.util';
import { DeleteProcess, DELETE_PROCESS_STATUS } from '@app/domain/types';
import { createStoreInstance } from '@app/global-state/store';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Process } from '@app/ui/process/Process';

import { fakeDeleteProcessBase, fakeFileStat } from '@app-test/utils/fake-data';

import { initializeStorybookPlatformModules } from '@app-storybook/storybook-utils';

export default {
  title: 'Processes / Delete',
  component: Process,
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
    (story) => <Box sx={{ maxWidth: 250 }}>{story()}</Box>,
  ],
} as ComponentMeta<typeof Process>;

const Template: ComponentStory<typeof Process> = (args) => <Process {...args} />;

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

const process_veryLongResourceNames: NarrowUnion<
  DeleteProcess,
  'status',
  DELETE_PROCESS_STATUS.RUNNING
> = {
  ...fakeDeleteProcessBase,
  uris: [
    URI.joinPath(
      fakeFileStat.resource,
      './very-long-file-nameaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt',
    ).toJSON(),
    ...fakeDeleteProcessBase.uris,
  ],
  status: DELETE_PROCESS_STATUS.RUNNING,
};
export const VeryLongResourceNames = Template.bind({});
VeryLongResourceNames.args = { process: process_veryLongResourceNames };
