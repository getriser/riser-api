import AbstractService from './AbstractService';
import { CreateFolderParams, FileFolderType, FileResponse } from '../types';
import { getRepository } from 'typeorm';
import FileFolder from '../entity/FileFolder';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import BadRequestApiError from '../errors/BadRequestApiError';
import Organization from '../entity/Organization';
import { User } from '../entity/User';

export default class FileService extends AbstractService {
  static async getFilesFromFolder(
    loggedInUserId: number,
    folderId: number
  ): Promise<FileResponse[]> {
    const user = await this.findUserOrThrow(loggedInUserId);

    const filesRepository = getRepository<FileFolder>(FileFolder);
    const folder = await filesRepository.findOne(folderId, {
      relations: ['children'],
    });

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

  private static toFileResponse(file: FileFolder): FileResponse {
    return {
      id: file.id,
      name: file.name,
      type: file.type,
      filePath: file.filePath,
    };
  }
}
