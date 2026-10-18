import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import fsdPlugin from 'eslint-plugin-fsd-lint';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  // Базовые конфиги Next.js
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  fsdPlugin.configs.recommended,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    '.history/**',
    'src/shared/api/generated/**',
  ]),
  {
    plugins: {
      fsd: fsdPlugin,
    },
    rules: {
      // Enforces FSD layer import rules (e.g., features cannot import pages)
      'fsd/forbidden-imports': [
        'error',
        {
          // Внутри слоя shared импорты - относительные; алиасы на @/shared не используются
        },
      ],

      // Внутри одного слоя - только относительные пути; алиас на тот же слой запрещён (no-restricted-imports по files)
      'fsd/no-relative-imports': 'off',

      // Enforces importing only via public API (index files)
      'fsd/no-public-api-sidestep': 'error',

      // Prevents direct imports between slices in the same layer
      // eslint-plugin-fsd-lint incorrectly treats deep same-slice relative imports
      // like ../../../../model as cross-slice imports into a "model" slice.
      'fsd/no-cross-slice-dependency': [
        'error',
        {
          ignoreImportPatterns: ['^(\\.\\./)+(api|config|lib|model|ui)(/.*)?$'],
        },
      ],

      // Prevents UI imports in business logic layers (e.g., entities)
      'fsd/no-ui-in-business-logic': 'error',

      // Forbids direct import of the global store
      'fsd/no-global-store-imports': [
        'error',
        {
          // Относительные пути + алиас @session (тот же store, что ../store)
          allowedPaths: ['../store', './store', '@session/model/store'],
        },
      ],

      // Enforces import order based on FSD layers
      'fsd/ordered-imports': 'off',
    },
  },

  // Внутри слоя - без алиаса на этот же слой (только относительные пути)
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/features(/|$)',
              message:
                'Within the features layer use relative imports, not the @/features alias.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/entities(/|$)',
              message:
                'Within the entities layer use relative imports, not the @/entities alias.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/widgets/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/widgets(/|$)',
              message:
                'Within the widgets layer use relative imports, not the @/widgets alias.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/shared(/|$)',
              message:
                'Within the shared layer use relative imports, not the @/shared alias.',
            },
          ],
        },
      ],
    },
  },

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Сортировка импортов
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Внешние библиотеки (самые важные первыми)
            ['^react', '^next', '^@?\\w'], // zustand, lodash и любые другие пакеты
            // Внутренние алиасы слайсов (не @/features|entities/* — иначе fsd/forbidden-imports)

            // 2. Относительные импорты (совпадает с fsd/ordered-imports: non-FSD перед слоями)
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],

            // 3. Слои FSD в правильном порядке (от верхних к нижним)
            ['^@/app'],
            ['^@/processes'],
            ['^@/pages'],
            ['^@/widgets'],
            ['^@/features'],
            ['^@/entities'],
            ['^@/shared'],

            // 4. Стили (scss, css и т.д.)
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Требует LF (\n) вместо CRLF (\r\n) — стандарт для Unix/Git
      'linebreak-style': ['error', 'unix'],

      // Правила импортов
      'import/first': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/no-duplicates': 'error',

      // Запрет дефолтных экспортов (глобально)
      'import/no-default-export': 'error',

      'prettier/prettier': 'error',

      semi: 'off',
      'arrow-body-style': ['error', 'as-needed'],
      'react/self-closing-comp': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-empty': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },

  // Исключения для Next.js App Router
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'import/no-default-export': 'off',
      'import/prefer-default-export': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@/app(/|$)',
              message:
                'Within the app layer use relative imports, not the @/app alias.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/shared/api/**/*.gen.{ts,tsx,js,mjs}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
  // Исключения для конфигов в корне (next.config.ts, eslint.config.mjs и т.д.)
  {
    files: ['*.{js,mjs,ts}'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
]);

export default eslintConfig;
