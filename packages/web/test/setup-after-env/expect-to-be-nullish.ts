declare global {
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Matchers<R> {
      toBeNullish: () => R;
    }
  }
}

expect.extend({
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

export {};
