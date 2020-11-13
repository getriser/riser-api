import * as dotenv from 'dotenv';
dotenv.config();

interface Config {
  jwtSecret: string;
  assetPath: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  filesS3BucketName: string;
}

const config: Config = {
  jwtSecret: process.env.EXPRESS_APP_JWT_SECRET,
  assetPath: process.env.EXPRESS_APP_ASSET_PATH,
  awsAccessKeyId: process.env.EXPRESS_APP_AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.EXPRESS_APP_AWS_SECRET_ACCESS_KEY,
  filesS3BucketName: process.env.EXPRESS_APP_FILES_S3_BUCKET_NAME,
};

export default config;
