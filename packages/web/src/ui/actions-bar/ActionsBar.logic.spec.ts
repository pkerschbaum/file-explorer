import { expect, test } from '@playwright/test';
import { queries } from '@playwright-testing-library/test';

import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';

import { bootstrap } from '#pkg-playwright/playwright.util';

test.describe('ActionsBar [logic]', () => {
  test('Click on button "Copy" should store selected resources in clipboard and "pasteShouldMove: false" in global-state', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });

    // select some resources and copy them
    const res1 = await queries.findByRole($document, 'row', { name: /aa test folder/i });
    const res2 = await queries.findByRole($document, 'row', { name: /testfile1.txt/i });
    await res1.click();
    await res2.click({ modifiers: ['Control'] });
    const copyButton = await queries.findByRole($document, 'button', { name: /copy/i });
    await copyButton.click();

    // assert clipboard
    const resourcesInClipboard = await page.evaluate(() =>
      globalThis.modules.nativeHost.clipboard.readResources(),
    );
    expect(resourcesInClipboard).toHaveLength(2);
    const actualResource1Basename = uriHelper.extractBasename(resourcesInClipboard[0]);
    expect(actualResource1Basename).toEqual('aa test folder');
    const actualResource2Basename = uriHelper.extractBasename(resourcesInClipboard[1]);
    expect(actualResource2Basename).toEqual('testfile1.txt');

    // assert that "pasteShouldMove" was set to "false" in global state
    const draftPasteState = await page.evaluate(
      () => globalThis.modules.store.getState().processesSlice.draftPasteState,
    );
    expect(draftPasteState).not.toBeUndefined();
    expect(draftPasteState?.pasteShouldMove).toBe(false);
  });

  test('CTRL+C should trigger the "Copy" action (therefore, store selected resources in clipboard and "pasteShouldMove: false" in global-state)', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });

    // select some resources and copy them
    const res1 = await queries.findByRole($document, 'row', { name: /aa test folder/i });
    const res2 = await queries.findByRole($document, 'row', { name: /testfile1.txt/i });
    await res1.click();
    await res2.click({ modifiers: ['Control'] });
    await page.keyboard.press('Control+c');

    // assert clipboard
    const resourcesInClipboard = await page.evaluate(() =>
      globalThis.modules.nativeHost.clipboard.readResources(),
    );
    expect(resourcesInClipboard).toHaveLength(2);
    const actualResource1Basename = uriHelper.extractBasename(resourcesInClipboard[0]);
    expect(actualResource1Basename).toEqual('aa test folder');
    const actualResource2Basename = uriHelper.extractBasename(resourcesInClipboard[1]);
    expect(actualResource2Basename).toEqual('testfile1.txt');

    // assert that "pasteShouldMove" was set to "false" in global state
    const draftPasteState = await page.evaluate(
      () => globalThis.modules.store.getState().processesSlice.draftPasteState,
    );
    expect(draftPasteState).not.toBeUndefined();
    expect(draftPasteState?.pasteShouldMove).toBe(false);
  });

  test('Click on button "Cut" should store selected resources in clipboard and "pasteShouldMove: true" in global-state', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });

    // select some resources and copy them
    const res1 = await queries.findByRole($document, 'row', { name: /aa test folder/i });
    const res2 = await queries.findByRole($document, 'row', { name: /testfile1.txt/i });
    await res1.click();
    await res2.click({ modifiers: ['Control'] });
    const copyButton = await queries.findByRole($document, 'button', { name: /cut/i });
    await copyButton.click();

    // assert clipboard
    const resourcesInClipboard = await page.evaluate(() =>
      globalThis.modules.nativeHost.clipboard.readResources(),
    );
    expect(resourcesInClipboard).toHaveLength(2);
    const actualResource1Basename = uriHelper.extractBasename(resourcesInClipboard[0]);
    expect(actualResource1Basename).toEqual('aa test folder');
    const actualResource2Basename = uriHelper.extractBasename(resourcesInClipboard[1]);
    expect(actualResource2Basename).toEqual('testfile1.txt');

    // assert that "pasteShouldMove" was set to "false" in global state
    const draftPasteState = await page.evaluate(
      () => globalThis.modules.store.getState().processesSlice.draftPasteState,
    );
    expect(draftPasteState).not.toBeUndefined();
    expect(draftPasteState?.pasteShouldMove).toBe(true);
  });

  test('CTRL+X should trigger "Cut" action (therefore, store selected resources in clipboard and "pasteShouldMove: true" in global-state)', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });

    // select some resources and copy them
    const res1 = await queries.findByRole($document, 'row', { name: /aa test folder/i });
    const res2 = await queries.findByRole($document, 'row', { name: /testfile1.txt/i });
    await res1.click();
    await res2.click({ modifiers: ['Control'] });
    await page.keyboard.press('Control+x');

    // assert clipboard
    const resourcesInClipboard = await page.evaluate(() =>
      globalThis.modules.nativeHost.clipboard.readResources(),
    );
    expect(resourcesInClipboard).toHaveLength(2);
    const actualResource1Basename = uriHelper.extractBasename(resourcesInClipboard[0]);
    expect(actualResource1Basename).toEqual('aa test folder');
    const actualResource2Basename = uriHelper.extractBasename(resourcesInClipboard[1]);
    expect(actualResource2Basename).toEqual('testfile1.txt');

    // assert that "pasteShouldMove" was set to "false" in global state
    const draftPasteState = await page.evaluate(
      () => globalThis.modules.store.getState().processesSlice.draftPasteState,
    );
    expect(draftPasteState).not.toBeUndefined();
    expect(draftPasteState?.pasteShouldMove).toBe(true);
  });

  test('if an element has focus, CTRL+C should be disabled and thus not trigger any action', async ({
    page,
  }) => {
    const $document = await bootstrap({ page, storybookIdToVisit: 'shell--simple-case' });

    let resourcesInClipboard = await page.evaluate(() =>
      globalThis.modules.nativeHost.clipboard.readResources(),
    );
    expect(resourcesInClipboard).toHaveLength(0);

    // set focus on "Open" button by first clicking on the Filter textbox and then tab once
    const filterInput = await queries.findByRole($document, 'textbox', { name: /filter/i });
    await filterInput.click();
    await page.keyboard.press('Tab');

    // fire copy shortcut
    await page.keyboard.press('Control+C');

    // shortcut should not have been invoked
    resourcesInClipboard = await page.evaluate(() =>
      globalThis.modules.nativeHost.clipboard.readResources(),
    );
    expect(resourcesInClipboard).toHaveLength(0);
    const draftPasteState = await page.evaluate(
      () => globalThis.modules.store.getState().processesSlice.draftPasteState,
    );
    expect(draftPasteState).toBeUndefined();
  });
});
