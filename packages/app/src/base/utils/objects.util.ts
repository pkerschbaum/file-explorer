import { json } from '#pkg/base/utils/json.util';
import type { ObjectLiteral, IsJsonable } from '#pkg/base/utils/types.util';

export const objects = {
  shallowCopy,
  deepCopyJson,
  shallowIsEqual,
  shallowIsEqualIgnoreFunctions,
  hasMessageProp,
};

function shallowCopy<T>(inObject: T): T {
  return typeof inObject !== 'object' || inObject === null
    ? // Return the value if inObject is not an object
      inObject
    : // shallow copy via object spread
      { ...inObject };
}

function deepCopyJson<T>(inObj: IsJsonable<T>): IsJsonable<T> {
  const stringified = json.safeStringify(inObj);
  if (stringified === undefined) {
    return inObj;
  }
  return JSON.parse(stringified);
}

// https://stackoverflow.com/a/52323412/1700319
function shallowIsEqual(obj1: ObjectLiteral, objToCompareWith: ObjectLiteral) {
  return (
    Object.keys(obj1).length === Object.keys(objToCompareWith).length &&
    Object.keys(obj1).every(
      (key) =>
        Object.hasOwnProperty.call(objToCompareWith, key) && obj1[key] === objToCompareWith[key],
    )
  );
}

// used for function components, like PureRenderWithoutHandlers https://medium.com/@ryanflorence/react-inline-functions-and-performance-bdff784f5578
function shallowIsEqualIgnoreFunctions(obj1: ObjectLiteral, objToCompareWith: ObjectLiteral) {
  if (Object.keys(obj1).length !== Object.keys(objToCompareWith).length) {
    return false;
  }

  return Object.keys(obj1).every((key) => {
    if (typeof obj1[key] === 'function') {
      return true;
    }

    return Object.hasOwnProperty.call(objToCompareWith, key) && obj1[key] === objToCompareWith[key];
  });
}

function hasMessageProp(obj: unknown): obj is { message: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as { message?: unknown }).message === 'string'
  );
}
