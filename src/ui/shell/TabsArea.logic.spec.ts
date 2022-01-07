import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import { bootstrap } from '@app-playwright/playwright.util';

test.describe('TabsArea [logic]', () => {
  test('Closing the currently focused tab should focus the previous tab', async ({ page }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--multiple-tabs' });

    const currentlySelectedTab = await queries.findByRole($document, 'tab', { name: /testdir/i });
    expect(await currentlySelectedTab.getAttribute('aria-selected')).toEqual('true');

    const closeButton = await queries.findByRole(currentlySelectedTab, 'button', {
      name: /Close Tab/i,
    });
    await closeButton.click();

    const newSelectedTab = await queries.findByRole($document, 'tab', { name: /home/i });
    expect(await newSelectedTab.getAttribute('aria-selected')).toEqual('true');

    const tabs = await queries.findAllByRole($document, 'tab');
    expect(tabs).toHaveLength(2);
  });

  test('Closing an unfocused tab should not change which tab is currently focused', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--multiple-tabs' });

    const currentlySelectedTab = await queries.findByRole($document, 'tab', {
      name: /testdir/i,
    });
    expect(await currentlySelectedTab.getAttribute('aria-selected')).toEqual('true');
    const nonFocusedTab = await queries.findByRole($document, 'tab', { name: /test-folder/i });
    expect(await nonFocusedTab.getAttribute('aria-selected')).toEqual('false');

    const closeButton = await queries.findByRole(nonFocusedTab, 'button', {
      name: /Close Tab/i,
    });
    await closeButton.click();

    const stillSelectedTab = await queries.findByRole($document, 'tab', { name: /testdir/i });
    expect(await stillSelectedTab.getAttribute('aria-selected')).toEqual('true');

    const tabs = await queries.findAllByRole($document, 'tab');
    expect(tabs).toHaveLength(2);
  });
});
