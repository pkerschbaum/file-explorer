module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.project.json'],
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
    'plugin:n/recommended',
    'plugin:unicorn/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:regexp/recommended',
  ],
  /**
   * add "only-warn" plugin to change all errors to warnings.
   * ESLint is executed via Git hooks with --max-warnings 0 anyways. Transforming all errors to warnings
   * allows to distinguish ESLint warnings from other errors (e.g. TypeScript compile errors) in the
   * code editor (e.g. VS Code).
   */
  plugins: ['only-warn', 'n', 'import', 'jsx-a11y', 'code-import-patterns', 'regexp'],
  ignorePatterns: ['.eslintrc.cjs', '**/*.js', 'dist/**/*'],
  rules: {
    curly: 'error',
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    'import/first': 'error',
    'import/namespace': 'off',
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
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        groups: [['builtin', 'external'], 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@file-explorer/**',
            group: 'parent',
          },
          {
            pattern: '#pkg/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '#pkg-test/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '#pkg-storybook/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: '#pkg-playwright/**',
            group: 'parent',
            position: 'after',
          },
        ],
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
      {
        selector: "MemberExpression[object.name='JSON'][property.name='stringify']",
        message:
          '`JSON.stringify` does throw on circular references; it might be safe were you attempt to use it, ' +
          'but we suggest to just use `jsonUtil.safeStringify` from @pkerschbaum/commons-ecma/util/json instead.',
      },
      {
        selector:
          "MemberExpression[object.name='URI'][property.name='from'], MemberExpression[object.property.name='URI'][property.name='from']",
        message:
          '`URI` instances should only be used at the "boundary" to `@pkerschbaum/code-oss-*` packages, ' +
          'so using `URI.from` is discouraged; consider working with `UriComponents` instead (which is serializable in contrast to `URI`).',
      },
    ],
    'n/no-deprecated-api': 'off',
    'n/no-missing-import': 'off',
    'n/no-process-env': 'error',
    'n/no-unpublished-import': 'off',
    'n/no-unpublished-require': 'off',
    'n/no-unsupported-features/es-syntax': 'off',
    'n/process-exit-as-throw': 'off',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'playwright/no-force-option': 'off',
    'playwright/no-wait-for-timeout': 'off',
    'playwright/prefer-web-first-assertions': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-await-expression-member': 'off',
    'unicorn/no-negated-condition': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-string-replace-all': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prevent-abbreviations': 'off',
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
    // `no-duplicate-type-constituents` might remove types which can be considered as "documentation" (e.g. `e: WindowEventMap['focus'] | WindowEventMap['blur']`)
    '@typescript-eslint/no-duplicate-type-constituents': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-meaningless-void-operator': 'error',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-namespace': [
      'error',
      {
        // namespace can be useful to group related typings
        allowDeclarations: true,
      },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    // `no-unsafe-enum-comparison` has false positives (numbers compared with number-enums)
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
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
};
