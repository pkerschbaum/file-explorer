const baseEslintConfig = require('@file-explorer/config-eslint/eslint.cjs');

module.exports = {
  ...baseEslintConfig,
  parserOptions: {
    ...baseEslintConfig.parserOptions,
    tsconfigRootDir: __dirname,
  },
  rules: {
    ...baseEslintConfig.rules,
    'code-import-patterns/patterns': [
      'error',
      {
        zones: [
          {
            target: /\/src\/util\/arrays\.util\.ts$/,
            allowedPatterns: ['match-sorter'],
          },
          {
            target: /\/src\/util\/json\.util\.ts$/,
            allowedPatterns: ['safe-stable-stringify'],
          },
        ],
      },
    ],
  },
};
