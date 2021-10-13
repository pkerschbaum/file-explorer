import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ProcessCard } from '@app/ui/process/ProcessCard';
import { Providers } from '@app/ui/Providers';
import { fakeClipboard } from '@app/platform/logic/clipboard.fake';
import { fakeFileIconTheme } from '@app/platform/logic/file-icon-theme/file-icon-theme.fake';
import { fakeFileSystem } from '@app/platform/logic/file-system.fake';
import { fakeNativeHost } from '@app/platform/logic/native-host.fake';
import { fakeStorage } from '@app/platform/logic/storage.fake';
import { DELETE_PROCESS_STATUS, PROCESS_TYPE } from '@app/platform/file-types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ProcessCard',
  component: ProcessCard,
} as ComponentMeta<typeof ProcessCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ProcessCard> = (args) => (
  <Providers
    appDependencies={{
      clipboard: fakeClipboard,
      fileIconTheme: fakeFileIconTheme,
      fileSystem: fakeFileSystem,
      nativeHost: fakeNativeHost,
      storage: fakeStorage,
    }}
  >
    <ProcessCard {...args} />
  </Providers>
);

export const PendingForUserInput = Template.bind({});
PendingForUserInput.args = {
  process: {
    id: '1',
    type: PROCESS_TYPE.DELETE,
    uris: [
      {
        authority: '',
        fragment: '',
        path: '/home/dir/test-file.txt',
        query: '',
        scheme: 'file',
      },
    ],
    status: DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT,
  },
};
