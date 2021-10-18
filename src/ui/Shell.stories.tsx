import { ComponentMeta, ComponentStory } from '@storybook/react';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { fakeClipboard } from '@app/platform/clipboard.fake';
import { fakeFileIconTheme } from '@app/platform/file-icon-theme.fake';
import { fakeFileStat, fakeFileSystem } from '@app/platform/file-system.fake';
import { fakeNativeHost } from '@app/platform/native-host.fake';
import { createStoreInstance } from '@app/global-state/store';
import {
  storeRef,
  dispatchRef,
  queryClientRef,
  clipboardRef,
  fileIconThemeRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
} from '@app/operations/global-modules';
import { Providers, queryClient } from '@app/ui/Providers';
import { Shell } from '@app/ui/Shell';
import { createFakePersistentStorage } from '@app/platform/persistent-storage.fake';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shell',
  component: Shell,
  decorators: [
    (story) => {
      queryClientRef.current = queryClient;

      const store = createStoreInstance();
      storeRef.current = store;
      dispatchRef.current = store.dispatch;

      clipboardRef.current = fakeClipboard;
      fileIconThemeRef.current = fakeFileIconTheme;
      fileSystemRef.current = {
        ...fakeFileSystem,
        resolve: (resource) => {
          const fakeFileStat2: IFileStatWithMetadata = {
            ...fakeFileStat,
            isDirectory: true,
            isFile: false,
            isSymbolicLink: false,
            name: 'TEMP',
            resource,
            children: [
              {
                ...fakeFileStat,
                isDirectory: false,
                isFile: true,
                isSymbolicLink: false,
                name: 'testfile.txt',
                resource: URI.joinPath(resource, 'testfile.txt'),
              },
            ],
          };

          return Promise.resolve(fakeFileStat2);
        },
      };
      nativeHostRef.current = fakeNativeHost;
      const fakePersistentStorage = createFakePersistentStorage();
      persistentStorageRef.current = fakePersistentStorage;

      return (
        <div style={{ minHeight: '100%', height: '100%' }}>
          <Providers store={store}>{story()}</Providers>
        </div>
      );
    },
  ],
} as ComponentMeta<typeof Shell>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Shell> = (args) => <Shell {...args} />;

export const DefaultCase = Template.bind({});
