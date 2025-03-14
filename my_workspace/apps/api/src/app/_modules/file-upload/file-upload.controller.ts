import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingleFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
    @Body('category') category: string
  ) {
    return this.fileUploadService.processSingleFile(file, userId, category);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // max 10 files
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { mitarbeiterId: string; category: string }
  ) {
    console.log('Files:', files); // Array of uploaded files
    console.log('Params:', body);
    const mitarbeiterId = body.mitarbeiterId;
    const category = body.category;
    return this.fileUploadService.processMultipleFiles(files, mitarbeiterId, category);
  }
}
