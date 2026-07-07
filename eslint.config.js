import babelParser from '@babel/eslint-parser';
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'eslint/config';
// eslint-disable-next-line import/no-unresolved
import jsConfig from 'eslint-presets/js.config';
import globals from 'globals';


const customConfig = {
  name: 'project-custom-config',
  ignores: ['node_modules/**', 'build/**', 'coverage/**'],
  files: ['**/*.mjs', '**/*.js', '**/*.jsx'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: babelParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
        spread: true,
      },
    },
    globals: {
      ...globals.jest,
      ...globals.node,
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
      },
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
};

export default defineConfig([
  customConfig,
  jsConfig,
]);
