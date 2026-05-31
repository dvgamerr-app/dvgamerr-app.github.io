import pluginJs from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.astro/**', 'static/**', '.cache/**', '.next/**', '.nuxt/**', '.build/**', 'coverage/**'],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, Bun: false },
    },
  },
  pluginJs.configs.recommended,
  perfectionist.configs['recommended-natural'],
  {
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type-import',
            ['value-builtin', 'value-external'],
            'type-internal',
            'value-internal',
            ['type-parent', 'type-sibling', 'type-index'],
            ['value-parent', 'value-sibling', 'value-index'],
            'unknown',
          ],
          ignoreCase: true,
          internalPattern: ['^~/.*'],
          newlinesBetween: 1,
          order: 'asc',
          type: 'natural',
        },
      ],
    },
  },
]
