export const numbers = {
  roundToDecimals,
  sequence,
};

// like https://stackoverflow.com/a/11832950/1700319, but we use Math.floor to round down
function roundToDecimals(num: number, countOfDecimals: number): number {
  const factor = Math.pow(10, countOfDecimals);
  return Math.floor((num + Number.EPSILON) * factor) / factor;
}

function sequence(options: { fromInclusive: number; toInclusive: number }): number[] {
  return Array.from(
    new Array(options.toInclusive - (options.fromInclusive - 1)),
    (_, i) => i + options.fromInclusive,
  );
}
