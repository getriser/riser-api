const defaultConnectionOptions = {
  entities: ['build/src/entity/**/*.js'],
  migrations: ['build/src/migration/**/*.js'],
  subscribers: ['build/src/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'build/src/entity',
    migrationsDir: 'build/src/migration',
    subscribersDir: 'build/src/subscriber',
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
