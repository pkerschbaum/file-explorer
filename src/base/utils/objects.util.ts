import { ObjectLiteral, IsJsonable } from '@app/base/utils/types.util';

export const objects = {
  isEmpty,
  isNullish,
  isNotNullish,
  undefinedIfEmpty,
  shallowCopy,
  deepCopyJson,
  shallowIsEqual,
  shallowIsEqualIgnoreFunctions,
  hasMessageProp,
};

function isEmpty(obj: ObjectLiteral) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

function isNullish<T>(obj: T | undefined | null): obj is undefined | null {
  return obj === undefined || obj === null;
}

function isNotNullish<T>(obj: T | undefined | null): obj is T {
  return !isNullish(obj);
}

function undefinedIfEmpty(obj: ObjectLiteral) {
  if (isEmpty(obj)) {
    return undefined;
  }
  return obj;
}

function shallowCopy<T>(inObject: T): T {
  if (typeof inObject !== 'object' || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  } else {
    // shallow copy via object spread
    return { ...inObject };
  }
}

function deepCopyJson<T>(inObj: IsJsonable<T>): IsJsonable<T> {
  return JSON.parse(JSON.stringify(inObj));
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
