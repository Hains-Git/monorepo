import { Injectable } from '@nestjs/common';
import { getDienstplanung } from '@my-workspace/models';
import { getAllApiData } from '@my-workspace/models';
import { planungsInfoCreateOrupdate } from '@my-workspace/models';
import { newDate } from '@my-workspace/utils';
import { getPossibleDienstfrei } from '@my-workspace/prisma_cruds';

@Injectable()
export class AppService {
  async getDienstplanung(dienstplanId: number, loadVorschlaege: boolean) {
    const data = await getDienstplanung(dienstplanId, loadVorschlaege);
    return data;
  }

  async getApiData(userId: number) {
    const data = await getAllApiData(userId);
    return data;
  }

  async savePlanungsComment(body) {
    const params = {
      tag: newDate(`${body.tag}T12:00:00.000Z`),
      po_dienst_id: body.po_dienst_id,
      bereich_id: body.bereich_id,
      kommentar: body.kommentar
    };
    const planungsinfo = await planungsInfoCreateOrupdate(params);
    return planungsinfo;
  }

  async getLocalTest() {
    if (process.env.NODE_ENV !== 'development') {
      return { error: 'Not allowed' };
    }
    const dates = [];
    for (let i = 0; i < 31; i++) {
      dates.push(new Date(2025, 0, i));
    }
    return await getPossibleDienstfrei(dates);
  }
}
