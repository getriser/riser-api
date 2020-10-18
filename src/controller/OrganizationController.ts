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
} from 'tsoa';
import {
  CreateOrganizationParams,
  CreateOrganizationResponse,
  Member,
  RegisterUserProperties,
  SuccessMessage,
} from '../types';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import OrganizationService from '../services/OrganizationService';

interface InviteMemberBody {
  email: string;
}

@Tags('Organization Controller')
@Route('organization')
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
}
