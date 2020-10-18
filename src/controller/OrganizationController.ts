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
} from '../types';
import * as express from 'express';
import OrganizationService from '../services/OrganizationService';

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
}
