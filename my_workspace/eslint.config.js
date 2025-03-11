const nx = require('@nx/eslint-plugin');
// const safeql = require('@ts-safeql/eslint-plugin');
// require('dotenv').config();

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  // safeql.configs.connections({
  //   connections: [
  //     {
  //       connectionUrl: process.env.DATABASE_URL,
  //       migrationsDir: './prisma/migrations',
  //       targets: [
  //         { tag: '(prisma|prismaDb|prismaDbExtended).+($queryRaw|$executeRaw|$queryRawUnsafe|$executeRawUnsafe|sql)', transform: '{type}[]' },
  //         { tag: '*.sql' },
  //         { wrapper: '(prisma|prismaDb|prismaDbExtended).+($queryRaw|$executeRaw|$queryRawUnsafe|$executeRawUnsafe|sql)' }
  //       ],
  //     },
  //   ],
  // })
];
