import type { MatchSorterOptions } from 'match-sorter';
import { matchSorter } from 'match-sorter';

export const arrays = {
  flatten,
  uniqueValues,
  shallowCopy,
  reverse,
  pickElementAndRemove,
  partitionArray,
  wrap,
};

function flatten<T>(array: T[][]): T[] {
  let result: T[] = [];
  for (const toFlatten of array) {
    for (const elem of toFlatten) {
      result = [...result, elem];
    }
  }
  return result;
}

function uniqueValues<T, U>(array: T[], getPropToCompare?: (item: T) => U): T[] {
  const result: T[] = [];
  const getThingToCompare = getPropToCompare ?? ((item) => item);

  for (const item of array) {
    if (
      !result.some((existingItem) => getThingToCompare(existingItem) === getThingToCompare(item))
    ) {
      result.push(item);
    }
  }

  return result;
}

function shallowCopy<T>(array: T[]): T[] {
  return [...array];
}

function reverse<T>(array: T[]): T[] {
  return shallowCopy(array).reverse();
}

function pickElementAndRemove<T>(array: T[], elementIndex: number): T | undefined {
  const elementArray = array.splice(elementIndex, 1);
  if (elementArray.length === 0) {
    return undefined;
  }
  return elementArray[0];
}

function partitionArray<T>(
  array: T[],
  options: { countOfPartitions: number } | { itemsPerPartition: number },
): T[][] {
  const partitions: T[][] = [];

  if ('countOfPartitions' in options && options.countOfPartitions !== undefined) {
    const { countOfPartitions } = options;

    for (let i = 0; i < countOfPartitions; i++) {
      partitions[i] = [];
    }
    for (const [i, item] of array.entries()) {
      partitions[i % countOfPartitions].push(item);
    }
  } else if ('itemsPerPartition' in options && options.itemsPerPartition !== undefined) {
    const { itemsPerPartition } = options;

    let currentPartition: T[] = [];
    for (const item of array) {
      if (currentPartition.length === itemsPerPartition) {
        partitions.push(currentPartition);
        currentPartition = [];
      }
      currentPartition.push(item);
    }
    partitions.push(currentPartition);
  }

  return partitions;
}

type ArrayUtilsChainable<T> = {
  stableSort(compareFn: (a: T, b: T) => number): ArrayUtilsChainable<T>;
  matchSort(value: string, options?: MatchSorterOptions<T>): ArrayUtilsChainable<T>;
  shallowCopy(): ArrayUtilsChainable<T>;
  uniqueValues(): ArrayUtilsChainable<T>;
  pickElementAndRemove(elementIndex: number): T | undefined;
  getValue(): T[];
};

function wrap<T>(array: T[]) {
  let currentVal = array;
  const wrapper: ArrayUtilsChainable<T> = {
    stableSort: (compareFn) => {
      currentVal = currentVal.sort(compareFn);
      return wrapper;
    },
    matchSort: (value, options) => {
      currentVal = matchSorter(currentVal, value, options);
      return wrapper;
    },
    shallowCopy: () => {
      currentVal = shallowCopy(currentVal);
      return wrapper;
    },
    uniqueValues: () => {
      currentVal = uniqueValues(currentVal);
      return wrapper;
    },
    pickElementAndRemove: (elementIndex) => {
      return pickElementAndRemove(currentVal, elementIndex);
    },
    getValue: () => currentVal,
  };
  return wrapper;
}
