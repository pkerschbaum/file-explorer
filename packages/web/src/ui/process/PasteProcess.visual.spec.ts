import { expect, test } from '@playwright/test';
import { queries } from '@playwright-testing-library/test';

import { bootstrap, retrieveScreenshot } from '#pkg-playwright/playwright.util';

test.describe('PasteProcess [visual]', () => {
  test('Running Determining Total Size', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--running-determining-total-size',
    });
    const process = await queries.findByLabelText($document, /^paste process$/i);
    expect(await retrieveScreenshot(page, { elementHandle: process })).toMatchSnapshot(
      'running-determining-total-size_1.png',
    );
  });

  test('Running Performing Paste', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--running-performing-paste',
    });
    const process = await queries.findByLabelText($document, /^paste process$/i);
    expect(await retrieveScreenshot(page, { elementHandle: process })).toMatchSnapshot(
      'running-performing-paste_1.png',
    );
  });

  test('Success', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--success',
    });
    const process = await queries.findByLabelText($document, /^paste process$/i);
    expect(await retrieveScreenshot(page, { elementHandle: process })).toMatchSnapshot(
      'success_1.png',
    );
  });

  test('Abort Requested', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--abort-requested',
    });
    const process = await queries.findByLabelText($document, /^paste process$/i);
    expect(await retrieveScreenshot(page, { elementHandle: process })).toMatchSnapshot(
      'abort-requested_1.png',
    );
  });

  test('Abort Success', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--abort-success',
    });
    const process = await queries.findByLabelText($document, /^paste process$/i);
    expect(await retrieveScreenshot(page, { elementHandle: process })).toMatchSnapshot(
      'abort-success_1.png',
    );
  });

  test('Failure', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--failure',
    });
    const process = await queries.findByLabelText($document, /^paste process$/i);
    expect(await retrieveScreenshot(page, { elementHandle: process })).toMatchSnapshot(
      'failure_1.png',
    );
  });

  test('Many Resources', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-paste--many-resources',
    });
    const process = await queries.findByLabelText($document, /^paste process$/i);
    expect(await retrieveScreenshot(page, { elementHandle: process })).toMatchSnapshot(
      'many-resources_1.png',
    );
  });
});
