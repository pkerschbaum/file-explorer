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
};
