// adapted based on https://github.com/bahmutov/local-cypress/blob/2919f2664b29740b390379d30b3eb32928c6445e/postinstall.js
// this script patches "cypress" types to remove global variables

const path = require('path');
const fs = require('fs');

const debug = (...args) => {
  const [message, ...otherArgs] = args;
  console.debug(`[remove-cypress-globals.js] ${message}`, ...otherArgs);
};

// returns the types folder
function findCypressTypes() {
  const cypressAt = require.resolve('cypress');
  debug('Cypress found at %s', cypressAt);
  const cypressFolder = path.dirname(cypressAt);
  const typesFolder = path.join(cypressFolder, 'types');
  return typesFolder;
}

function noGlobalCy() {
  const typesFolder = findCypressTypes();
  const cypressTypesFilename = path.join(typesFolder, 'index.d.ts');
  debug('loading %s', cypressTypesFilename);
  const cypressTypesOrig = fs.readFileSync(cypressTypesFilename, 'utf8').trim();
  const cypressTypesModified = cypressTypesOrig
    .replace(
      /^\/\/\/ <reference path="\.\/cypress-global-vars\.d\.ts" \/>$/m,
      '// /// <reference path="./cypress-global-vars.d.ts" />',
    )
    .replace(
      /^\/\/\/ <reference path="\.\/cypress-expect\.d\.ts" \/>$/m,
      '// /// <reference path="./cypress-expect.d.ts" />',
    );

  const somethingChanged = cypressTypesOrig !== cypressTypesModified;

  if (somethingChanged) {
    fs.writeFileSync(cypressTypesFilename, cypressTypesModified, 'utf8');
    debug('modified %s', cypressTypesFilename);
  } else {
    debug('nothing to change in %s', cypressTypesFilename);
  }
}

function noGlobalMocha() {
  const typesFolder = findCypressTypes();
  const mochaTypesFilename = path.join(typesFolder, 'mocha', 'index.d.ts');
  debug('loading %s', mochaTypesFilename);
  const mochaTypesOrig = fs.readFileSync(mochaTypesFilename, 'utf8').trim();
  const mochaTypesModified = mochaTypesOrig
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

  const somethingChanged = mochaTypesOrig !== mochaTypesModified;

  if (somethingChanged) {
    fs.writeFileSync(mochaTypesFilename, mochaTypesModified, 'utf8');
    debug('modified %s', mochaTypesFilename);
  } else {
    debug('nothing to change in %s', mochaTypesFilename);
  }
}

noGlobalCy();
noGlobalMocha();
