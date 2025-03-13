import { Injectable } from '@nestjs/common';
import { Dienstfrei, getDienstplanung, PlanerDate, Urlaubssaldi } from '@my-workspace/models';
import { getAllApiData } from '@my-workspace/models';
import { PlanungsInfo } from '@my-workspace/models';
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
    const planungsinfo = await PlanungsInfo.planungsInfoCreateOrupdate(params);
    return planungsinfo;
  }

  async getLocalTest() {
    if (process.env.NODE_ENV !== 'development') {
      return { error: 'Not allowed' };
    }
    const timeNow = new Date().getTime();
    const result = await Urlaubssaldi.getSaldi(new Date(2025, 0, 1), new Date(2025, 0, 31));
    console.log('time', (new Date().getTime() - timeNow) / 1000, 's');
    return result;
  }

  async getFeiertage(start: Date, ende: Date) {
    const feiertage: Awaited<ReturnType<typeof PlanerDate.getFeiertag>>[] = [];
    while (start <= ende) {
      const feiertag = await PlanerDate.getFeiertag(start);
      start.setDate(start.getDate() + 1);
      if (feiertag) feiertage.push(feiertag);
    }
    return feiertage;
  }

  async getDienstfrei(body: any) {
    let mitarbeiterIds: number[] = [];
    if (Array.isArray(body?.mitarbeiter_ids)) {
      mitarbeiterIds = body.mitarbeiter_ids.map(Number).filter(!isNaN);
    }
    return Dienstfrei.getDienstfreis(mitarbeiterIds);
  }
}
