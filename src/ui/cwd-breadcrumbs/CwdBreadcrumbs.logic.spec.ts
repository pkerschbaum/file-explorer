import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import { uriHelper } from '@app/base/utils/uri-helper';

import { bootstrap } from '@app-playwright/playwright.util';

test.describe('CwdBreadcrumbs [logic]', () => {
  test('ActionsMenu - click on "Copy Directory Path" should put the CWD path into the clipboard', async ({
    page,
  }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'shell--simple-case',
    });

    const navBreadcrumbs = await queries.findByRole($document, 'navigation', {
      name: /Breadcrumbs/i,
    });
    const buttonActionsMenuTrigger = await queries.findByRole(navBreadcrumbs, 'link', {
      name: /testdir/i,
    });
    await buttonActionsMenuTrigger.click();
    const menuItemCopyCwd = await queries.findByRole($document, 'menuitem', {
      name: /Copy Directory Path/i,
    });
    await menuItemCopyCwd.click();

    // assert clipboard
    const textInClipboard = await page.evaluate(() =>
      globalThis.modules.nativeHost.clipboard.readText(),
    );
    const actualUri = uriHelper.parseUri(Schemas.file, textInClipboard);
    const expectedUri = uriHelper.parseUri(Schemas.file, '/home/testdir');
    try {
      expect(resources.isEqual(actualUri, expectedUri)).toBeTruthy();
    } catch (e) {
      throw new Error(
        `ActualUri is not equal to ExpectedUri! ` +
          `actualUri=${actualUri.toString()}, expectedUri=${expectedUri.toString()}`,
      );
    }
  });
});
