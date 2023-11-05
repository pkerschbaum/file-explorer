import { numbers } from '@pkerschbaum/commons-ecma/util/numbers';
import type { NarrowUnion } from '@pkerschbaum/commons-ecma/util/types';
import type { Meta, StoryObj } from '@storybook/react';

import { network } from '@file-explorer/code-oss-ecma/network';
import type { PasteProcess } from '@file-explorer/code-oss-ecma/types';
import { PASTE_PROCESS_STATUS } from '@file-explorer/code-oss-ecma/types';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';

import { createStoreInstance } from '#pkg/global-state/store';
import { Box } from '#pkg/ui/components-library';
import { createQueryClient, Globals } from '#pkg/ui/Globals';
import { Process } from '#pkg/ui/process/Process';

import { fakePasteProcessBase } from '#pkg-test/utils/fake-data';

import { initializeStorybookPlatformModules } from '#pkg-storybook/storybook-utils';

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
} as Meta<typeof Process>;

const process_runningDeterminingTotalSize: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE
> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE,
};

export const RunningDeterminingTotalSize: StoryObj = {
  args: { process: process_runningDeterminingTotalSize },
};

const process_performingPaste: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE
> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
};

export const RunningPerformingPaste: StoryObj = {
  args: { process: process_performingPaste },
};

const process_success: NarrowUnion<PasteProcess, 'status', PASTE_PROCESS_STATUS.SUCCESS> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.SUCCESS,
};

export const Success: StoryObj = {
  args: { process: process_success },
};

const process_abortRequested: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.ABORT_REQUESTED
> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.ABORT_REQUESTED,
};

export const AbortRequested: StoryObj = {
  args: { process: process_abortRequested },
};

const process_abortSuccess: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.ABORT_SUCCESS
> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.ABORT_SUCCESS,
};

export const AbortSuccess: StoryObj = {
  args: { process: process_abortSuccess },
};

const process_failure: NarrowUnion<PasteProcess, 'status', PASTE_PROCESS_STATUS.FAILURE> = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.FAILURE,
  error: 'fake-error',
};

export const Failure: StoryObj = {
  args: { process: process_failure },
};

const process_manyResources: NarrowUnion<
  PasteProcess,
  'status',
  PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE
> = {
  ...fakePasteProcessBase,
  sourceUris: numbers
    .sequence({ fromInclusive: 1, toInclusive: 100 })
    .map((number) =>
      uriHelper.parseUri(
        network.Schemas.file,
        `/home/testdir/testfile-${number.toString().padStart(5, '0')}.txt`,
      ),
    ),
  status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
};

export const ManyResources: StoryObj = {
  args: { process: process_manyResources },
};
