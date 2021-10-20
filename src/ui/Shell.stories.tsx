import { ComponentMeta, ComponentStory } from '@storybook/react';

import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { fakeFileStat, fakeFileSystem } from '@app/platform/file-system.fake';
import { fileSystemRef } from '@app/operations/global-modules';
import { Shell } from '@app/ui/Shell';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shell',
  component: Shell,
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
            ],
          };

          return Promise.resolve(fakeFileStat2);
        },
      };

      return story();
    },
  ],
} as ComponentMeta<typeof Shell>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Shell> = (args) => <Shell {...args} />;

export const DefaultCase = Template.bind({});
