import { expect, test } from '@playwright/test';
import { queries } from '@playwright-testing-library/test';

import { bootstrap } from '#pkg-playwright/playwright.util';

test.describe('DeleteProcess [visual]', () => {
  test('Pending for User Input', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-delete--pending-for-user-input',
    });
    const process = await queries.findByLabelText($document, /^delete process$/i);
    expect(await process.screenshot()).toMatchSnapshot('pending-for-user-input_1.png');
  });

  test('Running', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-delete--running',
    });
    const process = await queries.findByLabelText($document, /^delete process$/i);
    expect(await process.screenshot()).toMatchSnapshot('running_1.png');
  });

  test('Success', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-delete--success',
    });
    const process = await queries.findByLabelText($document, /^delete process$/i);
    expect(await process.screenshot()).toMatchSnapshot('success_1.png');
  });

  test('Failure', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-delete--failure',
    });
    const process = await queries.findByLabelText($document, /^delete process$/i);
    expect(await process.screenshot()).toMatchSnapshot('failure_1.png');
  });

  test('Very Long Resource Name', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-delete--very-long-resource-name',
    });
    const process = await queries.findByLabelText($document, /^delete process$/i);
    expect(await process.screenshot()).toMatchSnapshot('very-long-resource-name_1.png');
  });

  test('Many Resources', async ({ page }) => {
    const $document = await bootstrap({
      page,
      storybookIdToVisit: 'processes-delete--many-resources',
    });
    const process = await queries.findByLabelText($document, /^delete process$/i);
    expect(await process.screenshot()).toMatchSnapshot('many-resources_1.png');
  });
});
