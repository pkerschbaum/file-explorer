import * as platform from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import type { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { check } from '@app/base/utils/assert.util';
import type { ByteUnit } from '@app/base/utils/byte-size.util';
import { byteSize } from '@app/base/utils/byte-size.util';
import { numbers } from '@app/base/utils/numbers.util';
import { i18n } from '@app/domain/i18n';
import type { ResourceForUI } from '@app/domain/types';
import { RESOURCE_TYPE } from '@app/domain/types';

export const formatter = { bytes, date, resourceExtension, resourcePath, uriSegments };

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

function resourceExtension(resource: Pick<ResourceForUI, 'extension' | 'resourceType'>): string {
  if (
    resource.resourceType === RESOURCE_TYPE.DIRECTORY ||
    check.isNullishOrEmptyString(resource.extension)
  ) {
    return '';
  }

  return resource.extension.substring(1).toUpperCase();
}

function resourcePath(resource: UriComponents): string {
  return URI.from(resource).fsPath;
}

function uriSegments(segments: UriComponents[]): string[] {
  const formattedSegments = segments.map((uriSegment) => resources.basename(URI.from(uriSegment)));

  // if the first segment is empty, it is the root directory of a unix system.
  if (check.isEmptyString(formattedSegments[0])) {
    formattedSegments[0] = '<root>';
  }
  // for windows, make drive letter upper case
  if (platform.isWindows) {
    const driveLetterUpperCased = formattedSegments[0][0].toLocaleUpperCase();
    const remainingPart = formattedSegments[0].slice(1);
    formattedSegments[0] = `${driveLetterUpperCased}${remainingPart}`;
  }

  return formattedSegments;
}
