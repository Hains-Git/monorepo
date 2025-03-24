import { Injectable } from '@nestjs/common';
import { FileUploadService } from '../_modules/file-upload/file-upload.service';

import { _user } from '@my-workspace/prisma_cruds';

@Injectable()
export class UserService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  async updateUserCertificate({
    mitarbeiterId,
    files
  }: {
    mitarbeiterId: string;
    files: Express.Multer.File[];
  }) {
    const dateiTypIds = files
      .map((file) => {
        console.log('Fieldname:', file.fieldname); // Debug the exact fieldname
        const match = file.fieldname.match(/\[(\d+)\]\]$/);
        console.log('Match:', match); // Debug the match result
        const dateiTypeId = match ? parseInt(match[1], 10) : null;
        return dateiTypeId;
      })
      .filter((id) => id !== null);

    const owner = 'mitarbeiter';
    const ownerId = mitarbeiterId;
    const recordId = 10001;
    const category = 'certificate';

    const result = await this.fileUploadService.processFile({
      file: files[0],
      owner,
      ownerId,
      category,
      recordId
    });

    return result;
  }
}
