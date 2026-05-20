/**
 * ESLint Configuration
 * 
 * Configures code quality rules for JavaScript/JSX files.
 * 
 * Extends:
 * - @eslint/js: Base JavaScript rules
 * - react-hooks: Enforces React Hooks best practices
 * - react-refresh: Ensures compatibility with Vite's React refresh
 * 
 * Run: npm run lint (to check code)
 * This helps catch bugs and enforce consistent code style
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
