import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { numbers } from '@app/base/utils/numbers.util';
import { PASTE_PROCESS_STATUS, RESOURCE_TYPE } from '@app/domain/types';
import { createStoreInstance } from '@app/global-state/store';
import { getDefaultExplorerCwd } from '@app/operations/app.operations';
import { FileSystemResourceToCreate } from '@app/platform/fake/file-system';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

import {
  fakeDeleteProcess,
  fakePasteProcess,
  fakePasteProcessBase,
} from '@app-test/utils/fake-data';

import { initializeStorybookPlatformModules } from '@app-storybook/storybook-utils';

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
            'panel-1': { cwd },
            'panel-2': { cwd },
            'panel-3': { cwd },
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
        uri: URI.parse(`${Schemas.inMemory}:///home/testdir`),
      },
    ];
    resourcesToCreate = [
      ...resourcesToCreate,
      ...numbers.sequence({ fromInclusive: 1, toInclusive: 1001 }).map((number) => {
        const resource: FileSystemResourceToCreate = {
          type: RESOURCE_TYPE.FILE,
          uri: URI.parse(
            `${Schemas.inMemory}:///home/testdir/testfile-${number
              .toString()
              .padStart(5, '0')}.txt`,
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
