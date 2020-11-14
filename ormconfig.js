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
    host: process.env.EXPRESS_APP_DB_HOSTNAME,
    port: process.env.EXPRESS_APP_DB_PORT,
    username: process.env.EXPRESS_APP_DB_USERNAME,
    password: process.env.EXPRESS_APP_DB_PASSSWORD,
    database: process.env.EXPRESS_APP_DB_NAME,
    synchronize: true,
    dropSchema: true,
    logging: false,
    ...defaultConnectionOptions,
  },
];
