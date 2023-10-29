const baseEslintConfig = require('@file-explorer/config-eslint/eslint-ecma.cjs');

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
            target: /\/src\/file-explorer-agent\/disk-file-service.ts$/,
            allowedPatterns: [
              /^@pkerschbaum\/code-oss-file-service\/out\/vs\/platform\/files\/node\/.+/,
              /^@pkerschbaum\/code-oss-file-service\/out\/vs\/platform\/log\/common\/log$/,
            ],
          },
          {
            target: /\/src\/file-explorer-agent\/blob.ts$/,
            allowedPatterns: ['file-type', 'node:fs', 'sharp'],
          },
          {
            target: /\/src\/file-explorer-agent\/.+$/,
            allowedPatterns: [
              /^@trpc\/server.*/,
              'cors',
              'express',
              /^node:.+/,
              'socket.io',
              'superjson',
            ],
          },
          {
            target: /\/src\/file-explorer-agent-client\/.+$/,
            allowedPatterns: ['@trpc/client', 'superjson', 'socket.io-client'],
          },
          {
            target: /\/scripts\/.+/,
            allowedPatterns: [/.+/],
          },
          {
            target: /.+/,
            allowedPatterns: [
              'dayjs',
              'electron',
              'electron-store',
              'mime',
              'tiny-invariant',
              'zod',
              /^#pkg.+/,
              /^@file-explorer\/.+/,
              /^@pkerschbaum\/code-oss-file-icon-theme/,
            ],
          },
        ],
      },
    ],
  },
};
