import { ComponentMeta, ComponentStory } from '@storybook/react';
import styled from 'styled-components';

import { createStoreInstance, RootStore } from '@app/global-state/store';
import { Box } from '@app/ui/components-library';
import {
  ExplorerPanel,
  EXPLORER_ACTIONSBAR_GRID_AREA,
  EXPLORER_CWDBREADCRUMBS_GRID_AREA,
  EXPLORER_RESOURCESVIEW_GRID_AREA,
} from '@app/ui/explorer-panel/ExplorerPanel';
import { createQueryClient, Globals } from '@app/ui/Globals';

import { initializeStorybookPlatformModules } from '@app-storybook/storybook-utils';

export default {
  title: 'ExplorerPanel',
  component: ExplorerPanel,
  decorators: [
    (story, { loaded }) => (
      <Globals queryClient={loaded.queryClient} store={loaded.store}>
        {story()}
      </Globals>
    ),
  ],
} as ComponentMeta<typeof ExplorerPanel>;

const Template: ComponentStory<typeof ExplorerPanel> = (args, { loaded }) => (
  <ExplorerPanelGrid>
    <ExplorerPanel
      {...args}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      explorerId={(loaded.store as RootStore).getState().explorersSlice.focusedExplorerPanelId!}
    />
  </ExplorerPanelGrid>
);

const ExplorerPanelGrid = styled(Box)`
  height: 100%;
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  grid-template-areas:
    '${EXPLORER_CWDBREADCRUMBS_GRID_AREA}'
    '${EXPLORER_ACTIONSBAR_GRID_AREA}'
    '${EXPLORER_RESOURCESVIEW_GRID_AREA}';
`;

export const DefaultCase = Template.bind({});
DefaultCase.loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];

export const ErrorsOnCreateFolderAndMove = Template.bind({});
ErrorsOnCreateFolderAndMove.loaders = [
  async () => {
    await initializeStorybookPlatformModules();
    globalThis.modules.fileSystem.createFolder = () => {
      throw new Error(`fake error instance on fileSystem.createFolder`);
    };
    globalThis.modules.fileSystem.move = () => {
      throw `fake string error on fileSystem.move`;
    };
    globalThis.modules.nativeHost.shell.openPath = () => {
      throw new Error(`fake error instance on nativeHost.shell.openPath`);
    };
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    return { store, queryClient };
  },
];
