import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import * as platform from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { CustomError } from '@app/base/custom-error';
import { check } from '@app/base/utils/assert.util';

export type ResourceUIDescription = {
  resourceName: string;
  extension?: string;
};

export const uriHelper = {
  parseUri,
  extractNameAndExtension,
  getComparisonKey,
  splitUriIntoSlugs,
};

function parseUri(scheme: string, path: string) {
  if (path === '') {
    throw new Error(`empty uri is not allowed`);
  }

  // use Uri.file to handle specifics of fs paths, see
  // https://github.com/Microsoft/vscode-uri/blob/42f608bc8c934d066127b849081a5eeb7614bb30/src/index.ts#L682-L700
  return scheme === Schemas.file ? URI.file(path) : URI.parse(`${scheme}://${path}`);
}

function extractNameAndExtension(uri: UriComponents): ResourceUIDescription {
  let resourceName = resources.basename(URI.from(uri));
  let extension: string | undefined = resources.extname(URI.from(uri));

  if (check.isEmptyString(extension)) {
    extension = undefined;
  } else {
    if (resourceName.endsWith(extension)) {
      resourceName = resourceName.substring(0, resourceName.length - extension.length);
    }
  }

  return { resourceName, extension };
}

function getComparisonKey(uri: UriComponents): string {
  return resources.extUri.getComparisonKey(URI.from(uri));
}

function splitUriIntoSlugs(uri: UriComponents) {
  // compute slugs of URI
  let uriSlugs: URI[] = [URI.from(uri)];
  let currentUriSlug = uriSlugs[0];
  let currentIteration = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    currentIteration++;
    if (currentIteration >= 100) {
      throw new CustomError(`could not split URI into its slugs!`, {
        currentIteration,
        uri,
      });
    }

    const parentUriSlug = URI.joinPath(currentUriSlug, '..');
    if (resources.isEqual(parentUriSlug, currentUriSlug)) {
      // reached the root of the URI --> stop
      break;
    }

    currentUriSlug = parentUriSlug;
    uriSlugs.push(currentUriSlug);
  }
  uriSlugs = uriSlugs.reverse();

  const slugsWithFormatting = uriSlugs.map((uriSlug) => ({
    uri: uriSlug,
    formatted: resources.basename(uriSlug),
  }));

  // if the first slug is empty, it is the root directory of a unix system.
  if (check.isEmptyString(slugsWithFormatting[0].formatted)) {
    slugsWithFormatting[0].formatted = '<root>';
  }
  // for windows, make drive letter upper case
  if (platform.isWindows) {
    const driveLetterUpperCased = slugsWithFormatting[0].formatted[0].toLocaleUpperCase();
    const remainingPart = slugsWithFormatting[0].formatted.slice(1);
    slugsWithFormatting[0].formatted = `${driveLetterUpperCased}${remainingPart}`;
  }

  return slugsWithFormatting;
}
