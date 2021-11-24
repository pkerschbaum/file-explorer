const { pathsToModuleNameMapper } = require('ts-jest/utils');

const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  globalSetup: './test/global-setup.ts',
  globalTeardown: './test/global-teardown.ts',
  setupFilesAfterEnv: ['./test/setup-after-env.ts'],
  rootDir: '.',
  // exclude all visual tests from Jest (those are executed by Cypress)
  testRegex: 'src/(?!.+\\.visual\\.spec\\.tsx?)(.+\\.spec\\.(?:t|j)sx?)',
  transform: {
    '^.+\\.(?:t|j)sx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
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
