import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller'; // If you have this
import { FileUploadService } from './file-upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          console.log('Multer Config: Saving', file.originalname, 'to uploads/');
          cb(null, file.originalname);
        }
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extName = allowedTypes.test(file.originalname.toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (extName && mimeType) cb(null, true);
        else cb(new Error('Invalid file type'), false);
      },
      limits: { fileSize: 1024 * 1024 * 10 }
    })
  ],
  controllers: [FileUploadController], // Remove if not needed
  providers: [FileUploadService],
  exports: [MulterModule, FileUploadService] // Export MulterModule to ensure config propagates
})
export class FileUploadModule {}
