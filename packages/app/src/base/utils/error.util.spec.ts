import { errorsUtil } from '#pkg/base/utils/errors.util';

describe('errors.util', () => {
  describe('computeVerboseMessageFromError', () => {
    it('given an instance of `Error` then the stack should be returned', () => {
      const actualMessage = errorsUtil.computeVerboseMessageFromError(
        new Error('fake-error-message'),
      );

      // complex regex created by https://ota-meshi.github.io/eslint-plugin-regexp/rules/no-super-linear-backtracking.html
      const regexMultilineError =
        /^Error: fake-error-message\s*at .+(?:[\n\r\u2028\u2029]\s*)?at .+/;
      expect(actualMessage).toMatch(regexMultilineError);
    });

    it('given a string then the string should be returned', () => {
      const actualMessage = errorsUtil.computeVerboseMessageFromError('fake-error-message');

      expect(actualMessage).toMatch('fake-error-message');
    });

    it('given invalid inputs then undefined should get returned', () => {
      expect(errorsUtil.computeVerboseMessageFromError(undefined)).toBeUndefined();
      expect(errorsUtil.computeVerboseMessageFromError(null)).toBeUndefined();
      expect(errorsUtil.computeVerboseMessageFromError(false)).toBeUndefined();
      expect(errorsUtil.computeVerboseMessageFromError(true)).toBeUndefined();
      expect(errorsUtil.computeVerboseMessageFromError({})).toBeUndefined();
      expect(errorsUtil.computeVerboseMessageFromError({ stack: null })).toBeUndefined();
    });
  });
});
