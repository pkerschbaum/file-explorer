import type { ComponentMeta, ComponentStory } from '@storybook/react';
import styled from 'styled-components';

import type { RootStore } from '#pkg/global-state/store';
import { createStoreInstance } from '#pkg/global-state/store';
import { Box } from '#pkg/ui/components-library';
import { ExplorerPanel, EXPLORER_PANEL_GRID_AREA } from '#pkg/ui/explorer-panel/ExplorerPanel';
import { createQueryClient, Globals } from '#pkg/ui/Globals';

import { initializeStorybookPlatformModules } from '#pkg-storybook/storybook-utils';

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
  grid-template-rows: 1fr;
  grid-template-areas: '${EXPLORER_PANEL_GRID_AREA}';
  grid-row-gap: var(--spacing-2);
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
