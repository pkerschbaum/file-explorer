import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { fireEvent, screen } from '@testing-library/react';

import { uriHelper } from '@app/base/utils/uri-helper';
import { Resource } from '@app/domain/types';
import { QUERY_KEYS } from '@app/global-cache/query-keys';
import { createStoreInstance } from '@app/global-state/store';
import { queryClientRef } from '@app/operations/global-modules';
import { createQueryClient } from '@app/ui/Globals';

import { initializeFakePlatformModules } from '@app-test/utils/fake-platform-modules';
import { renderApp } from '@app-test/utils/render-app';

describe('Preload of resources of parent directory and sub directories [logic]', () => {
  it('For the initial current working directory and when switching the CWD, resources should get preloaded', async () => {
    await initializeFakePlatformModules();
    const store = await createStoreInstance();
    const queryClient = createQueryClient();
    renderApp({ queryClient, store });

    await screen.findByRole('row', { name: /zz test folder/i });

    // assert successful preload of parent directory and...
    const cacheEntriesForParentDir = queryClientRef.current.getQueryCache().findAll(
      QUERY_KEYS.RESOURCES_OF_DIRECTORY({
        directoryId: uriHelper.getComparisonKey(URI.parse(`${Schemas.inMemory}:///home`).toJSON()),
      }),
    );
    expect(cacheEntriesForParentDir).toHaveLength(1);
    const cachedResourcesOfParentDirectory = cacheEntriesForParentDir[0].state.data as Resource[];
    expect(cachedResourcesOfParentDirectory).toHaveLength(1);
    expect(
      resources.isEqual(
        URI.from(cachedResourcesOfParentDirectory[0].uri),
        URI.parse(`${Schemas.inMemory}:///home/testdir`),
      ),
    ).toBeTruthy();
    // ...one level of sub directories
    const cacheEntriesForSubDirLevel1 = queryClientRef.current.getQueryCache().findAll(
      QUERY_KEYS.RESOURCES_OF_DIRECTORY({
        directoryId: uriHelper.getComparisonKey(
          URI.parse(`${Schemas.inMemory}:///home/testdir/zz test folder`).toJSON(),
        ),
      }),
    );
    expect(cacheEntriesForSubDirLevel1).toHaveLength(1);

    // the second level of sub directories should not be preloaded yet
    const cacheEntriesForSubDirLevel2 = queryClientRef.current.getQueryCache().findAll(
      QUERY_KEYS.RESOURCES_OF_DIRECTORY({
        directoryId: uriHelper.getComparisonKey(
          URI.parse(
            `${Schemas.inMemory}:///home/testdir/zz test folder/zz test folder sub directory`,
          ).toJSON(),
        ),
      }),
    );
    expect(cacheEntriesForSubDirLevel2).toHaveLength(0);

    // now switch into the sub directory, i.e. one level down
    fireEvent.dblClick(await screen.findByRole('row', { name: /zz test folder/i }));
    await screen.findByRole('row', { name: /zz test folder sub directory/i });

    // now, the second level should also have been preloaded
    const cacheEntriesForSubDirLevel2AfterDirectorySwitch = queryClientRef.current
      .getQueryCache()
      .findAll(
        QUERY_KEYS.RESOURCES_OF_DIRECTORY({
          directoryId: uriHelper.getComparisonKey(
            URI.parse(
              `${Schemas.inMemory}:///home/testdir/zz test folder/zz test folder sub directory`,
            ).toJSON(),
          ),
        }),
      );
    expect(cacheEntriesForSubDirLevel2AfterDirectorySwitch).toHaveLength(1);
    const cachedResourcesOfSubDirLevel2 = cacheEntriesForSubDirLevel2AfterDirectorySwitch[0].state
      .data as Resource[];
    expect(cachedResourcesOfSubDirLevel2).toHaveLength(1);
    expect(
      resources.isEqual(
        URI.from(cachedResourcesOfSubDirLevel2[0].uri),
        URI.parse(
          `${Schemas.inMemory}:///home/testdir/zz test folder/zz test folder sub directory/testfile1.txt`,
        ),
      ),
    ).toBeTruthy();
  });
});
