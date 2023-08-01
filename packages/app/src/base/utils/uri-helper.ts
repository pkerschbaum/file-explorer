import { CustomError } from '#pkg/base/custom-error';
import { network } from '#pkg/base/network';
import { resources } from '#pkg/base/resources';
import { URI, UriComponents } from '#pkg/base/uri';
import { arrays } from '#pkg/base/utils/arrays.util';
import { check } from '#pkg/base/utils/assert.util';

export const uriHelper = {
  parseUri,
  extractBasename,
  extractExtension,
  getComparisonKey,
  splitUriIntoSegments,
  getDistinctParents,
};

function parseUri(scheme: string, path: string): UriComponents {
  if (path === '') {
    throw new Error(`empty uri is not allowed`);
  }

  // use Uri.file to handle specifics of fs paths, see
  // https://github.com/Microsoft/vscode-uri/blob/42f608bc8c934d066127b849081a5eeb7614bb30/src/index.ts#L682-L700
  return scheme === network.Schemas.file ? URI.file(path) : URI.parse(`${scheme}://${path}`);
}

function extractBasename(uri: UriComponents): string {
  return resources.basename(uri);
}

function extractExtension(uri: UriComponents): string | undefined {
  let extension: string | undefined = resources.extname(uri);

  if (check.isEmptyString(extension)) {
    extension = undefined;
  }

  return extension;
}

function getComparisonKey(uri: UriComponents): string {
  return resources.extUri.getComparisonKey(uri);
}

function splitUriIntoSegments(uri: UriComponents): UriComponents[] {
  // compute segments of URI
  let uriSegments: UriComponents[] = [uri];
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

  return uriSegments;
}

function getDistinctParents(resources: UriComponents[]): UriComponents[] {
  return arrays.uniqueValues(
    resources.map((resource) => URI.joinPath(resource, '..')),
    (resource) => uriHelper.getComparisonKey(resource),
  );
}
