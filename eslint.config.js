import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import importPlugin from 'eslint-plugin-import'
import jsdoc from 'eslint-plugin-jsdoc'
import n from 'eslint-plugin-n'

export default tseslint.config({
  languageOptions: {
    parser: tseslint.parser,
    sourceType: 'module',
    parserOptions: {
      project: './tsconfig.json',
    },
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.es2021,
    },
  },
  files: ['src/**/*.ts'],
  plugins: {
    '@typescript-eslint': tseslint.plugin,
    import: importPlugin,
    jsdoc: jsdoc,
    n: n,
  },
  extends: [eslint.configs.recommended, ...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked, jsdoc.configs['flat/recommended']],
  rules: {
    'jsdoc/require-returns-description': 'off',
    '@typescript-eslint/non-nullable-type-assertion-style': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-extraneous-class': 'off',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
})
