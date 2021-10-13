import { Emitter } from 'code-oss-file-service/out/vs/base/common/event';

import { NexClipboard } from '@app/platform/logic/clipboard';
import { functions } from '@app/base/utils/functions.util';

export const fakeClipboard: NexClipboard = {
  readResources: () => [],
  writeResources: functions.noop,
  onClipboardChanged: new Emitter<void>().event,
};
