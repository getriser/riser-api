import {
  Controller,
  Route,
  Path,
  Tags,
  Get,
  Security,
  Request,
  Post,
  Body,
  Put,
} from 'tsoa';
import * as express from 'express';
import {
  AnnouncementResponse,
  CreateAnnouncementBodyParams,
  UpdateAnnouncementParams,
} from '../types';
import AnnouncementService from '../services/AnnouncementService';

@Tags('Announcement Controller')
@Route('announcements')
export class AnnouncementController extends Controller {
  @Get(':id')
  @Security('jwt')
  public async getAnnouncement(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<AnnouncementResponse> {
    return AnnouncementService.getAnnouncement(request.user.userId, id);
  }

  @Post('/')
  @Security('jwt')
  public async createAnnouncement(
    @Body() body: CreateAnnouncementBodyParams,
    @Request() request: express.Request
  ): Promise<AnnouncementResponse> {
    return AnnouncementService.createAnnouncement(
      request.user.userId,
      body.organizationId,
      body
    );
  }

  @Put(':id')
  @Security('jwt')
  public async updateAnnouncement(
    @Body() body: UpdateAnnouncementParams,
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<AnnouncementResponse> {
    return AnnouncementService.updateAnnouncement(
      request.user.userId,
      id,
      body
    );
  }

  @Put(':id/publish')
  @Security('jwt')
  public async publishAnnouncement(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<AnnouncementResponse> {
    return AnnouncementService.publishAnnouncement(request.user.userId, id);
  }
}
