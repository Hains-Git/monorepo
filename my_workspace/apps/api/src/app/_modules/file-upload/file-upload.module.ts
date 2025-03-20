import { Module } from '@nestjs/common';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        // destination: './uploads', // Base upload path
        destination: join(process.cwd(), 'uploads'), // Absolute path
        filename: (req, file, cb) => {
          // const fileExt = extname(file.originalname);
          // cb(null, `${file.originalname}${fileExt}`);
          cb(null, `${file.originalname}`); // when filename has extension: blnak.png
        }
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extName = allowedTypes.test(extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (extName && mimeType) {
          return cb(null, true);
        }
        cb(new Error('Invalid file type'), false);
      },
      limits: {
        fileSize: 1024 * 1024 * 10 // 10MB limit
      }
    })
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService]
})
export class FileUploadModule {}
