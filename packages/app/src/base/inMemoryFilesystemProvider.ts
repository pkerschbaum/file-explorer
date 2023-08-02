import * as codeOSSUri from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as codeOSSInMemoryFileSystemProvider from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/inMemoryFilesystemProvider';

import type { IStat } from '#pkg/base/files';
import type { UriComponents } from '#pkg/base/uri';

export class InMemoryFileSystemProvider extends codeOSSInMemoryFileSystemProvider.InMemoryFileSystemProvider {
  public override stat(resource: UriComponents): Promise<IStat> {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return super.stat(codeOSSUri.URI.from(resource));
  }
}
