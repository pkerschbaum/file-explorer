import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import { network } from '#pkg/base/network';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import type { ResourceStat } from '#pkg/domain/types';
import { QUERY_KEYS } from '#pkg/global-cache/query-keys';

import { bootstrap } from '#pkg-playwright/playwright.util';

test.describe('Refresh resources of currently open directories if any change occurs in the underlying file system [logic]', () => {
  test('If a new folder pops up in the file system in the currently opened directory, the cache should be refreshed', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });
    const queryKey = QUERY_KEYS.RESOURCES_OF_DIRECTORY({
      directoryId: uriHelper.getComparisonKey(
        uriHelper.parseUri(network.Schemas.file, `/home/testdir`),
      ),
      resolveMetadata: true,
    });

    await queries.findByRole($document, 'row', { name: /testfile1.txt/i });

    let cacheEntriesForCwd = await page.evaluate((queryKey) => {
      const cacheEntries = globalThis.modules.queryClient.getQueryCache().findAll(queryKey);
      return cacheEntries.map((entry) => ({
        state: entry.state,
      }));
    }, queryKey);
    expect(cacheEntriesForCwd).toHaveLength(1);
    const initialCachedResourcesOfCwd = cacheEntriesForCwd[0].state.data as ResourceStat[];

    const uriToCreate = uriHelper.parseUri(
      network.Schemas.file,
      `/home/testdir/name-of-new-folder`,
    );
    await page.evaluate(
      (uriToCreate) => globalThis.modules.fileSystem.createFolder(uriToCreate),
      uriToCreate,
    );
    await queries.findByRole($document, 'row', { name: /name-of-new-folder/i });

    cacheEntriesForCwd = await page.evaluate((queryKey) => {
      const cacheEntries = globalThis.modules.queryClient.getQueryCache().findAll(queryKey);
      return cacheEntries.map((entry) => ({
        state: entry.state,
      }));
    }, queryKey);
    expect(cacheEntriesForCwd).toHaveLength(1);
    const cachedResourcesOfCwd = cacheEntriesForCwd[0].state.data as ResourceStat[];
    expect(cachedResourcesOfCwd).toHaveLength(initialCachedResourcesOfCwd.length + 1);
  });
});
