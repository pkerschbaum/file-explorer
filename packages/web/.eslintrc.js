const baseEslintConfig = require('@file-explorer/config-eslint/eslint.cjs');

module.exports = {
  ...baseEslintConfig,
  parserOptions: {
    ...baseEslintConfig.parserOptions,
    tsconfigRootDir: __dirname,
  },
  extends: [
    ...baseEslintConfig.extends,
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:storybook/recommended',
    'plugin:playwright/playwright-test',
  ],
  rules: {
    ...baseEslintConfig.rules,
    'code-import-patterns/patterns': [
      'error',
      {
        zones: [
          {
            target: /\/src\/global-cache\/.+/,
            allowedPatterns: ['react'],
          },
          {
            target: /\/src\/operations\/global-cache-subscriptions\/.+/,
            allowedPatterns: ['react'],
          },
          {
            target: /\/src\/ui\/components-library\/DesignTokenContext\.tsx$/,
            allowedPatterns: [/^@mui\/material/],
          },
          {
            target: /\/src\/ui\/components-library\/icons\.tsx$/,
            allowedPatterns: [/^@mui\/icons-material/],
          },
          {
            target: /\/src\/ui\/(?!components-library\/icons\.tsx)/,
            forbiddenPatterns: [
              {
                pattern: /^@mui\/icons-material/,
                errorMessage:
                  "Don't import from @mui/icons-material directly. " +
                  'Add a wrapped icon in #pkg/ui/component-library/icons.tsx instead (so that behavior of all icons is consistent).',
              },
            ],
          },
          {
            target: /\/src\/ui\/components-library\/virtualized-list\.ts$/,
            allowedPatterns: ['react-virtual'],
          },
          {
            target: /\/src\/ui\/(?!components-library\/virtualized-list\.ts)/,
            forbiddenPatterns: [
              {
                pattern: /^react-virtual/,
                errorMessage:
                  "Don't import useVirtual from react-virtual directly, import from the component library instead (there is an wrapped version of that hook with important changes).",
              },
            ],
          },
          {
            target: /\/src\/ui\/components-library\/.+/,
            allowedPatterns: [/^@react-aria/, /^@react-stately/],
            forbiddenPatterns: [
              {
                pattern: /^#pkg\/ui\/components-library$/,
                errorMessage:
                  'Inside the components-library, prefer to import directly from the other components instead of the index file.',
              },
            ],
          },
          {
            target: /\/src\/ui\/(?!components-library)/,
            forbiddenPatterns: [
              {
                pattern: /^(?:@react-aria(?!\/utils|\/interactions)|@react-stately)/,
                errorMessage:
                  "Don't import from @react-aria or @react-stately directly. Implement reusable components in the component library (#pkg/ui/component-library).",
              },
              {
                pattern: /^#pkg\/ui\/components-library\/[A-Z].+/,
                errorMessage:
                  'Prefer to just use the import "#pkg/ui/components-library" instead of reaching for the component files.',
              },
            ],
          },
          {
            target: /\/src\/ui\/.+\.stories\.tsx$/,
            allowedPatterns: ['@storybook/react', '@storybook/testing-library'],
          },
          {
            target: /\/src\/ui\/.+\.visual\.spec\.ts$/,
            allowedPatterns: ['@playwright/test', '@playwright-testing-library/test'],
          },
          {
            target: /\/src\/ui\/.+/,
            allowedPatterns: [
              'csstype',
              'd3-color',
              'framer-motion',
              'react',
              'react-dom',
              'styled-components',
              'use-context-selector',
              'use-immer',
              /^@mui\/utils/,
              /^@react-aria\/interactions/,
              /^@react-aria\/utils/,
              /^@react-types/,
              /^@rooks\//,
            ],
          },
          {
            target: /\/src\/.+\.logic\.spec\.ts$/,
            allowedPatterns: ['@playwright/test', '@playwright-testing-library/test'],
          },
          {
            target: /\/src\/index\.ts$/,
            allowedPatterns: ['electron', 'electron-store'],
          },
          {
            target: /\/src\/renderer\.tsx$/,
            allowedPatterns: ['react-dom/client'],
          },
          {
            target: /\/src\/.+/,
            allowedPatterns: ['react-redux', /^react-query/, /^@reduxjs\/toolkit/],
          },
          {
            target: /\/storybook\/.+/,
            allowedPatterns: [/.+/],
          },
          {
            target: /\/test\/.+/,
            allowedPatterns: [/.+/],
          },
          {
            target: /\/playwright\/.+/,
            allowedPatterns: [/.+/],
          },
          {
            target: /.+/,
            allowedPatterns: [
              'dayjs',
              'serialize-error',
              'tiny-invariant',
              'zod',
              /^#pkg.+/,
              /^@file-explorer\/.+/,
            ],
          },
        ],
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
