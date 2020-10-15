import { Controller, Route, Post, Body, Security, Request } from 'tsoa';
import { CreateOrganizationParams, CreateOrganizationResponse } from '../types';
import * as express from 'express';
import OrganizationService from '../services/OrganizationService';

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
}
