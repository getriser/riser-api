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
  CommentResponse,
  CreateAnnouncementBodyParams,
  PostCommentAnnouncementParams,
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

  @Get(':id/comments')
  @Security('jwt')
  public async getComments(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<CommentResponse[]> {
    return AnnouncementService.getCommentsForAnnouncement(
      request.user.userId,
      id
    );
  }

  @Post(':id/comments')
  @Security('jwt')
  public async postComment(
    @Path() id: number,
    @Body() body: PostCommentAnnouncementParams,
    @Request() request: express.Request
  ): Promise<CommentResponse> {
    return AnnouncementService.postCommentToAnnouncement(
      request.user.userId,
      id,
      body.content
    );
  }
}
