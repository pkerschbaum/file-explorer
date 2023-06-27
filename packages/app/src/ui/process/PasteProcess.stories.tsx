import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { numbers } from '@app/base/utils/numbers.util';
import type { NarrowUnion } from '@app/base/utils/types.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import type { PasteProcess } from '@app/domain/types';
import { PASTE_PROCESS_STATUS } from '@app/domain/types';
import { createStoreInstance } from '@app/global-state/store';
import { Box } from '@app/ui/components-library';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Process } from '@app/ui/process/Process';

import { fakePasteProcessBase } from '@app-test/utils/fake-data';

import { initializeStorybookPlatformModules } from '@app-storybook/storybook-utils';

export default {
  title: 'Processes / Paste',
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
    (story) => <Box style={{ maxWidth: 250 }}>{story()}</Box>,
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

const process_manyResources: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE
> = {
  ...fakePasteProcessBase,
  sourceUris: [
    ...numbers
      .sequence({ fromInclusive: 1, toInclusive: 100 })
      .map((number) =>
        uriHelper.parseUri(
          Schemas.file,
          `/home/testdir/testfile-${number.toString().padStart(5, '0')}.txt`,
        ),
      ),
  ],
  status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
};
export const ManyResources = Template.bind({});
ManyResources.args = { process: process_manyResources };