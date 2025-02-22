import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      node: {
        tryExtensions: ['.ts', '.tsx', '.js', '.json', '.node'],
      },
    },
  },
  // Override ESLint settings for test files
  {
    files: ['__tests__/**/*.ts'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    env: {
      jest: true, // ✅ Enables Jest globals
    },
    rules: {
      'no-undef': 'off', // ✅ Disables undefined variable errors in tests
    },
  },
  // Override ESLint settings for config files
  {
    files: ['drizzle.config.ts', 'jest.config.ts', 'tsup.config.ts'],
    languageOptions: {
      parserOptions: {
        project: null, // ✅ Disables type-checking for these files
      },
    },
  },
  eslintConfigPrettier, // Ensure Prettier is applied at the end
];
