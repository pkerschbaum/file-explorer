module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './cypress/tsconfig.json'],
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
    'plugin:cypress/recommended',
    'plugin:jest-dom/recommended',
  ],
  /**
   * add "only-warn" plugin to change all errors to warnings.
   * ESLint is executed via Git hooks with --max-warnings 0 anyways. Transforming all errors to warnings
   * allows to distinguish ESLint warnings from other errors (e.g. TypeScript compile errors) in the
   * code editor (e.g. VS Code).
   */
  plugins: ['only-warn', 'node', 'import', 'jsx-a11y', 'cypress', 'jest-dom', 'testing-library'],
  ignorePatterns: ['**/*.js'],
  rules: {
    curly: 'error',
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
            pattern: '@app-cypress/**',
            group: 'parent',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always-and-inside-groups',
      },
    ],
    'jsx-a11y/no-autofocus': 'off',
    'no-console': 'error',
    'no-extra-boolean-cast': 'off',
    'no-inner-declarations': 'off',
    'node/no-process-env': 'error',
    'node/process-exit-as-throw': 'off',
    'node/no-deprecated-api': 'off',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
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
    '@typescript-eslint/no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@mui/material'],
            message: 'Import from the component-library instead (@app/ui/component-library).',
          },
        ],
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_\\d+' }],
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
      // enable eslint-plugin-testing-library for "logic" specs
      files: ['**/?(*.)+(logic.spec).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
    {
      // allow default export for Storybook stories and Cypress plugins index file
      files: ['**/*.stories.@(js|jsx|ts|tsx)', 'cypress/plugins/index.@(js|ts)'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      /* allow component-library to import from @mui/material */
      files: ['src/ui/components-library/**/*'],
      rules: {
        '@typescript-eslint/no-restricted-imports': ['off'],
      },
    },
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
};
