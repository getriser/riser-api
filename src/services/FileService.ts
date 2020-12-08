import AbstractService from './AbstractService';
import {
  CreateFolderParams,
  DownloadFileResponse,
  FileFolderType,
  FileResponse,
  OrganizationUserRole,
  SuccessMessage,
  UpdateFileFolderRequest,
} from '../types';
import { getRepository } from 'typeorm';
import FileFolder from '../entity/FileFolder';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import BadRequestApiError from '../errors/BadRequestApiError';
import Organization from '../entity/Organization';
import { User } from '../entity/User';
import { v4 as uuidv4 } from 'uuid';
import S3Manager from '../managers/S3Manager';
import config from '../config/config';
import ForbiddenApiError from '../errors/ForbiddenApiError';

export default class FileService extends AbstractService {
  static async getFilesFromFolder(
    loggedInUserId: number,
    folderId: number
  ): Promise<FileResponse[]> {
    const user = await this.findUserOrThrow(loggedInUserId);

    const filesRepository = getRepository<FileFolder>(FileFolder);

    // This is how you have to reference a soft deleted relation.
    const folder = await filesRepository
      .createQueryBuilder('fileFolder')
      .leftJoinAndSelect(
        'fileFolder.children',
        'child',
        'child.deletedAt IS NULL'
      )
      .where('fileFolder.id = :id', { id: folderId })
      .getOne();

    if (!folder) {
      throw new ResourceNotFoundError('Folder not found.');
    }

    if (folder.type === FileFolderType.FILE) {
      throw new BadRequestApiError(
        'You cannot request files from another file. You must select a folder instead.'
      );
    }

    await this.throwIfNotBelongsToOrganization(user, await folder.organization);

    const files = await folder.children;

    return files.map((file) => this.toFileResponse(file));
  }

  static async createFolder(
    loggedInUserId: number,
    parentFolderId: number,
    createFolderParams: CreateFolderParams
  ): Promise<FileResponse> {
    const user = await this.findUserOrThrow(loggedInUserId);

    const filesRepository = getRepository<FileFolder>(FileFolder);
    const parentFolder = await filesRepository.findOne(parentFolderId);

    if (!parentFolder) {
      throw new ResourceNotFoundError('Folder not found.');
    }

    if (parentFolder.type === FileFolderType.FILE) {
      throw new BadRequestApiError(
        'You cannot add a folder to a file. You can only add a folder to another folder.'
      );
    }

    await this.throwIfNotBelongsToOrganization(
      user,
      await parentFolder.organization
    );

    const folder = new FileFolder();
    folder.type = FileFolderType.FOLDER;
    folder.name = createFolderParams.name;
    folder.owner = Promise.resolve(user);
    folder.organization = parentFolder.organization;
    folder.parent = Promise.resolve(parentFolder);

    const savedFolder = await filesRepository.save(folder);

    return this.toFileResponse(savedFolder);
  }

  static async getRootFolderForOrganization(
    loggedInUserId: number,
    organizationId: number
  ): Promise<FileResponse> {
    const user = await this.findUserOrThrow(loggedInUserId);
    const organization = await this.findOrganizationOrThrow(organizationId);

    await this.throwIfNotBelongsToOrganization(user, organization);

    const filesRepository = getRepository<FileFolder>(FileFolder);
    const folder = await filesRepository.findOne({
      where: { organization: organization, parent: null },
    });

    return this.toFileResponse(folder);
  }

  static async createRootFolderForOrganization(
    owner: User,
    organization: Organization
  ): Promise<FileFolder> {
    const filesRepository = getRepository<FileFolder>(FileFolder);
    const existingParent = await filesRepository.findOne({
      where: { organization: organization, parent: null },
    });

    if (existingParent) {
      throw new BadRequestApiError(
        'Root folder already exists for organization.'
      );
    }

    const folder = new FileFolder();
    folder.type = FileFolderType.FOLDER;
    folder.organization = Promise.resolve(organization);
    folder.owner = Promise.resolve(owner);
    folder.parent = null;
    folder.name = 'Root Folder';

    return filesRepository.save(folder);
  }

  static async updateFileFolder(
    loggedInUserId: number,
    fileFolderId: number,
    updateFileFolderRequest: UpdateFileFolderRequest
  ): Promise<FileResponse> {
    const user = await this.findUserOrThrow(loggedInUserId);

    const filesRepository = getRepository<FileFolder>(FileFolder);
    let fileFolder = await filesRepository.findOne(fileFolderId);

    if (!fileFolder) {
      throw new ResourceNotFoundError('File / Folder not found.');
    }

    const fileOwner = await fileFolder.owner;
    if (user.id != fileOwner.id) {
      throw new ForbiddenApiError(
        `You do not have permission to edit that ${fileFolder.type.toLowerCase()}`
      );
    }

    fileFolder.name = updateFileFolderRequest.name;

    fileFolder = await filesRepository.save(fileFolder);

    return this.toFileResponse(fileFolder);
  }

  static async uploadFile(
    loggedInUserId: number,
    parentFolderId: number,
    file: Express.Multer.File
  ): Promise<FileResponse> {
    console.log('Upload File called...');

    const user = await this.findUserOrThrow(loggedInUserId);

    const filesRepository = getRepository<FileFolder>(FileFolder);
    const parentFolder = await filesRepository.findOne(parentFolderId);

    if (!parentFolder) {
      throw new ResourceNotFoundError('Folder not found.');
    }

    if (parentFolder.type === FileFolderType.FILE) {
      throw new BadRequestApiError(
        'You cannot upload a file to another file. You can only upload a file to a folder.'
      );
    }

    await this.throwIfNotBelongsToOrganization(
      user,
      await parentFolder.organization
    );

    const filePath = `files/${uuidv4()}-${file.originalname}`;

    console.log('Uploading to S3...');

    await S3Manager.upload(config.filesS3BucketName, filePath, file.buffer);

    console.log('Uploaded.');

    const fileFolder = new FileFolder();
    fileFolder.name = file.originalname;
    fileFolder.parent = Promise.resolve(parentFolder);
    fileFolder.organization = parentFolder.organization;
    fileFolder.owner = Promise.resolve(user);
    fileFolder.filePath = filePath;
    fileFolder.type = FileFolderType.FILE;
    fileFolder.fileSize = file.size;

    console.log('Saving file.');

    const savedFile = await filesRepository.save(fileFolder);

    return this.toFileResponse(savedFile);
  }

  static async downloadFile(
    loggedInUserId: number,
    fileFolderId: number
  ): Promise<DownloadFileResponse> {
    const user = await this.findUserOrThrow(loggedInUserId);

    const filesRepository = getRepository<FileFolder>(FileFolder);
    const fileFolder = await filesRepository.findOne(fileFolderId, {
      relations: ['organization'],
    });

    if (!fileFolder || fileFolder.type !== FileFolderType.FILE) {
      throw new ResourceNotFoundError('File not found.');
    }

    await this.throwIfNotBelongsToOrganization(
      user,
      await fileFolder.organization
    );

    const downloadUrl = await S3Manager.getSignedFileUrl(
      config.filesS3BucketName,
      fileFolder.filePath
    );

    return {
      ...this.toFileResponse(fileFolder),
      downloadUrl,
    };
  }

  public static async deleteFile(
    loggedInUserId: number,
    fileId: number
  ): Promise<SuccessMessage> {
    const user = await this.findUserOrThrow(loggedInUserId);

    const filesRepository = getRepository<FileFolder>(FileFolder);
    const fileFolder = await filesRepository.findOne(fileId, {
      relations: ['organization'],
    });

    if (!fileFolder || fileFolder.type !== FileFolderType.FILE) {
      throw new ResourceNotFoundError('File not found.');
    }

    await this.throwIfNotBelongsToOrganization(
      user,
      await fileFolder.organization
    );

    await this.throwIfNotRequiredRole(
      user,
      await fileFolder.organization,
      OrganizationUserRole.OWNER
    );

    await filesRepository.softRemove(fileFolder);

    return {
      message: 'File deleted.',
    };
  }

  private static toFileResponse(file: FileFolder): FileResponse {
    return {
      id: file.id,
      name: file.name,
      type: file.type,
      parentFolderId: file.parentId,
    };
  }
}
