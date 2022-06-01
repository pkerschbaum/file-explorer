module.exports = {
  '**/*.{ts,tsx}': ['eslint --max-warnings 0'],
  '**/*': ['prettier --write --ignore-unknown'],
  'pnpm-lock.yaml': [() => 'pnpm run compile-language-extensions-into-json-file'],
};
