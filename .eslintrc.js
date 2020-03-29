const OFF = "off";
const ERROR = "error";

module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    jest: true
  },
  plugins: ["import"],
  rules: {
    "import/order": [
      ERROR,
      {
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true }
      }
    ]
  },
  overrides: [
    {
      files: ["bench/*"],
      rules: {
        "@typescript-eslint/no-var-requires": OFF
      }
    }
  ]
};
