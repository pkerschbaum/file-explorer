module.exports = {
  '**/*.{ts,tsx}': ['eslint --max-warnings 0'],
  '**/*': ['prettier --write --ignore-unknown'],
  'yarn.lock': [() => 'yarn run compile-language-extensions-into-json-file'],
};
