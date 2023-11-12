module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  parserOptions: {
    project: true,
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": ["warn", { disallowTypeAnnotations: false }],

    // "warn" is for better DX in IDEs, and will be changed to "error" when running "npm run lint"
    "prettier/prettier": "warn",

    // IDEs already note unused vars
    "@typescript-eslint/no-unused-vars": "off",

    // makes code too verbose
    "@typescript-eslint/unbound-method": "off",

    // what's the point?
    "@typescript-eslint/require-await": "off",
  },
  overrides: [
    {
      files: ["*.js", "*.cjs"],
      extends: ["plugin:@typescript-eslint/disable-type-checked"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["test/**/*"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
}
