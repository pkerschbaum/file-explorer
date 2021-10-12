export const strings = {
  isEmpty,
  isNullishOrEmpty,
  isNotNullishOrEmpty,
  capitalizeFirstLetter,
};

function isEmpty(str: string): boolean {
  return str.trim().length === 0;
}

function isNullishOrEmpty(str: string | undefined | null): str is undefined | null | '' {
  return str === undefined || str === null || isEmpty(str);
}

function isNotNullishOrEmpty(str: string | undefined | null): str is string {
  return !isNullishOrEmpty(str);
}

function capitalizeFirstLetter(str: string): string {
  return str.length === 0 ? str : str.charAt(0).toUpperCase() + str.slice(1);
}
