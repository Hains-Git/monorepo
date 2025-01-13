import { Injectable } from '@nestjs/common';
import { getDienstplanung } from '@my-workspace/prisma_hains';
import { getAllApiData } from '@my-workspace/prisma_hains';
import { createOrUpdatePlanungsinfo } from '@my-workspace/prisma_hains';

@Injectable()
export class AppService {
  async getDienstplanung(dienstplanId) {
    const data = await getDienstplanung(dienstplanId);
    return data;
  }
  async getApiData(userId) {
    const data = await getAllApiData(Number(userId));
    return data;
  }
  async savePlanungsComment(body) {
    console.log('App;Service:savePlanungsComment', body);
    const params = {
      tag: new Date(body.tag),
      po_dienst_id: body.po_dienst_id,
      bereich_id: body.bereich_id,
      kommentar: body.kommentar
    };
    const planungsinfo = await createOrUpdatePlanungsinfo(params);
    return planungsinfo;
  }
}
