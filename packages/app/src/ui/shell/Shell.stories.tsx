import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { network } from '#pkg/base/network';
import { URI } from '#pkg/base/uri';
import { numbers } from '#pkg/base/utils/numbers.util';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import { PASTE_PROCESS_STATUS, RESOURCE_TYPE } from '#pkg/domain/types';
import { computeCwdSegmentsFromUri } from '#pkg/global-state/slices/explorers.slice';
import { createStoreInstance } from '#pkg/global-state/store';
import { getDefaultExplorerCwd } from '#pkg/operations/app.operations';
import type { FileSystemResourceToCreate } from '#pkg/platform/fake/file-system';
import { createQueryClient, Globals } from '#pkg/ui/Globals';
import { Shell } from '#pkg/ui/shell';

import {
  fakeDeleteProcess,
  fakePasteProcess,
  fakePasteProcessBase,
} from '#pkg-test/utils/fake-data';

import { initializeStorybookPlatformModules } from '#pkg-storybook/storybook-utils';

export default {
  title: 'Shell',
  component: Shell,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story, { loaded }) => (
      <Globals queryClient={loaded.queryClient} store={loaded.store}>
        {story()}
      </Globals>
    ),
  ],
} as ComponentMeta<typeof Shell>;

const Template: ComponentStory<typeof Shell> = (args) => <Shell {...args} />;

export const SimpleCase = Template.bind({});
(SimpleCase as any).loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];

export const WithProcesses = Template.bind({});
(WithProcesses as any).loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    const store = await createStoreInstance({
      preloadedState: {
        processesSlice: {
          processes: [
            {
              ...fakePasteProcessBase,
              id: 'fake-paste-process-id-2',
              status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
            },
            fakePasteProcess,
            fakeDeleteProcess,
          ],
        },
      },
    });
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];

export const MultipleTabs = Template.bind({});
(MultipleTabs as any).loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    const cwd = await getDefaultExplorerCwd();
    const store = await createStoreInstance({
      preloadedState: {
        explorersSlice: {
          explorerPanels: {
            'panel-1': {
              cwdSegments: computeCwdSegmentsFromUri(URI.joinPath(cwd, '..')),
              version: 1,
            },
            'panel-2': {
              cwdSegments: computeCwdSegmentsFromUri(cwd),
              version: 1,
            },
            'panel-3': {
              cwdSegments: computeCwdSegmentsFromUri(URI.joinPath(cwd, 'test-folder')),
              version: 1,
            },
          },
          focusedExplorerPanelId: 'panel-2',
        },
      },
    });
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];

export const ManyResources = Template.bind({});
(ManyResources as any).loaders = [
  async () => {
    let resourcesToCreate: FileSystemResourceToCreate[] = [
      {
        type: RESOURCE_TYPE.DIRECTORY,
        uri: uriHelper.parseUri(network.Schemas.file, `/home/testdir`),
      },
    ];
    resourcesToCreate = [
      ...resourcesToCreate,
      ...numbers.sequence({ fromInclusive: 1, toInclusive: 1001 }).map((number) => {
        const resource: FileSystemResourceToCreate = {
          type: RESOURCE_TYPE.FILE,
          uri: uriHelper.parseUri(
            network.Schemas.file,
            `/home/testdir/testfile-${number.toString().padStart(5, '0')}.txt`,
          ),
        };
        return resource;
      }),
    ];

    await initializeStorybookPlatformModules({ createFileSystemArgs: { resourcesToCreate } });
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];
