import ConnectionUtil from '../test-utils/ConnectionUtil';
import FileService from './FileService';
import {
  createMulterFile,
  createOrganization,
  createUser,
} from '../test-utils/Factories';
import { FileFolderType } from '../types';

jest.mock('../managers/S3Manager');

describe('FileService', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
  });

  describe('getFilesFromFolder', () => {
    it('returns all of the files for a given folder', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);

      const parentFolder = await FileService.getRootFolderForOrganization(
        user.id,
        organization.id
      );

      let files = await FileService.getFilesFromFolder(
        user.id,
        parentFolder.id
      );

      expect(files.length).toEqual(0);

      const file: Express.Multer.File = createMulterFile('test-file.pdf');

      await FileService.uploadFile(user.id, parentFolder.id, file);

      files = await FileService.getFilesFromFolder(user.id, parentFolder.id);

      expect(files.length).toEqual(1);
      expect(files[0].parentFolderId).toEqual(parentFolder.id);
      expect(files[0].type).toEqual(FileFolderType.FILE);
      expect(files[0].name).toEqual(file.originalname);

      done();
    });

    it('does not return soft deleted files', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);

      const parentFolder = await FileService.getRootFolderForOrganization(
        user.id,
        organization.id
      );

      let files = await FileService.getFilesFromFolder(
        user.id,
        parentFolder.id
      );

      expect(files.length).toEqual(0);

      const file: Express.Multer.File = createMulterFile('test-file.pdf');

      await FileService.uploadFile(user.id, parentFolder.id, file);

      files = await FileService.getFilesFromFolder(user.id, parentFolder.id);

      expect(files.length).toEqual(1);
      expect(files[0].parentFolderId).toEqual(parentFolder.id);
      expect(files[0].type).toEqual(FileFolderType.FILE);
      expect(files[0].name).toEqual(file.originalname);

      await FileService.deleteFile(user.id, files[0].id);

      files = await FileService.getFilesFromFolder(user.id, parentFolder.id);

      expect(files.length).toEqual(0);

      done();
    });
  });

  describe('deleteFolder', () => {
    it('deletes a folder recursively', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);

      const parentFolder = await FileService.getRootFolderForOrganization(
        user.id,
        organization.id
      );

      const folder1 = await FileService.createFolder(user.id, parentFolder.id, {
        name: 'Folder 1',
      });

      const folder2 = await FileService.createFolder(user.id, folder1.id, {
        name: 'Folder 1 > 2',
      });

      const file = createMulterFile('test-file.pdf');

      await FileService.uploadFile(user.id, folder1.id, file);
      await FileService.uploadFile(user.id, folder2.id, file);

      let files = await FileService.getFilesFromFolder(user.id, folder1.id);

      expect(files.length).toEqual(2);

      files = await FileService.getFilesFromFolder(user.id, folder2.id);

      expect(files.length).toEqual(1);

      await FileService.deleteFolder(user.id, folder1.id);

      files = await FileService.getFilesFromFolder(user.id, parentFolder.id);

      expect(files.length).toEqual(0);

      done();
    });
  });
});
