import { defineConfig } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default defineConfig(
  {
    ignores: ['dist/**'],
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
        projectService: true,
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeCheckedOnly
)
