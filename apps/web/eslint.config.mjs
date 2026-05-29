import baseConfig from '@docgenerator/config/eslint'
import boundaries from 'eslint-plugin-boundaries'

// `views` = FSD "pages" layer (src/pages is reserved by Next.js Pages Router)
const fsdLayers = [
  'shared',
  'entities',
  'features',
  'widgets',
  'views',
  'app',
]

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': fsdLayers.map((layer) => ({
        type: layer,
        pattern: `src/${layer}/**`,
        mode: 'folder',
        capture: ['layer'],
      })),
    },
    rules: {
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'shared', allow: ['shared'] },
            { from: 'entities', allow: ['shared', 'entities'] },
            {
              from: 'features',
              allow: ['shared', 'entities', 'features'],
            },
            {
              from: 'widgets',
              allow: ['shared', 'entities', 'features', 'widgets'],
            },
            {
              from: 'views',
              allow: ['shared', 'entities', 'features', 'widgets', 'views'],
            },
            {
              from: 'app',
              allow: [
                'shared',
                'entities',
                'features',
                'widgets',
                'views',
                'app',
              ],
            },
          ],
        },
      ],
    },
  },
]
