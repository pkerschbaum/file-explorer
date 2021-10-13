import { byteSize, ByteUnit } from '@app/base/utils/byte-size.util';
import { numbers } from '@app/base/utils/numbers.util';
import { i18n } from '@app/domain/i18n';

export const formatter = { bytes, file };

function bytes(numberOfBytes: number, options?: { unit: ByteUnit }): string {
  let unitToUse = options?.unit;
  if (unitToUse === undefined) {
    unitToUse = byteSize.probe(numberOfBytes).unit;
  }

  const formattedNumber = numbers
    .roundToDecimals(byteSize.transform(numberOfBytes, unitToUse), 2)
    .toLocaleString(i18n.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return `${formattedNumber} ${unitToUse}`;
}

function file(file: { name: string; extension?: string }): string {
  if (file.extension === undefined) {
    return file.name;
  }

  return `${file.name}${file.extension}`;
}
