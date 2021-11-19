import { Box } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import styled from 'styled-components';

import { createStoreInstance, RootStore } from '@app/global-state/store';
import {
  ExplorerPanel,
  EXPLORER_ACTIONSBAR_GRID_AREA,
  EXPLORER_CWDBREADCRUMBS_GRID_AREA,
  EXPLORER_RESOURCESTABLE_GRID_AREA,
} from '@app/ui/explorer-panel/ExplorerPanel';
import { createQueryClient, Globals } from '@app/ui/Globals';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';

import { loadCssRulesAndAddToStyleTag } from '@app-storybook/storybook-utils';

export default {
  title: 'ExplorerPanel',
  component: ExplorerPanel,
  loaders: [
    loadCssRulesAndAddToStyleTag,
    async () => {
      await initializeFakePlatformModules();
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

export const DefaultCase = Template.bind({});
DefaultCase.args = {
  explorerId: 'test-explorerid',
};

const ExplorerPanelGrid = styled(Box)`
  height: 100%;
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  grid-template-areas:
    '${EXPLORER_CWDBREADCRUMBS_GRID_AREA}'
    '${EXPLORER_ACTIONSBAR_GRID_AREA}'
    '${EXPLORER_RESOURCESTABLE_GRID_AREA}';
`;
