// adapted based on https://github.com/bahmutov/local-cypress/blob/2919f2664b29740b390379d30b3eb32928c6445e/postinstall.js
// this script patches "cypress" types to remove global variables

const path = require('path');
const fs = require('fs');

const PACKAGE_TO_FIND = 'cypress';

const relativeScriptPath = path.relative(process.cwd(), __filename);

const debug = (...args) => {
  const [message, ...otherArgs] = args;
  console.debug(`[${relativeScriptPath}] ${message}`, ...otherArgs);
};

function findPackageDirectoryPath() {
  const packageAt = require.resolve(PACKAGE_TO_FIND);
  debug(`"${PACKAGE_TO_FIND}" found at %s`, packageAt);
  const packageDirectoryPath = path.dirname(packageAt);
  return packageDirectoryPath;
}

function noGlobalCy() {
  const packageDirectoryPath = findPackageDirectoryPath();
  const typesDirectoryPath = path.join(packageDirectoryPath, 'types');
  const fileToModify = path.join(typesDirectoryPath, 'index.d.ts');
  debug('loading %s', fileToModify);
  const fileContentOrig = fs.readFileSync(fileToModify, 'utf8');
  const fileContentModified = fileContentOrig
    .replace(
      /^\/\/\/ <reference path="\.\/cypress-global-vars\.d\.ts" \/>$/m,
      '// /// <reference path="./cypress-global-vars.d.ts" />',
    )
    .replace(
      /^\/\/\/ <reference path="\.\/cypress-expect\.d\.ts" \/>$/m,
      '// /// <reference path="./cypress-expect.d.ts" />',
    );

  const somethingChanged = fileContentOrig !== fileContentModified;

  if (somethingChanged) {
    fs.writeFileSync(fileToModify, fileContentModified, 'utf8');
    debug('modified %s', fileToModify);
  } else {
    debug('nothing to change in %s', fileToModify);
  }
}

function noGlobalMocha() {
  const packageDirectoryPath = findPackageDirectoryPath();
  const typesDirectoryPath = path.join(packageDirectoryPath, 'types');
  const fileToModify = path.join(typesDirectoryPath, 'mocha', 'index.d.ts');
  debug('loading %s', fileToModify);
  const fileContentOrig = fs.readFileSync(fileToModify, 'utf8');
  const fileContentModified = fileContentOrig
    .replace(/^declare var describe: /m, '// declare var describe: ')
    .replace(/^declare var xdescribe: /m, '// declare var xdescribe: ')
    .replace(/^declare var before: /m, '// declare var before: ')
    .replace(/^declare var beforeEach: /m, '// declare var beforeEach: ')
    .replace(/^declare var after: /m, '// declare var after: ')
    .replace(/^declare var afterEach: /m, '// declare var afterEach: ')
    .replace(/^declare var context: /m, '// declare var context: ')
    .replace(/^declare var xcontext: /m, '// declare var xcontext: ')
    .replace(/^declare var it: /m, '// declare var it: ')
    .replace(/^declare var test: /m, '// declare var test: ')
    .replace(/^declare var xit: /m, '// declare var xit: ');

  const somethingChanged = fileContentOrig !== fileContentModified;

  if (somethingChanged) {
    fs.writeFileSync(fileToModify, fileContentModified, 'utf8');
    debug('modified %s', fileToModify);
  } else {
    debug('nothing to change in %s', fileToModify);
  }
}

noGlobalCy();
noGlobalMocha();
