import { Controller, Post, Get, Res, UploadedFiles, UseInterceptors, Body } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('general')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadSingleFile(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('category') category: string
  ) {
    // return this.fileUploadService.processGeneralFiles(files, category);
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // max 10 files
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: { mitarbeiterId: string; category: string }
  ) {
    console.log('Files:', files);
    console.log('Params:', body);
    // Anstatt category datei_typ_id

    const mitarbeiterId = body.mitarbeiterId;
    const category = body.category;
    // return this.fileUploadService.processMultipleFilesByMitarbeiter(files, mitarbeiterId, category);
  }
}
