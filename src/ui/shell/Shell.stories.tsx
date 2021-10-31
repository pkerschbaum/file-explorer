import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { createStoreInstance } from '@app/global-state/store';
import { dispatchRef, fileSystemRef, storeRef } from '@app/operations/global-modules';
import { fakeFileSystem } from '@app/platform/file-system.fake';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

import { fakeDeleteProcess, fakeFileStat, fakePasteProcess } from '@app-test/fake-data/fake-data';

export default {
  title: 'Shell',
  component: Shell,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (story) => {
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
              {
                ...fakeFileStat,
                isDirectory: true,
                isFile: false,
                isSymbolicLink: false,
                name: 'testfolder',
                resource: URI.joinPath(resource, 'testfolder'),
              },
              {
                ...fakeFileStat,
                isDirectory: false,
                isFile: true,
                isSymbolicLink: false,
                name: 'testfile2.docx',
                resource: URI.joinPath(resource, 'testfile2.docx'),
              },
            ],
          };

          return Promise.resolve(fakeFileStat2);
        },
      };

      const queryClient = createQueryClient();
      const store = createStoreInstance({
        preloadedState: {
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
