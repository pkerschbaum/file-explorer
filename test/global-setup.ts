/* eslint-disable no-console */
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';

const TMP_PATH = path.join(__dirname, '..', 'tmp');
const TMP_PUPPETEER_ENDPOINT_PATH = path.join(TMP_PATH, 'puppeteerEndpoint');

module.exports = async () => {
  console.log('making sure the storybook server is running...');
  try {
    await axios.request({ method: 'GET', url: 'http://localhost:6006' });
    console.log('storybook server is running.');
  } catch (err) {
    console.error('could not reach storybook server!', err);
    throw err;
  }

  console.log('initializing puppeteer...');
  const browser = await puppeteer.launch();
  global.__BROWSER__ = browser;
  await fs.promises.mkdir(TMP_PATH, { recursive: true });
  await fs.promises.writeFile(TMP_PUPPETEER_ENDPOINT_PATH, browser.wsEndpoint());
  console.log('puppeteer initialized.');
};
