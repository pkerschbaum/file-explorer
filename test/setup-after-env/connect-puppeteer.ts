import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

import { createLogger } from '@app/base/logger/logger';

declare global {
  // eslint-disable-next-line no-var
  var __BROWSER__: puppeteer.Browser;
}

export {};

const logger = createLogger(path.parse(__filename).base);

global.beforeAll(async function connectPuppeteer() {
  logger.debug(`connecting puppeteer instance...`);
  try {
    const wsEndpoint = await fs.promises.readFile(
      path.join(__dirname, '..', '..', 'tmp', 'puppeteerEndpoint'),
      'utf8',
    );
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: wsEndpoint,
    });
    logger.debug(`puppeteer instance connected.`);
  } catch (err) {
    logger.error(`could not connect puppeteer instance!`, err);
    throw err;
  }
});
