import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { check } from '@app/base/utils/assert.util';
import { byteSize, ByteUnit } from '@app/base/utils/byte-size.util';
import { numbers } from '@app/base/utils/numbers.util';
import { i18n } from '@app/domain/i18n';

export const formatter = { bytes, date, resourceBasename, resourceExtension, resourcePath };

function bytes(numberOfBytes: number, options?: { unit: ByteUnit }): string {
  let unitToUse = options?.unit;
  if (unitToUse === undefined) {
    unitToUse = byteSize.probe(numberOfBytes).unit;
  }

  const formattedNumber = numbers
    .roundToDecimals(byteSize.transform(numberOfBytes, unitToUse), 2)
    .toLocaleString(i18n.langLocale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return `${formattedNumber} ${unitToUse}`;
}

function date(unixTs: number): string {
  return new Intl.DateTimeFormat(i18n.dateLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).format(unixTs);
}

function resourceBasename(resource: { name: string; extension?: string }): string {
  if (resource.extension === undefined) {
    return resource.name;
  }

  return `${resource.name}${resource.extension}`;
}

function resourceExtension(resource: { extension?: string }): string {
  if (check.isNullishOrEmptyString(resource.extension)) {
    return '';
  }

  return resource.extension.substring(1).toUpperCase();
}

function resourcePath(resource: UriComponents): string {
  return URI.from(resource).fsPath;
}
