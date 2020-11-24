import {
  Controller,
  Route,
  Body,
  Security,
  Request,
  Path,
  Tags,
  Put,
  Get,
} from 'tsoa';
import {
  DownloadFileResponse,
  FileResponse,
  UpdateFileFolderRequest,
} from '../types';
import * as express from 'express';
import FileService from '../services/FileService';

@Tags('File Controller')
@Route('files')
export class FileController extends Controller {
  @Put('/:id')
  @Security('jwt')
  public async updateFile(
    @Path() id: number,
    @Body() body: UpdateFileFolderRequest,
    @Request() request: express.Request
  ): Promise<FileResponse> {
    return FileService.updateFileFolder(request.user.userId, id, body);
  }

  @Get('/:id/download')
  @Security('jwt')
  public async downloadFile(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<DownloadFileResponse> {
    return FileService.downloadFile(request.user.userId, id);
  }
}
