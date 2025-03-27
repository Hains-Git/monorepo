import { Module } from '@nestjs/common';
import { FileStreamController } from './file-stream.controller';
import { FileStreamService } from './file-stream.service';
import { FileGuard } from '../../guards/file-guard';

@Module({
  controllers: [FileStreamController],
  providers: [FileStreamService, FileGuard] // Provide FileGuard, but don’t apply it globally
})
export class FileStreamModule {}
