// see setupAfterEnv.ts for implementations of the jest extensions
import puppeteer from 'puppeteer';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeNullish(): R;
    }
  }

  // eslint-disable-next-line no-var
  var __BROWSER__: puppeteer.Browser;
}

export {};
