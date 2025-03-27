import { Controller, Get, Query, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { FileStreamService } from './file-stream.service';
import { FileGuard } from '../../guards/file-guard';

@Controller('file')
export class FileStreamController {
  constructor(private readonly fileService: FileStreamService) {}

  @Get(':id')
  @UseGuards(FileGuard)
  async getFile(@Param('id') id: number, @Res() res: Response) {
    const { stream, contentType, fileName } = await this.fileService.getFileStream(id);

    res.set({
      'Content-Type': contentType
      // 'Content-Disposition': `attachment; filename="${fileName}"` // Optional: triggers download
    });

    stream.getStream().pipe(res);
  }
}
