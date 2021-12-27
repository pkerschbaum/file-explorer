import 'setimmediate';
import '@shopify/polyfills/idle-callback.jest';
import '@testing-library/jest-dom';
import { functions } from '@app/base/utils/functions.util';

// "polyfill" window.matchMedia (https://jestjs.io/docs/26.x/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// add dummy "scrollIntoView" function (https://github.com/jsdom/jsdom/issues/1695)
window.HTMLElement.prototype.scrollIntoView = functions.noop;
