import * as dotenv from 'dotenv';
dotenv.config();

interface DbConfig {
  hostname: string;
  port: string;
  username: string;
  password: string;
  dbname: string;
}

const dbConfig: DbConfig = {
  hostname: process.env.EXPRESS_APP_DB_HOSTNAME,
  port: process.env.EXPRESS_APP_DB_PORT,
  username: process.env.EXPRESS_APP_DB_USERNAME,
  password: process.env.EXPRESS_APP_DB_PASSSWORD,
  dbname: process.env.EXPRESS_APP_DB_NAME,
};

export default dbConfig;
