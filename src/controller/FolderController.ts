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
  Put,
  Delete,
} from 'tsoa';
import {
  CreateFolderParams,
  FileResponse,
  SuccessMessage,
  UpdateFileFolderRequest,
} from '../types';
import * as express from 'express';
import FileService from '../services/FileService';
import * as multer from 'multer';

interface CreateFolderBody extends CreateFolderParams {
  parentId: number;
}

@Tags('Folder Controller')
@Route('folders')
export class FolderController extends Controller {
  @Post('/')
  @Security('jwt')
  public async createFolder(
    @Body() body: CreateFolderBody,
    @Request() request: express.Request
  ): Promise<FileResponse> {
    return FileService.createFolder(request.user.userId, body.parentId, body);
  }

  @Put('/:id')
  @Security('jwt')
  public async updateFolder(
    @Path() id: number,
    @Body() body: UpdateFileFolderRequest,
    @Request() request: express.Request
  ): Promise<FileResponse> {
    return FileService.updateFileFolder(request.user.userId, id, body);
  }

  @Delete('/:id')
  @Security('jwt')
  public async deleteFolder(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<SuccessMessage> {
    return FileService.deleteFolder(request.user.userId, id);
  }

  @Get('/:id/files')
  @Security('jwt')
  public async getFilesFromFolder(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<FileResponse[]> {
    return FileService.getFilesFromFolder(request.user.userId, id);
  }

  @Post('/:id/files')
  @Security('jwt')
  public async uploadFile(
    @Path() id: number,
    @Request() request: express.Request
  ): Promise<FileResponse> {
    await this.handleFile(request);

    return FileService.uploadFile(request.user.userId, id, request.file);
  }

  private handleFile(request: express.Request): Promise<any> {
    const multerSingle = multer().single('file');
    return new Promise((resolve, reject) => {
      multerSingle(request, undefined, async (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}
