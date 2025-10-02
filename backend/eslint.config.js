import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/**', 
      'dist/**', 
      'coverage/**', 
      '*.json',
      'backend/dist/**',
      'scripts/*.js' // Ignore script JavaScript files
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tseslint.parser,
      // Removed project option to avoid TypeScript project errors
      globals: {
        // Node.js global variables
        'process': 'readonly',
        'console': 'readonly',
        'module': 'readonly',
        'require': 'readonly',
        '__dirname': 'readonly',
        '__filename': 'readonly',
        'setTimeout': 'readonly',
        'clearTimeout': 'readonly',
        // Jest globals
        'describe': 'readonly',
        'test': 'readonly',
        'expect': 'readonly',
        'it': 'readonly',
        'jest': 'readonly',
        'beforeEach': 'readonly',
        'afterEach': 'readonly',
        'beforeAll': 'readonly',
        'afterAll': 'readonly',
      }
    },
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
);