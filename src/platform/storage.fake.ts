import { Emitter } from 'code-oss-file-service/out/vs/base/common/event';

import { NexStorage } from '@app/platform/storage';

export const fakeStorage: NexStorage = {
  store: () => undefined,
  get: () => undefined,
  onDataChanged: new Emitter<any>().event,
};
