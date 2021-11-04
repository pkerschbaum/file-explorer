/* eslint-disable no-console */

module.exports = async () => {
  console.log('closing puppeteer...');
  await global.__BROWSER__.close();
  console.log('puppeteer closed.');
};
