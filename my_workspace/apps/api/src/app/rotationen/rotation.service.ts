import { newDate } from '@my-workspace/utils';
import { Injectable } from '@nestjs/common';

import { EinteilungRotation } from '@my-workspace/models';
import { kontingentMitarbeiter } from './helper';
import { processData } from '@my-workspace/utils';
import { MitarbeiterInfoService } from '../mitarbeiterinfo/mitarbeiterinfo.service';

@Injectable()
export class RotationService {
  constructor(private readonly mitarbeiterInfoService: MitarbeiterInfoService) {}
  async getRotationInterval(body: { anfang: string; ende: string; init: boolean; user_id: string }) {
    const anfang = newDate(body.anfang);
    const ende = newDate(body.ende);
    const init = body.init;
    const userId = Number(body.user_id);
    const result = {};
    const rotationen = await EinteilungRotation.rotationIn(anfang, ende);
    if (init) {
      const eingeteiltKontingente = await kontingentMitarbeiter(userId);
      const vkTeamOverview = await this.mitarbeiterInfoService.teamVkOverview(anfang, ende);
      result['eingeteilte_kontingente'] = eingeteiltKontingente;
      result['vk_team_overview'] = vkTeamOverview;
    }
    result['rotationen'] = processData('id', rotationen);
    return result;
  }
}
