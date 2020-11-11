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
import { CreateFolderParams, FileResponse } from '../types';
import * as express from 'express';
import FileService from '../services/FileService';

interface CraeteFolderBody extends CreateFolderParams {
  parentId: number;
}

@Tags('File Controller')
@Route('files')
export class OrganizationController extends Controller {
  @Post('/folders')
  @Security('jwt')
  public async createFolder(
    @Body() body: CraeteFolderBody,
    @Request() request: express.Request
  ): Promise<FileResponse> {
    return FileService.createFolder(request.user.userId, body.parentId, body);
  }

  @Get('/folders/:id')
  @Security('jwt')
  public async getFilesFromFolder(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<FileResponse[]> {
    return FileService.getFilesFromFolder(request.user.userId, id);
  }
}
