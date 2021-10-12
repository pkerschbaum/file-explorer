import { matchSorter, MatchSorterOptions } from 'match-sorter';

export const arrays = {
  isNullishOrEmpty,
  flatten,
  uniqueValues,
  shallowCopy,
  reverse,
  pickElementAndRemove,
  partitionArray,
  wrap,
};

function isNullishOrEmpty(arr: Array<any> | undefined | null): boolean {
  return arr === undefined || arr === null || arr.length === 0;
}

function flatten<T>(array: T[][]): T[] {
  return array.reduce((flat, toFlatten) => {
    for (const elem of toFlatten) {
      flat = flat.concat(elem);
    }
    return flat;
  }, []);
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
  return array.slice();
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
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
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

function wrap<T>(array: T[]) {
  let currentVal = array;
  const wrapper = {
    stableSort: (compareFn: (a: T, b: T) => number) => {
      currentVal = currentVal.sort(compareFn);
      return wrapper;
    },
    matchSort: (value: string, options?: MatchSorterOptions<T>) => {
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
    pickElementAndRemove: (elementIndex: number) => {
      return pickElementAndRemove(currentVal, elementIndex);
    },
    getValue: () => currentVal,
  };
  return wrapper;
}
