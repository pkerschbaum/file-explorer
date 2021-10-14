import { Emitter } from 'code-oss-file-service/out/vs/base/common/event';

import { PlatformStorage } from '@app/platform/storage';

export const fakeStorage: PlatformStorage = {
  store: () => undefined,
  get: () => undefined,
  onDataChanged: new Emitter<any>().event,
};
