import * as aws from 'aws-sdk';
import {
  ObjectCannedACL,
  PutObjectRequest,
  PutObjectOutput,
} from 'aws-sdk/clients/s3';
import config from '../config/config';

aws.config.update({
  credentials: {
    accessKeyId: config.awsAccessKeyId,
    secretAccessKey: config.awsSecretAccessKey,
  },
});

const s3 = new aws.S3();

export default class S3Manager {
  public static async upload(
    bucket: string,
    key: string,
    file: Buffer,
    acl: ObjectCannedACL = 'private'
  ): Promise<PutObjectOutput> {
    const params: PutObjectRequest = {
      Bucket: bucket,
      Key: key,
      Body: file,
      ACL: acl,
    };

    return new Promise((resolve, reject) => {
      s3.putObject(params, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }
}
