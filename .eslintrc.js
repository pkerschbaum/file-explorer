module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
  ],
  plugins: ["node"],
  ignorePatterns: ["**/*.js"],
  rules: {
    "no-extra-boolean-cast": "off",
    "no-inner-declarations": "off",
    "node/no-process-env": "error",
    "node/process-exit-as-throw": "off",
    "node/no-deprecated-api": "off",
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          // empty objects can be useful for Conditional Types
          "{}": false,
        },
        extendDefaults: true,
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-implicit-any-catch": "error",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowBoolean: true,
      },
    ],
  },
};
