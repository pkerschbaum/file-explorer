import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createStoreInstance } from '@app/global-state/store';
import { dispatchRef, storeRef } from '@app/operations/global-modules';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

import { fakeDeleteProcess, fakePasteProcess } from '@app-test/fake-data/fake-data';

export default {
  title: 'Shell',
  component: Shell,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => {
      const queryClient = createQueryClient();
      const store = createStoreInstance({
        preloadedState: {
          explorersSlice: {
            explorerPanels: {
              'panel-id-1': {
                cwd: URI.parse(`${Schemas.inMemory}:///home/testdir`),
              },
            },
            focusedExplorerPanelId: 'panel-id-1',
          },
          processesSlice: {
            processes: [fakePasteProcess, fakeDeleteProcess],
          },
        },
      });
      storeRef.current = store;
      dispatchRef.current = store.dispatch;

      return (
        <Globals queryClient={queryClient} store={store}>
          {story()}
        </Globals>
      );
    },
  ],
} as ComponentMeta<typeof Shell>;

const Template: ComponentStory<typeof Shell> = (args) => <Shell {...args} />;

export const DefaultCase = Template.bind({});
