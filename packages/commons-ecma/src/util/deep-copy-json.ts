import { jsonUtil } from '@pkerschbaum/commons-ecma/util/json';

import type { IsJsonable } from '#pkg/util/types.util';

export function deepCopyJson<T>(inObj: IsJsonable<T>): IsJsonable<T> {
  const stringified = jsonUtil.safeStringify(inObj);
  if (stringified === undefined) {
    return inObj;
  }
  return JSON.parse(stringified);
}
