import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import { uriHelper } from '@app/base/utils/uri-helper';
import { ResourceStat } from '@app/domain/types';
import { QUERY_KEYS } from '@app/global-cache/query-keys';

import { bootstrap } from '@app-playwright/playwright.util';

test.describe(
  'Refresh resources of currently open directories if any change occurs in the underlying file system [logic]',
  () => {
    test('If a new folder pops up in the file system in the currently opened directory, the cache should be refreshed', async ({
      page,
    }) => {
      const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });
      const queryKey = QUERY_KEYS.RESOURCES_OF_DIRECTORY({
        directoryId: uriHelper.getComparisonKey(
          uriHelper.parseUri(Schemas.file, `/home/testdir`).toJSON(),
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

      const uriToCreate = uriHelper
        .parseUri(Schemas.file, `/home/testdir/name-of-new-folder`)
        .toJSON();
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
  },
);
