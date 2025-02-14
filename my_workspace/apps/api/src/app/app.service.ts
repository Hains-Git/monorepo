import { Injectable } from '@nestjs/common';
import { getDienstplanung } from '@my-workspace/prisma_hains';
import { getAllApiData } from '@my-workspace/prisma_hains';
import { createOrUpdatePlanungsinfo } from '@my-workspace/prisma_hains';
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
    const planungsinfo = await createOrUpdatePlanungsinfo(params);
    return planungsinfo;
  }
}
