import { Emitter } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';

import { PlatformClipboard } from '@app/platform/clipboard';
import { functions } from '@app/base/utils/functions.util';

export const fakeClipboard: PlatformClipboard = {
  readResources: () => [],
  writeResources: functions.noop,
  onClipboardChanged: new Emitter<void>().event,
};
