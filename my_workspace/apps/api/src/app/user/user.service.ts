import { Injectable } from '@nestjs/common';
import { FileUploadService } from '../_modules/file-upload/file-upload.service';

import { _user } from '@my-workspace/prisma_cruds';
import { _datei } from '@my-workspace/prisma_cruds';
import { newDate } from '@my-workspace/utils';

@Injectable()
export class UserService {
  constructor(private readonly fileUploadService: FileUploadService) {}

  private async createDateiRecord({ dateiTypFiles, mitarbeiterId, vorname, nachname }) {
    const dateiTyps = await _datei.findManyTyp({
      where: {
        id: {
          in: [...dateiTypFiles.keys()]
        }
      },
      select: {
        id: true,
        name: true,
        owner: true,
        category: true
      }
    });

    const result = [];

    for (const dateiTyp of dateiTyps) {
      const name = `${vorname} ${nachname} ${dateiTyp.name}`;
      const dateiRecord = await _datei.createOne({
        name,
        ersteller_id: Number(mitarbeiterId),
        besitzer_id: Number(mitarbeiterId),
        datei_typ_id: dateiTyp.id,
        created_at: newDate(),
        updated_at: newDate()
      });

      const recordId = dateiRecord.id;
      const path = `uploads/${dateiTyp.owner}/${mitarbeiterId}/${dateiTyp.category}/${recordId}`;
      const url = `api/file/${recordId}`;

      await _datei.updateOne({
        id: dateiRecord.id,
        path,
        url
      });

      const category = dateiTyp.category;
      const owner = dateiTyp.owner;
      const ownerId = mitarbeiterId;
      const moved = await this.fileUploadService.processFile({
        file: dateiTypFiles.get(dateiTyp.id),
        owner,
        ownerId,
        category,
        recordId
      });
      result.push(moved);
    }
    return result;
  }

  private async moveFileToLocation({ dateiTypFiles, dateiRecords }) {
    const result = [];
    for (const dateiRecord of dateiRecords) {
      const recordId = dateiRecord.id;
      const path = dateiRecord.path;
      const parts = path.split('/');
      const dateiTypId = dateiRecord.datei_typ_id;
      const owner = parts[1];
      const ownerId = parts[2];
      const category = parts[3];

      const moved = await this.fileUploadService.processFile({
        file: dateiTypFiles.get(dateiTypId),
        owner,
        ownerId,
        category,
        recordId
      });
      console.log('moved:', moved);
      result.push(moved);
    }
    return result;
  }

  async updateUserCertificate({
    mitarbeiterId,
    vorname,
    nachname,
    files
  }: {
    mitarbeiterId: string;
    vorname: string;
    nachname: string;
    files: Express.Multer.File[];
  }) {
    const dateiTypFiles = files.reduce((result, file) => {
      const match = file.fieldname.match(/\[(\d+)\]\]$/);
      const dateiTypeId = match ? parseInt(match[1], 10) : 0;
      result.set(dateiTypeId, file);
      return result;
    }, new Map());

    const dateiRecords = await _datei.findMany({
      where: {
        besitzer_id: Number(mitarbeiterId),
        datei_typ_id: {
          in: [...dateiTypFiles.keys()]
        }
      }
    });

    let result = [];

    if (!dateiRecords.length) {
      result = await this.createDateiRecord({ dateiTypFiles, mitarbeiterId, vorname, nachname });
    } else {
      result = await this.moveFileToLocation({ dateiTypFiles, dateiRecords });
    }
    console.log('result:', result);
    return result;
  }
}
