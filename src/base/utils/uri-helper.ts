import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import * as platform from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { CustomError } from '@app/base/custom-error';
import { arrays } from '@app/base/utils/arrays.util';
import { check } from '@app/base/utils/assert.util';

export const uriHelper = {
  parseUri,
  extractBasename,
  extractExtension,
  getComparisonKey,
  splitUriIntoSegments,
  getDistinctParents,
};

function parseUri(scheme: string, path: string) {
  if (path === '') {
    throw new Error(`empty uri is not allowed`);
  }

  // use Uri.file to handle specifics of fs paths, see
  // https://github.com/Microsoft/vscode-uri/blob/42f608bc8c934d066127b849081a5eeb7614bb30/src/index.ts#L682-L700
  return scheme === Schemas.file ? URI.file(path) : URI.parse(`${scheme}://${path}`);
}

function extractBasename(uri: UriComponents): string {
  return resources.basename(URI.from(uri));
}

function extractExtension(uri: UriComponents): string | undefined {
  let extension: string | undefined = resources.extname(URI.from(uri));

  if (check.isEmptyString(extension)) {
    extension = undefined;
  }

  return extension;
}

function getComparisonKey(uri: UriComponents): string {
  return resources.extUri.getComparisonKey(URI.from(uri));
}

function splitUriIntoSegments(uri: UriComponents) {
  // compute segments of URI
  let uriSegments: URI[] = [URI.from(uri)];
  let currentUriSegment = uriSegments[0];
  let currentIteration = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    currentIteration++;
    if (currentIteration >= 100) {
      throw new CustomError(`could not split URI into its segments!`, {
        currentIteration,
        uri,
      });
    }

    const parentUriSegment = URI.joinPath(currentUriSegment, '..');
    if (resources.isEqual(parentUriSegment, currentUriSegment)) {
      // reached the root of the URI --> stop
      break;
    }

    currentUriSegment = parentUriSegment;
    uriSegments.push(currentUriSegment);
  }
  uriSegments = uriSegments.reverse();

  const segmentsWithFormatting = uriSegments.map((uriSegment) => ({
    uri: uriSegment,
    formatted: resources.basename(uriSegment),
  }));

  // if the first segment is empty, it is the root directory of a unix system.
  if (check.isEmptyString(segmentsWithFormatting[0].formatted)) {
    segmentsWithFormatting[0].formatted = '<root>';
  }
  // for windows, make drive letter upper case
  if (platform.isWindows) {
    const driveLetterUpperCased = segmentsWithFormatting[0].formatted[0].toLocaleUpperCase();
    const remainingPart = segmentsWithFormatting[0].formatted.slice(1);
    segmentsWithFormatting[0].formatted = `${driveLetterUpperCased}${remainingPart}`;
  }

  return segmentsWithFormatting;
}

function getDistinctParents(resources: UriComponents[]): UriComponents[] {
  return arrays.uniqueValues(
    resources.map((resource) => URI.joinPath(URI.from(resource), '..')),
    (resource) => uriHelper.getComparisonKey(resource),
  );
}
