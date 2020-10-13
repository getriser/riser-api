const defaultConnectionOptions = {
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'test',
    password: 'test',
    database: 'riser-api-development',
    synchronize: true,
    dropSchema: true,
    logging: false,
    ...defaultConnectionOptions,
  },
  {
    name: 'test',
    type: 'postgres',
    host: 'localhost',
    port: 5433,
    username: 'test',
    password: 'test',
    database: 'riser-api-test',
    synchronize: true,
    dropSchema: true,
    logging: false,
    ...defaultConnectionOptions,
  },
];
