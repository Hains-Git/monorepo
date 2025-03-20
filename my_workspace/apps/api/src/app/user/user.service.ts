import { Injectable } from '@nestjs/common';
import { FileUploadService } from '../_modules/file-upload/file-upload.service';

import { _user } from '@my-workspace/prisma_cruds';

@Injectable()
export class UserService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  updateUserCertificate({
    mitarbeiterId,
    datei_typ_ids,
    files
  }: {
    mitarbeiterId: number;
    datei_typ_ids: number[];
    files: Express.Multer.File[];
  }) {
    throw new Error('Method not implemented.');
  }
}
