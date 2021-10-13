import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ProcessCard } from '@app/ui/process/ProcessCard';
import { Providers } from '@app/ui/Providers';
import { fakeClipboard } from '@app/platform/clipboard.fake';
import { fakeFileIconTheme } from '@app/platform/file-icon-theme.fake';
import { fakeFileSystem } from '@app/platform/file-system.fake';
import { fakeNativeHost } from '@app/platform/native-host.fake';
import { fakeStorage } from '@app/platform/storage.fake';
import { DELETE_PROCESS_STATUS, PROCESS_TYPE } from '@app/domain/types';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ProcessCard',
  component: ProcessCard,
  decorators: [
    (story) => (
      <Providers
        appDependencies={{
          clipboard: fakeClipboard,
          fileIconTheme: fakeFileIconTheme,
          fileSystem: fakeFileSystem,
          nativeHost: fakeNativeHost,
          storage: fakeStorage,
        }}
      >
        {story()}
      </Providers>
    ),
  ],
} as ComponentMeta<typeof ProcessCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ProcessCard> = (args) => <ProcessCard {...args} />;

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
