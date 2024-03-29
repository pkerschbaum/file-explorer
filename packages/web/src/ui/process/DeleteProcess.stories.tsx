import { numbers } from '@pkerschbaum/commons-ecma/util/numbers';
import type { NarrowUnion } from '@pkerschbaum/commons-ecma/util/types';
import type { Meta, StoryObj } from '@storybook/react';

import { network } from '@file-explorer/code-oss-ecma/network';
import type { DeleteProcess } from '@file-explorer/code-oss-ecma/types';
import { DELETE_PROCESS_STATUS } from '@file-explorer/code-oss-ecma/types';
import { URI } from '@file-explorer/code-oss-ecma/uri';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';

import { createStoreInstance } from '#pkg/global-state/store';
import { Box } from '#pkg/ui/components-library';
import { createQueryClient, Globals } from '#pkg/ui/Globals';
import { Process } from '#pkg/ui/process/Process';

import { fakeDeleteProcessBase, fakeFileStat } from '#pkg-test/utils/fake-data';

import { initializeStorybookPlatformModules } from '#pkg-storybook/storybook-utils';

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
    (story) => <Box style={{ maxWidth: 250 }}>{story()}</Box>,
  ],
} as Meta<typeof Process>;

const process_pendingForUserInput: NarrowUnion<
  DeleteProcess,
  'status',
  DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT
> = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT,
};

export const PendingForUserInput: StoryObj = {
  args: { process: process_pendingForUserInput },
};

const process_running: NarrowUnion<DeleteProcess, 'status', DELETE_PROCESS_STATUS.RUNNING> = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.RUNNING,
};

export const Running: StoryObj = {
  args: { process: process_running },
};

const process_success: NarrowUnion<DeleteProcess, 'status', DELETE_PROCESS_STATUS.SUCCESS> = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.SUCCESS,
};

export const Success: StoryObj = {
  args: { process: process_success },
};

const process_failure: NarrowUnion<DeleteProcess, 'status', DELETE_PROCESS_STATUS.FAILURE> = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.FAILURE,
  error: 'fake-error',
};

export const Failure: StoryObj = {
  args: { process: process_failure },
};

const process_veryLongResourceNames: NarrowUnion<
  DeleteProcess,
  'status',
  DELETE_PROCESS_STATUS.RUNNING
> = {
  ...fakeDeleteProcessBase,
  uris: [
    URI.joinPath(fakeFileStat.resource, './very-long-file-nameaaaaaaaaaaaaaaaaaaaaaaaaaaa.txt'),
    ...fakeDeleteProcessBase.uris,
  ],
  status: DELETE_PROCESS_STATUS.RUNNING,
};

export const VeryLongResourceNames = {
  args: { process: process_veryLongResourceNames },
};

const process_manyResources: NarrowUnion<DeleteProcess, 'status', DELETE_PROCESS_STATUS.RUNNING> = {
  ...fakeDeleteProcessBase,
  uris: numbers
    .sequence({ fromInclusive: 1, toInclusive: 100 })
    .map((number) =>
      uriHelper.parseUri(
        network.Schemas.file,
        `/home/testdir/testfile-${number.toString().padStart(5, '0')}.txt`,
      ),
    ),
  status: DELETE_PROCESS_STATUS.RUNNING,
};

export const ManyResources: StoryObj = {
  args: { process: process_manyResources },
};
