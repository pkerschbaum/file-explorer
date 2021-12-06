const fs = require('fs');
const stripJsonComments = require('strip-json-comments');
const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = JSON.parse(
  stripJsonComments(fs.readFileSync('./tsconfig.json', 'utf8')),
);
const moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/../',
});

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  globalSetup: '../test/global-setup.ts',
  globalTeardown: '../test/global-teardown.ts',
  setupFilesAfterEnv: ['../test/setup-after-env.ts'],
  rootDir: './src',
  // exclude all visual tests from Jest (those are executed by Cypress)
  testRegex: 'src/(?!.+\\.visual\\.spec\\.tsx?)(.+\\.spec\\.(?:t|j)sx?)',
  transform: {
    '^.+\\.(?:t|j)sx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper,
  /**
   * Jest will time out sometimes when loading the tests.
   * It seems like Jest takes the ts-jest compile time into account for the timeout calculation,
   * this can easily take >5 seconds which is the default timeout...
   */
  testTimeout: 30 * 1000, // 30sec
  /**
   * Set ts-jest/tsc option isolatedModules to "true", which reduces the runtime significantly.
   * Some TypeScript compile issues will not surface with this option set, but scripts like the
   * "tsc-watch" script do compile everything, including the tests, anyway.
   */
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
