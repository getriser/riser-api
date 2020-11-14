import dbConfig from './src/config/db';

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
    host: dbConfig.hostname,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.dbname,
    synchronize: true,
    dropSchema: true,
    logging: false,
    ...defaultConnectionOptions,
  },
];
