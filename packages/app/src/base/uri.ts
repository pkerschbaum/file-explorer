import * as codeOSSUri from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { z } from 'zod';

export const schema_uriComponents = z.object({
  scheme: z.string(),
  path: z.string(),
  authority: z.string().optional(),
  query: z.string().optional(),
  fragment: z.string().optional(),
});
export type UriComponents = z.infer<typeof schema_uriComponents>;

export const URI = {
  file(path: string): UriComponents {
    return codeOSSUri.URI.file(path).toJSON();
  },
  parse(value: string, _strict = false): UriComponents {
    return codeOSSUri.URI.parse(value, _strict).toJSON();
  },
  joinPath(uri: UriComponents, ...pathFragment: string[]): UriComponents {
    return codeOSSUri.URI.joinPath(codeOSSUri.URI.from(uri), ...pathFragment).toJSON();
  },
  fsPath(uri: UriComponents): string {
    return codeOSSUri.URI.from(uri).fsPath;
  },
  toString(uri: UriComponents): string {
    return codeOSSUri.URI.from(uri).toString();
  },
  from(uri: UriComponents): codeOSSUri.URI {
    return codeOSSUri.URI.from(uri);
  },
};
