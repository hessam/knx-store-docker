module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [],
  rules: {
    // General rules - make them warnings instead of errors for pre-commit
    "no-console": "warn", // Allow console but warn
    "no-debugger": "warn",
    "prefer-const": "warn",
    "no-var": "warn",
    "no-unused-vars": "warn", // Make it a warning instead of error
    "no-case-declarations": "warn",
  },
  overrides: [
    {
      // TypeScript files
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      extends: ["eslint:recommended"],
      rules: {
        "@typescript-eslint/no-unused-vars": "warn",
        "no-unused-vars": "off", // Turn off base rule for TS files
        "no-undef": "off", // TypeScript handles this
      },
    },
    {
      // Test files
      files: [
        "**/*.test.{js,ts,tsx}",
        "**/*.spec.{js,ts,tsx}",
        "**/test/**/*.{js,ts}",
      ],
      env: {
        jest: true,
        node: true,
      },
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
      },
      rules: {
        "no-console": "off",
      },
    },
    {
      // Config files
      files: ["*.config.{js,ts,mjs}", ".eslintrc.{js,cjs}"],
      env: {
        node: true,
      },
      rules: {
        "no-console": "off",
      },
    },
  ],
  ignorePatterns: [
    "dist/",
    "node_modules/",
    ".astro/",
    "storybook-static/",
    "playwright-report/",
    "test-results/",
    "coverage/",
    "*.min.js",
    "public/sw.js",
    // Ignore all Astro files to avoid parsing errors
    "**/*.astro",
    // Ignore problematic directories
    "knx-store/",
  ],
};
