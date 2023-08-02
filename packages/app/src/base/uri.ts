import * as codeOSSUri from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { z } from 'zod';

export const UriComponents = z.object({
  scheme: z.string(),
  path: z.string(),
  authority: z.string().optional(),
  query: z.string().optional(),
  fragment: z.string().optional(),
});
export type UriComponents = z.infer<typeof UriComponents>;

export const URI = {
  file(path: string): UriComponents {
    return codeOSSUri.URI.file(path).toJSON();
  },
  parse(value: string, _strict = false): UriComponents {
    return codeOSSUri.URI.parse(value, _strict).toJSON();
  },
  joinPath(uri: UriComponents, ...pathFragment: string[]): UriComponents {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return codeOSSUri.URI.joinPath(codeOSSUri.URI.from(uri), ...pathFragment).toJSON();
  },
  fsPath(uri: UriComponents): string {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return codeOSSUri.URI.from(uri).fsPath;
  },
  toString(uri: UriComponents): string {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return codeOSSUri.URI.from(uri).toString();
  },
  from(uri: UriComponents): codeOSSUri.URI {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return codeOSSUri.URI.from(uri);
  },
};
