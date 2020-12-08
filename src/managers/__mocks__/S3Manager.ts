import {
  DeleteObjectsOutput,
  ObjectCannedACL,
  PutObjectOutput,
} from 'aws-sdk/clients/s3';

export default class MockS3Manager {
  public static upload(
    bucket: string,
    key: string,
    file: Buffer,
    acl: ObjectCannedACL
  ): Promise<PutObjectOutput> {
    const putObjectOutput: PutObjectOutput = {};
    return Promise.resolve(putObjectOutput);
  }

  public static deleteKeys(bucket: string, keys: string[]): Promise<DeleteObjectsOutput> {
    const deleteObjectOutput: DeleteObjectsOutput = {};

    return Promise.resolve(deleteObjectOutput);
  }

  public static getSignedFileUrl(
    bucket: string,
    key: string,
    expiresInSeconds: number
  ): Promise<string> {
    const signedUrl = `https://s3-mock.amazonaws.com/${bucket}/${key}`;

    return Promise.resolve(signedUrl);
  }
}
