import { MatchImageSnapshotOptions, toMatchImageSnapshot } from 'jest-image-snapshot';

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * Extend toMatchImageSnapshot of "jest-image-snapshot": Allow to pass just an "identifierSuffix"
       * string to toMatchImageSnapshot. That identifier will get added to the end of the default identifier.
       */
      toMatchImageSnapshot(identifierSuffix: string): R;
    }
  }
}

expect.extend({
  /**
   * Extend toMatchImageSnapshot of "jest-image-snapshot": Allow to pass just an "identifierSuffix"
   * string to toMatchImageSnapshot. That identifier will get added to the end of the default identifier.
   */
  toMatchImageSnapshot(received, args?: string | MatchImageSnapshotOptions) {
    let matchImageSnapshotOptions: MatchImageSnapshotOptions = {};
    if (typeof args === 'string') {
      matchImageSnapshotOptions = {
        customSnapshotIdentifier: ({ defaultIdentifier }) => `${defaultIdentifier}_${args}`,
      };
    } else if (args !== undefined) {
      matchImageSnapshotOptions = args;
    }

    return (toMatchImageSnapshot as any).call(this, received, matchImageSnapshotOptions);
  },
});
