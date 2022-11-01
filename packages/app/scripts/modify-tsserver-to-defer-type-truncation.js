/*
 * This script patches "tsserver.js" of "typescript" so that the truncation of type definitions in the
 * VS Code intellisense output does not happen so fast.
 * See also https://github.com/microsoft/TypeScript/issues/26238#issuecomment-672086446.
 */

const path = require('path');
const fs = require('fs');

const PACKAGE_TO_FIND = 'typescript';

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

function modifyTsserverjsToDeferTypeTruncation() {
  const packageDirectoryPath = findPackageDirectoryPath();
  const fileToModify = path.join(packageDirectoryPath, 'tsserver.js');
  debug('loading %s', fileToModify);
  const fileContentOrig = fs.readFileSync(fileToModify, 'utf8');
  const fileContentModified = fileContentOrig.replace(
    /ts\.defaultMaximumTruncationLength = 160;$/m,
    'ts.defaultMaximumTruncationLength = 800;',
  );

  const somethingChanged = fileContentOrig !== fileContentModified;

  if (somethingChanged) {
    fs.writeFileSync(fileToModify, fileContentModified, 'utf8');
    debug('modified %s', fileToModify);
  } else {
    debug('nothing to change in %s', fileToModify);
  }
}

modifyTsserverjsToDeferTypeTruncation();
