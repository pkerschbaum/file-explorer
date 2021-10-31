import { functions } from '@app/base/utils/functions.util';
import { PlatformFileSystem } from '@app/platform/file-system';

import { fakeFileStat } from '@app-test/fake-data/fake-data';

export const fakeFileSystem: PlatformFileSystem = {
  resolve: () => Promise.resolve(fakeFileStat),
  copy: () => Promise.resolve(fakeFileStat),
  move: () => Promise.resolve(fakeFileStat),
  createFolder: () => Promise.resolve(fakeFileStat),
  del: () => Promise.resolve(),
  watch: () => ({ dispose: functions.noop }),
  onDidFilesChange: () => ({ dispose: functions.noop }),
};
