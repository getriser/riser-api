import {
  Controller,
  Route,
  Post,
  Body,
  Security,
  Request,
  Get,
  Path,
  Tags,
  Query,
} from 'tsoa';
import {
  AnnouncementResponse,
  CreateOrganizationParams,
  CreateOrganizationResponse,
  FileResponse,
  Member,
  OrganizationResponse,
  RegisterUserProperties,
  SuccessMessage,
} from '../types';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import OrganizationService from '../services/OrganizationService';
import AnnouncementService from '../services/AnnouncementService';
import FileService from '../services/FileService';

interface InviteMemberBody {
  email: string;
  firstName: string;
  lastName: string;
}

interface GetFilesResponse {
  parentFolderId: number;
  files: FileResponse[];
}

@Tags('Organization Controller')
@Route('organizations')
export class OrganizationController extends Controller {
  @Get('/')
  @Security('jwt')
  public async getOrganizations(
    @Request() request: express.Request
  ): Promise<OrganizationResponse[]> {
    return OrganizationService.getOrganizations(request.user.userId);
  }

  @Post('/create')
  @Security('jwt')
  public async createOrganization(
    @Body() body: CreateOrganizationParams,
    @Request() request: express.Request
  ): Promise<CreateOrganizationResponse> {
    const organization = await OrganizationService.createOrganization(
      request.user.userId,
      body
    );

    return {
      id: organization.id,
      name: organization.name,
    };
  }

  @Get('/:id/members')
  @Security('jwt')
  public async getMembers(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<Member[]> {
    return OrganizationService.getMembers(request.user.userId, id);
  }

  @Post('/:id/members')
  @Security('jwt')
  public async inviteMember(
    @Path() id: number,
    @Body() body: InviteMemberBody,
    @Request() request: express.Request
  ): Promise<SuccessMessage> {
    const defaultPassword = uuidv4();
    const registerUser: RegisterUserProperties = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      password: defaultPassword,
      passwordConfirmation: defaultPassword,
    };

    await OrganizationService.inviteMember(
      request.user.userId,
      id,
      registerUser
    );

    return {
      message: 'User successfully invited.',
    };
  }

  @Get('/:id/announcements')
  @Security('jwt')
  public async getAnnouncements(
    @Path() id: number,
    @Request() request: express.Request,
    @Query() offset?: number,
    @Query() limit?: number
  ): Promise<AnnouncementResponse[]> {
    return AnnouncementService.getPublicAnnouncementsForOrganization(
      request.user.userId,
      id,
      offset,
      limit
    );
  }

  @Get('/:id/files')
  @Security('jwt')
  public async getFiles(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<GetFilesResponse> {
    const rootFolder = await FileService.getRootFolderForOrganization(
      request.user.userId,
      id
    );

    const files = await FileService.getFilesFromFolder(
      request.user.userId,
      rootFolder.id
    );

    return {
      parentFolderId: rootFolder.id,
      files,
    };
  }
}
