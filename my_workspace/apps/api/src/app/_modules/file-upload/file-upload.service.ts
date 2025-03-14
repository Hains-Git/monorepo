import { Injectable } from '@nestjs/common';
import { mkdirSync, renameSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private getUserUploadPath(userId: string, category: string): string {
    const uploadPath = join(process.cwd(), 'uploads/mitarbeiter', userId, category);
    try {
      mkdirSync(uploadPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    return uploadPath;
  }

  async processSingleFile(file: Express.Multer.File, mitarbeiterId: string, category: string) {
    const userPath = this.getUserUploadPath(mitarbeiterId, category);
    const newFilePath = join(userPath, file.filename);

    // Move file from ./uploads to ./uploads/userId/category
    renameSync(file.path, newFilePath);

    return {
      message: 'File uploaded successfully',
      fileInfo: {
        filename: file.filename,
        path: newFilePath,
        size: file.size,
        mimetype: file.mimetype
      }
    };
  }

  async processMultipleFiles(files: Express.Multer.File[], mitarbeiterId: string, category: string) {
    const userPath = this.getUserUploadPath(mitarbeiterId, category);

    const fileInfos = files.map((file) => {
      const newFilePath = join(userPath, file.filename);
      renameSync(file.path, newFilePath);

      return {
        filename: file.filename,
        path: newFilePath,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    return {
      message: 'Files uploaded successfully',
      files: fileInfos
    };
  }
}
