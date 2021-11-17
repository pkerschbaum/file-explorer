import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Shell } from '@app/ui/shell';

import { fakeDeleteProcess, fakePasteProcess } from '@app-test/utils/fake-data';

import { createGlobalDecorator } from '@app-storybook/storybook-utils';

export default {
  title: 'Shell',
  component: Shell,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    createGlobalDecorator({
      preloadedState: {
        explorersSlice: {
          explorerPanels: {
            'panel-id-1': {
              cwd: URI.parse(`${Schemas.inMemory}:///home/testdir`).toJSON(),
            },
          },
          focusedExplorerPanelId: 'panel-id-1',
        },
        processesSlice: {
          processes: [fakePasteProcess, fakeDeleteProcess],
        },
      },
    }),
  ],
} as ComponentMeta<typeof Shell>;

const Template: ComponentStory<typeof Shell> = (args) => <Shell {...args} />;

export const DefaultCase = Template.bind({});
