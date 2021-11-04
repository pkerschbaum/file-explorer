import fs from 'fs';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import path from 'path';
import puppeteer from 'puppeteer';

import { createLogger } from '@app/base/logger/logger';

const logger = createLogger(path.parse(__filename).base);

expect.extend({
  toMatchImageSnapshot,
  toBeNullish(received) {
    const pass: boolean = received === undefined || received === null;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const message: () => string = () => (pass ? '' : `Received "${received}"`);

    return {
      message,
      pass,
    };
  },
});

global.beforeAll(async function connectPuppeteer() {
  logger.debug(`connecting puppeteer instance...`);
  try {
    const wsEndpoint = await fs.promises.readFile(
      path.join(__dirname, '..', 'tmp', 'puppeteerEndpoint'),
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
