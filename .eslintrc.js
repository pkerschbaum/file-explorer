module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:storybook/recommended',
    'plugin:playwright/playwright-test',
    'plugin:eslint-comments/recommended',
  ],
  /**
   * add "only-warn" plugin to change all errors to warnings.
   * ESLint is executed via Git hooks with --max-warnings 0 anyways. Transforming all errors to warnings
   * allows to distinguish ESLint warnings from other errors (e.g. TypeScript compile errors) in the
   * code editor (e.g. VS Code).
   */
  plugins: ['only-warn', 'node', 'import', 'jsx-a11y', 'code-import-patterns'],
  ignorePatterns: ['**/*.js'],
  rules: {
    curly: 'error',
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/no-default-export': 'error',
    'import/no-duplicates': 'error',
    'import/no-dynamic-require': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-relative-packages': 'error', // forbit relative imports, use TS path aliases instead
    'import/no-relative-parent-imports': 'error',
    'import/no-self-import': 'error',
    'import/no-unresolved': 'off',
    'import/no-useless-path-segments': 'error',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@app/**',
            group: 'parent',
          },
          {
            pattern: '@app-test/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '@app-storybook/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '@app-playwright/**',
            group: 'parent',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],
    'jsx-a11y/no-autofocus': 'off',
    'no-console': 'error',
    'no-extra-boolean-cast': 'off',
    'no-inner-declarations': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector:
          "MemberExpression[object.name='it'][property.name='only'], MemberExpression[object.name='test'][property.name='only']",
        message:
          'Do not check in spec files with tests using ".only" - the other tests of that spec file would be skipped!',
      },
      {
        selector:
          "MemberExpression[object.name='it'][property.name='skip'], MemberExpression[object.name='test'][property.name='skip']",
        message: 'Do not check in dead tests. Either fix or delete them.',
      },
      {
        selector: "MemberExpression[object.name='page'][property.name='waitForTimeout']",
        message:
          'Do not check in hard-coded timeouts. If there is no other choice, ' +
          'disable this eslint rule for the line in question and provide an explanation why the rule is needed.',
      },
    ],
    'node/no-process-env': 'error',
    'node/process-exit-as-throw': 'off',
    'node/no-deprecated-api': 'off',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'code-import-patterns/patterns': [
      'error',
      {
        zones: [
          {
            target: /\/src\/base\/utils\/arrays\.util\.ts$/,
            allowedPatterns: ['match-sorter'],
          },
          {
            target: /\/src\/global-cache\/.+/,
            allowedPatterns: ['react'],
          },
          {
            target: /\/src\/operations\/file-icon-theme\.operations\.ts$/,
            allowedPatterns: ['axios'],
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
                  'Add a wrapped icon in @app/ui/component-library/icons.tsx instead (so that behavior of all icons is consistent).',
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
                pattern: /^@app\/ui\/components-library$/,
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
                  "Don't import from @react-aria or @react-stately directly. Implement reusable components in the component library (@app/ui/component-library).",
              },
              {
                pattern: /^@app\/ui\/components-library\/[A-Z].+/,
                errorMessage:
                  'Prefer to just use the import "@app/ui/components-library" instead of reaching for the component files.',
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
            target: /\/src\/platform\/electron\/protocol\/electron-main\/app.ts$/,
            allowedPatterns: ['file-type', 'fs', 'sharp'],
          },
          {
            target: /\/src\/platform\/.+/,
            allowedPatterns: ['electron', 'electron-store'],
          },
          {
            target: /\/src\/index\.ts$/,
            allowedPatterns: ['electron', 'electron-store'],
          },
          {
            target: /\/src\/renderer\.tsx$/,
            allowedPatterns: ['react-dom'],
          },
          {
            target: /\/src\/.+/,
            allowedPatterns: ['react-redux', /^react-query/, /^@reduxjs\/toolkit/],
          },
          {
            target: /\/scripts\/.+/,
            allowedPatterns: [/.+/],
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
              'mime',
              'serialize-error',
              'tiny-invariant',
              /^@app.+/,
              /^@pkerschbaum\/code-oss-file-service/,
              /^@pkerschbaum\/code-oss-file-icon-theme/,
            ],
          },
        ],
      },
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          // empty objects can be useful for Conditional Types
          '{}': false,
        },
        extendDefaults: true,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { overrides: { constructors: 'off' } },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-meaningless-void-operator': 'error',
    '@typescript-eslint/no-namespace': [
      'error',
      {
        // namespace can be useful to group related typings
        allowDeclarations: true,
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_ignored\\d*', argsIgnorePattern: '^_\\d+' },
    ],
    '@typescript-eslint/non-nullable-type-assertion-style': 'error',
    '@typescript-eslint/prefer-enum-initializers': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-literal-enum-member': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/prefer-reduce-type-parameter': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowBoolean: true,
      },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@typescript-eslint/unified-signatures': 'error',
  },
  overrides: [
    {
      // allow default export for Storybook stories
      files: ['**/*.stories.@(js|jsx|ts|tsx)'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
