import { ComponentMeta, ComponentStory } from '@storybook/react';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { fakeFileStat, fakeFileSystem } from '@app/platform/file-system.fake';
import { fileSystemRef } from '@app/operations/global-modules';
import { Shell } from '@app/ui/Shell';

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

      return story();
    },
  ],
} as ComponentMeta<typeof Shell>;

const Template: ComponentStory<typeof Shell> = (args) => <Shell {...args} />;

export const DefaultCase = Template.bind({});
