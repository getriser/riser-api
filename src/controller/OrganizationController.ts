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
  Member,
  RegisterUserProperties,
  SuccessMessage,
} from '../types';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import OrganizationService from '../services/OrganizationService';
import AnnouncementService from '../services/AnnouncementService';

interface InviteMemberBody {
  email: string;
}

@Tags('Organization Controller')
@Route('organizations')
export class OrganizationController extends Controller {
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
}
