module.exports = {
  root: true,
  env: {
    'react-native/react-native': true,
    es2021: true,
  },
  extends: [
    '@react-native/eslint-config',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react-native'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'off',
    'react-compiler/react-compiler': 'off',
    'react-hooks/immutability': 'off',
  },
};
