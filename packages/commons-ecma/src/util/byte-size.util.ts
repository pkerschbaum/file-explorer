// derived from https://github.com/75lb/byte-size/blob/master/index.mjs

export const byteSize = {
  probe,
  transform,
};

export type ByteUnit = typeof units[number]['unit'];

const units = [
  { from: 0, to: 1e3, unit: 'B', long: 'bytes' },
  { from: 1e3, to: 1e6, unit: 'kB', long: 'kilobytes' },
  { from: 1e6, to: 1e9, unit: 'MB', long: 'megabytes' },
  { from: 1e9, to: 1e12, unit: 'GB', long: 'gigabytes' },
  { from: 1e12, to: 1e15, unit: 'TB', long: 'terabytes' },
  { from: 1e15, to: 1e18, unit: 'PB', long: 'petabytes' },
  { from: 1e18, to: 1e21, unit: 'EB', long: 'exabytes' },
  { from: 1e21, to: 1e24, unit: 'ZB', long: 'zettabytes' },
  { from: 1e24, to: 1e27, unit: 'YB', long: 'yottabytes' },
] as const;

function probe(numberOfBytes: number) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return units.find((unit) => numberOfBytes >= unit.from && numberOfBytes < unit.to)!;
}

function transform(numberOfBytes: number, unit: ByteUnit): number {
  if (numberOfBytes === 0) {
    return numberOfBytes;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const unitToApply = units.find((unit2) => unit2.unit === unit)!;

  if (unitToApply.from === 0) {
    return numberOfBytes;
  }
  return numberOfBytes / unitToApply.from;
}
