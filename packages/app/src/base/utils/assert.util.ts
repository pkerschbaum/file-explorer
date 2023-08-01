import type { ObjectLiteral } from '#pkg/base/utils/types.util';

// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
export function assertIsUnreachable(value?: never): never {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`should be unreachable, but got here. value=${value}`);
}

export const check = {
  isNullish,
  isNotNullish,
  isEmptyString,
  isNullishOrEmptyString,
  isNonEmptyString,
  isEmptyObject,
  isValueInEnum,
};

function isNullish<T>(obj: T | undefined | null): obj is undefined | null {
  return obj === undefined || obj === null;
}

function isNotNullish<T>(obj: T | undefined | null): obj is T {
  return !isNullish(obj);
}

function isEmptyString(str: string): str is '' {
  return str.trim().length === 0;
}

function isNullishOrEmptyString(str: string | undefined | null): str is '' | undefined | null {
  return isNullish(str) || isEmptyString(str);
}

function isNonEmptyString(str: string | undefined | null): str is string {
  return !isNullish(str) && !isEmptyString(str);
}

function isEmptyObject(obj: ObjectLiteral): boolean {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}

export function isValueInEnum<T extends string, TEnumValue extends string>(
  enumVariable: { [key in T]: TEnumValue },
  value: string,
): value is TEnumValue {
  const enumValues = Object.values(enumVariable);
  return enumValues.includes(value);
}
