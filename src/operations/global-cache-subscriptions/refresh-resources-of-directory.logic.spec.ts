import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { screen } from '@testing-library/react';

import { uriHelper } from '@app/base/utils/uri-helper';
import { Resource } from '@app/domain/types';
import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { createStoreInstance } from '@app/global-state/store';
import { fileSystemRef, queryClientRef } from '@app/operations/global-modules';
import { createQueryClient } from '@app/ui/Globals';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';
import { renderApp } from '@app-test/utils/render-app';

describe('Refresh resources of currently open directories if any change occurs in the underlying file system [logic]', () => {
  it('If a new folder pops up in the file system in the currently opened directory, the cache should be refreshed', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    await screen.findByRole('row', { name: /testfile1.txt/i });

    let cacheEntriesForCwd = queryClientRef.current.getQueryCache().findAll(
      QUERY_KEYS.RESOURCES_OF_DIRECTORY({
        directoryId: uriHelper.getComparisonKey(
          URI.parse(`${Schemas.inMemory}:///home/testdir`).toJSON(),
        ),
        resolveMetadata: true,
      }),
    );
    expect(cacheEntriesForCwd).toHaveLength(1);
    const initialCachedResourcesOfCwd = cacheEntriesForCwd[0].state.data as Resource[];

    await fileSystemRef.current.createFolder(
      URI.parse(`${Schemas.inMemory}:///home/testdir/name-of-new-folder`),
    );
    await screen.findByRole('row', { name: /name-of-new-folder/i });

    cacheEntriesForCwd = queryClientRef.current.getQueryCache().findAll(
      QUERY_KEYS.RESOURCES_OF_DIRECTORY({
        directoryId: uriHelper.getComparisonKey(
          URI.parse(`${Schemas.inMemory}:///home/testdir`).toJSON(),
        ),
        resolveMetadata: true,
      }),
    );
    expect(cacheEntriesForCwd).toHaveLength(1);
    const cachedResourcesOfCwd = cacheEntriesForCwd[0].state.data as Resource[];
    expect(cachedResourcesOfCwd).toHaveLength(initialCachedResourcesOfCwd.length + 1);
  });
});
