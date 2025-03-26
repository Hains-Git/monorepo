import { Injectable } from '@nestjs/common';
import { mkdirSync, renameSync, existsSync } from 'fs';
import { join } from 'path';

type TUploadParams = {
  owner: string;
  ownerId: string;
  category: string;
  recordId: number;
};

type TProcessFileParams = {
  file: Express.Multer.File;
  owner: string;
  ownerId: string;
  category: string;
  recordId: number;
};

@Injectable()
export class FileUploadService {
  private getUploadPath({ owner, ownerId, category, recordId }: TUploadParams): string {
    const uploadPath = join(process.cwd(), 'uploads', owner, `${ownerId}`, category, `${recordId}`);
    try {
      mkdirSync(uploadPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    return uploadPath;
  }

  async processFile({ file, owner, ownerId, category, recordId }: TProcessFileParams) {
    if (!existsSync(file.path)) {
      throw new Error(`Source file not found: ${file.path}`);
    }

    const initialUploadedPath = this.getUploadPath({ owner, ownerId: ownerId, category, recordId });
    const newFilePath = join(initialUploadedPath, file.filename);

    renameSync(file.path, newFilePath);

    return {
      filename: file.filename,
      status: 'success',
      path: newFilePath,
      recordId,
      size: file.size,
      mimetype: file.mimetype
    };
  }
}
