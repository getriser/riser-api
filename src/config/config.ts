import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  jwtSecret: string;
  assetPath: string;
}

const config: Config = {
  jwtSecret: process.env.EXPRESS_APP_JWT_SECRET,
  assetPath: process.env.EXPRESS_APP_ASSET_PATH,
};

export default config;
