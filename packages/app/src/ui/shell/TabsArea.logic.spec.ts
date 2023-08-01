import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import { bootstrap } from '#pkg-playwright/playwright.util';

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

  test('ALT+W should close the currently focused tab', async ({ page }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--multiple-tabs' });

    // at the beginning, three tabs should be present, of which the second one should be focused
    let tabs = await queries.findAllByRole($document, 'tab');
    expect(tabs).toHaveLength(3);
    let firstTab = await queries.findByRole($document, 'tab', { name: /home/i });
    const secondTab = await queries.findByRole($document, 'tab', { name: /testdir/i });
    let thirdTab = await queries.findByRole($document, 'tab', { name: /test-folder/i });

    expect(await firstTab.getAttribute('aria-selected')).toEqual('false');
    expect(await secondTab.getAttribute('aria-selected')).toEqual('true');
    expect(await thirdTab.getAttribute('aria-selected')).toEqual('false');

    // close the currently focused tab
    await page.keyboard.press('Alt+w');

    // now, two tabs should be present, of which the first one should be focused
    tabs = await queries.findAllByRole($document, 'tab');
    expect(tabs).toHaveLength(2);
    firstTab = await queries.findByRole($document, 'tab', { name: /home/i });
    thirdTab = await queries.findByRole($document, 'tab', { name: /test-folder/i });

    expect(await firstTab.getAttribute('aria-selected')).toEqual('true');
    expect(await thirdTab.getAttribute('aria-selected')).toEqual('false');
  });
});
