import * as codeOSSResources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import * as CodeOSSURI from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import type { UriComponents } from '@app/base/uri';

export type CoordinationArgs = codeOSSResources.CoordinationArgs;
export type ReportProgressArgs = codeOSSResources.ReportProgressArgs;

export const resources = {
  isEqual(
    uri1: UriComponents | undefined,
    uri2: UriComponents | undefined,
    ignoreFragment = false,
  ): boolean {
    return codeOSSResources.isEqual(
      uri1 === undefined ? undefined : CodeOSSURI.URI.from(uri1),
      uri2 === undefined ? undefined : CodeOSSURI.URI.from(uri2),
      ignoreFragment,
    );
  },

  isEqualOrParent(
    base: UriComponents,
    parentCandidate: UriComponents,
    ignoreFragment = false,
  ): boolean {
    return codeOSSResources.isEqualOrParent(
      CodeOSSURI.URI.from(base),
      CodeOSSURI.URI.from(parentCandidate),
      ignoreFragment,
    );
  },

  basenameOrAuthority(resource: UriComponents): string {
    return codeOSSResources.basenameOrAuthority(CodeOSSURI.URI.from(resource));
  },

  joinPath(resource: UriComponents, ...pathFragment: string[]): UriComponents {
    return codeOSSResources.joinPath(CodeOSSURI.URI.from(resource), ...pathFragment).toJSON();
  },

  basename(resource: UriComponents): string {
    return codeOSSResources.basename(CodeOSSURI.URI.from(resource));
  },

  extname(resource: UriComponents): string {
    codeOSSResources.extUri;
    return codeOSSResources.extname(CodeOSSURI.URI.from(resource));
  },

  extUri: {
    getComparisonKey(uri: UriComponents, ignoreFragment = false): string {
      return codeOSSResources.extUri.getComparisonKey(CodeOSSURI.URI.from(uri), ignoreFragment);
    },
  },
};
