module.exports = {
  'parser': '@babel/eslint-parser',
  'env': {
    'browser': true,
    'jest': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:import/recommended'
  ],
  'plugins': [
    'import'
  ],
  'ignorePatterns': ['/dist/**'],
  'rules': {
    'keyword-spacing': ['warn'],
    'key-spacing': ['warn'],
    'max-len': ['warn', 120, {
      'ignoreComments': true,
      'ignoreStrings': true,
      'ignoreUrls': true,
      'ignoreTemplateLiterals': true,
      'ignoreRegExpLiterals': true
    }],
    'object-curly-spacing': ['warn', 'always'],
    'arrow-parens': 'off',
    'space-in-parens': 'off',
    'no-case-declarations': ['warn'],
    'no-mixed-operators': 'off',
    'eqeqeq': 'off',
    'no-debugger': 'warn',
    'no-empty': 'off',
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always', { 'omitLastInOneLineBlock': true }],
    'no-unused-vars': ['warn'],
    'no-const-assign': ['error'],
    'no-console': ['warn', {
      'allow': [
        'warn',
        'error',
        'debug'
      ]
    }],
    'comma-dangle': ['error', 'only-multiline'],
    'callback-return': 'error'
  },
  globals: {
    module: true,
    promise: true,
    Promise: true,
  }
};
