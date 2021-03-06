import * as aws from 'aws-sdk';
import {
  ObjectCannedACL,
  PutObjectRequest,
  PutObjectOutput,
  DeleteObjectsRequest,
  Delete,
  DeleteObjectsOutput,
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

  public static async deleteKeys(
    bucket: string,
    keys: string[]
  ): Promise<DeleteObjectsOutput> {
    const objects = keys.map((key) => {
      return {
        Key: key,
      };
    });

    const deleteObject: Delete = {
      Objects: objects,
    };

    const params: DeleteObjectsRequest = {
      Delete: deleteObject,
      Bucket: bucket,
    };

    return new Promise((resolve, reject) => {
      s3.deleteObjects(params, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }

  public static async getSignedFileUrl(
    bucket: string,
    key: string,
    expiresInSeconds = 60 * 60
  ): Promise<string> {
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: expiresInSeconds,
    };

    return s3.getSignedUrlPromise('getObject', params);
  }
}
