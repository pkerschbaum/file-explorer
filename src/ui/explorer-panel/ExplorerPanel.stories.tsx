import { Box } from '@mui/material';
import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import styled from 'styled-components';

import { EXPLORER_ACTIONSBAR_GRID_AREA } from '@app/ui/actions-bar';
import { EXPLORER_CWDBREADCRUMBS_GRID_AREA } from '@app/ui/cwd-breadcrumbs';
import {
  ExplorerPanel,
  EXPLORER_RESOURCESTABLE_GRID_AREA,
} from '@app/ui/explorer-panel/ExplorerPanel';

import { createGlobalDecorator } from '@app-storybook/storybook-utils';

export default {
  title: 'ExplorerPanel',
  component: ExplorerPanel,
  decorators: [
    createGlobalDecorator({
      preloadedState: {
        explorersSlice: {
          explorerPanels: {
            'test-explorerid': { cwd: URI.parse(`${Schemas.inMemory}:///home/testdir`).toJSON() },
          },
          focusedExplorerPanelId: 'test-explorerid',
        },
      },
    }),
  ],
} as ComponentMeta<typeof ExplorerPanel>;

const Template: ComponentStory<typeof ExplorerPanel> = (args) => (
  <ExplorerPanelGrid>
    <ExplorerPanel {...args} />
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
