const tsParser = require("@typescript-eslint/parser");
module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      "no-bitwise": "off", 
      "max-len": ["error", { code: 500 }], 
      "@typescript-eslint/naming-convention": "off", 
      "class-methods-use-this": "off", 
      "eqeqeq": ["error", "always"], 
      "semi": ["warn", "always"], 
      "sort-imports": "off", 
      "quotes": ["error", "single"], 
      "no-trailing-spaces": "error", 
      "@typescript-eslint/no-throw-literal": "off", 
      "@typescript-eslint/no-var-requires": "off", 
      "object-shorthand": "off", 
      "@typescript-eslint/ban-types": "off", 
      "guard-for-in": "off", 
      "no-console": "off", 
    },
    ignores: [
      "src/*.js",
      "src/*.js.map",
    ],
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
  },
];