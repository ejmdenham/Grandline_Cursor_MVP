module.exports = {
  root: true,
  env: { node: true, es2022: true },
  extends: ['eslint:recommended'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  ignorePatterns: ['node_modules/', 'apps/mobile/node_modules/', 'dist/', '.expo/'],
  overrides: [
    {
      files: ['apps/mobile/**/*.ts', 'apps/mobile/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
      plugins: ['@typescript-eslint'],
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
  ],
};
