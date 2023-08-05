import { check } from '@file-explorer/commons-ecma/util/assert.util';

import { platform } from '#pkg/platform';
import { resources } from '#pkg/resources';
import type { ResourceForUI } from '#pkg/types';
import { RESOURCE_TYPE } from '#pkg/types';
import { URI, UriComponents } from '#pkg/uri';

export const formatter = { resourceExtension, resourcePath, uriSegments };

function resourceExtension(resource: Pick<ResourceForUI, 'extension' | 'resourceType'>): string {
  if (
    resource.resourceType === RESOURCE_TYPE.DIRECTORY ||
    check.isNullishOrEmptyString(resource.extension)
  ) {
    return '';
  }

  return resource.extension.slice(1).toUpperCase();
}

function resourcePath(resource: UriComponents): string {
  return URI.fsPath(resource);
}

function uriSegments(segments: UriComponents[]): string[] {
  const formattedSegments = segments.map((uriSegment) => resources.basename(uriSegment));

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
