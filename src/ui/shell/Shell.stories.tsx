import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import {
  DELETE_PROCESS_STATUS,
  PASTE_PROCESS_STATUS,
  Process,
  PROCESS_TYPE,
} from '@app/domain/types';
import { createStoreInstance } from '@app/global-state/store';
import { dispatchRef, fileSystemRef, storeRef } from '@app/operations/global-modules';
import { fakeFileStat, fakeFileSystem } from '@app/platform/file-system.fake';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

const fakePasteProcess: Process = {
  id: 'fake-process-id-1',
  type: PROCESS_TYPE.PASTE,
  pasteShouldMove: false,
  sourceUris: [
    fakeFileStat.resource,
    URI.joinPath(fakeFileStat.resource, './testfile2.docx'),
    URI.joinPath(fakeFileStat.resource, './testfile3.pdf'),
  ],
  destinationFolder: URI.file('/home/dir/'),
  cancellationTokenSource: new CancellationTokenSource(),
  totalSize: 1024 * 1024 * 10, // 10MB
  bytesProcessed: 1024 * 1024 * 2, // 2MB
  progressOfAtLeastOneSourceIsIndeterminate: false,
  status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE,
};

const fakeDeleteProcess: Process = {
  id: 'fake-process-id-2',
  type: PROCESS_TYPE.DELETE,
  uris: [
    fakeFileStat.resource,
    URI.joinPath(fakeFileStat.resource, './testfile2.docx'),
    URI.joinPath(fakeFileStat.resource, './testfile3.pdf'),
  ],
  status: DELETE_PROCESS_STATUS.RUNNING,
};

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
