import * as codeOSSUri from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

export type UriComponents = codeOSSUri.UriComponents;

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
