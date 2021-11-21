import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { check } from '@app/base/utils/assert.util';

export type ResourceUIDescription = {
  resourceName: string;
  extension?: string;
};

export const uriHelper = {
  parseUri(scheme: string, path: string) {
    if (path === '') {
      throw new Error(`empty uri is not allowed`);
    }

    // use Uri.file to handle specifics of fs paths, see
    // https://github.com/Microsoft/vscode-uri/blob/42f608bc8c934d066127b849081a5eeb7614bb30/src/index.ts#L682-L700
    return scheme === Schemas.file ? URI.file(path) : URI.parse(`${scheme}://${path}`);
  },

  extractNameAndExtension(uri: UriComponents): ResourceUIDescription {
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
  },

  getComparisonKey(uri: UriComponents): string {
    return resources.extUri.getComparisonKey(URI.from(uri));
  },
};
