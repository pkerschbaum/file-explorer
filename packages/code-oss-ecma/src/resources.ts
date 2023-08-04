import * as codeOSSResources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import * as CodeOSSURI from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import type { UriComponents } from '#pkg/uri';

export type CoordinationArgs = codeOSSResources.CoordinationArgs;
export type ReportProgressArgs = codeOSSResources.ReportProgressArgs;

export const resources = {
  isEqual(
    uri1: UriComponents | undefined,
    uri2: UriComponents | undefined,
    ignoreFragment = false,
  ): boolean {
    return codeOSSResources.isEqual(
      /* eslint-disable no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here */
      uri1 === undefined ? undefined : CodeOSSURI.URI.from(uri1),
      uri2 === undefined ? undefined : CodeOSSURI.URI.from(uri2),
      /* eslint-enable no-restricted-syntax */
      ignoreFragment,
    );
  },

  isEqualOrParent(
    base: UriComponents,
    parentCandidate: UriComponents,
    ignoreFragment = false,
  ): boolean {
    return codeOSSResources.isEqualOrParent(
      /* eslint-disable no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here */
      CodeOSSURI.URI.from(base),
      CodeOSSURI.URI.from(parentCandidate),
      /* eslint-enable no-restricted-syntax */
      ignoreFragment,
    );
  },

  basenameOrAuthority(resource: UriComponents): string {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return codeOSSResources.basenameOrAuthority(CodeOSSURI.URI.from(resource));
  },

  joinPath(resource: UriComponents, ...pathFragment: string[]): UriComponents {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return codeOSSResources.joinPath(CodeOSSURI.URI.from(resource), ...pathFragment).toJSON();
  },

  basename(resource: UriComponents): string {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return codeOSSResources.basename(CodeOSSURI.URI.from(resource));
  },

  extname(resource: UriComponents): string {
    codeOSSResources.extUri;
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return codeOSSResources.extname(CodeOSSURI.URI.from(resource));
  },

  extUri: {
    getComparisonKey(uri: UriComponents, ignoreFragment = false): string {
      // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
      return codeOSSResources.extUri.getComparisonKey(CodeOSSURI.URI.from(uri), ignoreFragment);
    },
  },
};
