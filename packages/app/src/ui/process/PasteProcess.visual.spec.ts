import { queries } from '@playwright-testing-library/test';
import { expect, test } from '@playwright/test';

import { bootstrap } from '#pkg-playwright/playwright.util';

test.describe('PasteProcess [visual]', () => {
  test('Running Determining Total Size', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--running-determining-total-size',
    });
    const process = await queries.findByLabelText($document, /^Paste Process$/i);
    expect(await process.screenshot()).toMatchSnapshot('running-determining-total-size_1.png');
  });

  test('Running Performing Paste', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--running-performing-paste',
    });
    const process = await queries.findByLabelText($document, /^Paste Process$/i);
    expect(await process.screenshot()).toMatchSnapshot('running-performing-paste_1.png');
  });

  test('Success', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--success',
    });
    const process = await queries.findByLabelText($document, /^Paste Process$/i);
    expect(await process.screenshot()).toMatchSnapshot('success_1.png');
  });

  test('Abort Requested', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--abort-requested',
    });
    const process = await queries.findByLabelText($document, /^Paste Process$/i);
    expect(await process.screenshot()).toMatchSnapshot('abort-requested_1.png');
  });

  test('Abort Success', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--abort-success',
    });
    const process = await queries.findByLabelText($document, /^Paste Process$/i);
    expect(await process.screenshot()).toMatchSnapshot('abort-success_1.png');
  });

  test('Failure', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--failure',
    });
    const process = await queries.findByLabelText($document, /^Paste Process$/i);
    expect(await process.screenshot()).toMatchSnapshot('failure_1.png');
  });

  test('Many Resources', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--many-resources',
    });
    const process = await queries.findByLabelText($document, /^Paste Process$/i);
    expect(await process.screenshot()).toMatchSnapshot('many-resources_1.png');
  });
});
