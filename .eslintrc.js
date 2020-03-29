const OFF = "off";

module.exports = {
  "extends": [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier",
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  "parser": "@typescript-eslint/parser",
  "env": {
    "node": true,
    "jest": true
  },
  "overrides": [
    {
      "files": ["bench/*"],
      "rules": {
        "@typescript-eslint/no-var-requires": OFF
      }
    }
  ]
};
