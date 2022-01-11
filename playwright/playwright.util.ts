/* eslint-disable node/no-process-env */
import { getDocument } from '@playwright-testing-library/test';
import { BrowserContext, expect, PlaywrightTestArgs } from '@playwright/test';
import path from 'path';
import * as sinon from 'sinon';

const STORYBOOK_HOST = process.env.STORYBOOK_HOST ?? 'localhost';

export async function bootstrap({
  page,
  storybookIdToVisit,
}: {
  page: PlaywrightTestArgs['page'];
  storybookIdToVisit: string;
}) {
  await Promise.all([
    page.goto(
      `http://${STORYBOOK_HOST}:6006/iframe.html?viewMode=story&args=&id=${storybookIdToVisit}`,
      { waitUntil: 'networkidle' },
    ),
    page.waitForResponse(/fonts\/SegoeUI-VF.ttf/i),
  ]);
  const rootContainer = page.locator('#root > *');
  await expect(rootContainer).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
  const $document = await getDocument(page);
  return $document;
}

declare global {
  // eslint-disable-next-line no-var
  var __clock: sinon.SinonFakeTimers;
}

/**
 * https://github.com/microsoft/playwright/issues/6347#issuecomment-965887758
 */
export async function enableFakeClock({ context }: { context: BrowserContext }) {
  const basePath = require.resolve('sinon');
  await context.addInitScript({
    path: path.join(basePath, '..', '..', 'pkg', 'sinon.js'),
  });
  // Auto-enable sinon right away
  await context.addInitScript(() => {
    window.__clock = sinon.useFakeTimers();
  });
}
