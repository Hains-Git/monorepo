import { Injectable } from '@nestjs/common';
import { mkdirSync, renameSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileUploadService {
  private getMitarbeiterUploadPath(mitarbeiterId: string, category: string): string {
    const uploadPath = join(process.cwd(), 'uploads', 'mitarbeiter', mitarbeiterId, category);
    try {
      mkdirSync(uploadPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    return uploadPath;
  }

  private getGeneralUploadPath(category: string): string {
    const uploadPath = join(process.cwd(), 'uploads', category);
    try {
      mkdirSync(uploadPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    return uploadPath;
  }

  async processGeneralFiles(files: Express.Multer.File[], category: string) {
    const uniqueFiles = Array.from(new Map(files.map((file) => [file.path, file])).values());

    if (uniqueFiles.length === 0) {
      throw new Error('No valid files to process');
    }

    const userPath = this.getGeneralUploadPath(category);

    const fileInfos = uniqueFiles.map((file) => {
      if (!existsSync(file.path)) {
        throw new Error(`Source file not found: ${file.path}`);
      }

      const newFilePath = join(userPath, file.filename);
      renameSync(file.path, newFilePath);

      return {
        filename: file.filename,
        status: 'success',
        path: newFilePath,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    return {
      status: 'success',
      message: 'Files uploaded successfully',
      files: fileInfos
    };
  }

  async processMultipleFilesByMitarbeiter(
    files: Express.Multer.File[],
    mitarbeiterId: string,
    category: string
  ) {
    const uniqueFiles = Array.from(new Map(files.map((file) => [file.path, file])).values());

    if (uniqueFiles.length === 0) {
      throw new Error('No valid files to process');
    }

    const userPath = this.getMitarbeiterUploadPath(mitarbeiterId, category);

    const fileInfos = uniqueFiles.map((file) => {
      if (!existsSync(file.path)) {
        throw new Error(`Source file not found: ${file.path}`);
      }

      const newFilePath = join(userPath, file.filename);
      renameSync(file.path, newFilePath);

      return {
        filename: file.filename,
        status: 'success',
        path: newFilePath,
        size: file.size,
        mimetype: file.mimetype
      };
    });

    return {
      status: 'success',
      message: 'Files uploaded successfully',
      files: fileInfos
    };
  }
}
