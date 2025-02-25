import { Injectable } from '@nestjs/common';
import { getDienstplanung } from '@my-workspace/models';
import { getAllApiData } from '@my-workspace/models';
import { planungsInfoCreateOrupdate } from '@my-workspace/models';
import { newDate } from '@my-workspace/utils';

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
}
