import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { NarrowUnion } from '@app/base/utils/types.util';
import { PasteProcess, PASTE_PROCESS_STATUS } from '@app/domain/types';
import { createStoreInstance } from '@app/global-state/store';
import { Process } from '@app/ui/process/Process';

import { fakePasteProcessBase } from '@app-test/utils/fake-data';

import {
  GlobalDefaultWrapper,
  initializeFakePlatformModules,
  loadCssRulesAndAddToStyleTag,
} from '@app-storybook/storybook-utils';

export default {
  title: 'Processes / Paste',
  component: Process,
  loaders: [
    loadCssRulesAndAddToStyleTag,
    async () => {
      await initializeFakePlatformModules();
      const store = await createStoreInstance();
      return { store };
    },
  ],
  decorators: [
    (story, { loaded }) => (
      <GlobalDefaultWrapper store={loaded.store}>{story()}</GlobalDefaultWrapper>
    ),
    (story) => <Box sx={{ maxWidth: 250 }}>{story()}</Box>,
  ],
} as ComponentMeta<typeof Process>;

const Template: ComponentStory<typeof Process> = (args) => <Process {...args} />;

const process_runningDeterminingTotalSize: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE
> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE,
};
export const RunningDeterminingTotalSize = Template.bind({});
RunningDeterminingTotalSize.args = { process: process_runningDeterminingTotalSize };

const process_performingPaste: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE
> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
};
export const RunningPerformingPaste = Template.bind({});
RunningPerformingPaste.args = { process: process_performingPaste };

const process_success: NarrowUnion<PasteProcess, 'status', PASTE_PROCESS_STATUS.SUCCESS> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.SUCCESS,
};
export const Success = Template.bind({});
Success.args = { process: process_success };

const process_abortRequested: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.ABORT_REQUESTED
> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.ABORT_REQUESTED,
};
export const AbortRequested = Template.bind({});
AbortRequested.args = { process: process_abortRequested };

const process_abortSuccess: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.ABORT_SUCCESS
> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.ABORT_SUCCESS,
};
export const AbortSuccess = Template.bind({});
AbortSuccess.args = { process: process_abortSuccess };

const process_failure: NarrowUnion<PasteProcess, 'status', PASTE_PROCESS_STATUS.FAILURE> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.FAILURE,
  error: 'fake-error',
};
export const Failure = Template.bind({});
Failure.args = { process: process_failure };
