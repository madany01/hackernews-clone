module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'no-return-assign': ['error', 'except-parens'],
    'no-use-before-define': ['error', { functions: false }],
    strict: 'off',
    'lines-between-class-members': 'off',
  },
}
