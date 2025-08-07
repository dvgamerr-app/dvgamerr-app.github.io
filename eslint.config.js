import pluginJs from '@eslint/js'
import perfectionist from 'eslint-plugin-perfectionist'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
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
            'type',
            ['builtin', 'external'],
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          ignoreCase: true,
          internalPattern: ['^~/.*'],
          maxLineLength: undefined,
          newlinesBetween: 'always',
          order: 'asc',
          type: 'natural',
        },
      ],
    },
  },
]
