import {
  createOrUpdateTeam,
  destroyOneTeam,
  getAllTeams,
  getAllTeamsWithMainIncludes,
  TeamCreateOrUpdate
} from '@my-workspace/prisma_cruds';
import { newDate } from '@my-workspace/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TeamService {
  async deleteTeam(id: number) {
    const msg = await destroyOneTeam(Number(id) || 0);
    return {
      info: msg,
      destroyed: !msg
    };
  }

  async listTeams() {
    return await getAllTeams();
  }

  async listTeamsWithIncludes() {
    return await getAllTeamsWithMainIncludes();
  }

  async createTeam(id: number, body: any) {
    const args: TeamCreateOrUpdate = {
      id: Number(id) || 0,
      name: String(body.name).trim(),
      default: body.default === 'true' || body.default === true,
      kostenstelle_id: Number(body.kostenstelle_id) || 0,
      verteiler_default: body.verteiler_default === 'true' || body.verteiler_default === true,
      krank_puffer: Number(body.krank_puffer) || 0,
      color: String(body.color).toLowerCase(),
      funktionen_ids: [],
      team_kw_krankpuffers: [],
      team_vk_soll: [],
      team_kopf_soll: []
    };
    if (typeof body.funktionen_ids === 'string') {
      body.funktionen_ids = JSON.parse(body.funktionen_ids);
    }
    if (Array.isArray(body.funktionen_ids)) {
      args.funktionen_ids = body.funktionen_ids.map((fId) => Number(fId) || 0);
    }
    if (typeof body.team_kw_krankpuffers === 'string') {
      body.team_kw_krankpuffers = JSON.parse(body.team_kw_krankpuffers);
    }
    if (Array.isArray(body.team_kw_krankpuffers)) {
      args.team_kw_krankpuffers = body.team_kw_krankpuffers.map((kw) => ({
        kw: Number(kw.kw) || 0,
        puffer: Number(kw.puffer) || 0
      }));
    }
    if (typeof body.team_vk_soll === 'string') {
      body.team_vk_soll = JSON.parse(body.team_vk_soll);
    }
    if (Array.isArray(body.team_vk_soll)) {
      args.team_vk_soll = body.team_vk_soll.map((vk) => ({
        soll: Number(vk.soll) || 0,
        von: newDate(vk.von),
        bis: newDate(vk.bis)
      }));
    }
    if (typeof body.team_kopf_soll === 'string') {
      body.team_kopf_soll = JSON.parse(body.team_kopf_soll);
    }
    if (Array.isArray(body.team_kopf_soll)) {
      args.team_kopf_soll = body.team_kopf_soll.map((kopf) => ({
        soll: Number(kopf.soll) || 0,
        von: newDate(kopf.von),
        bis: newDate(kopf.bis)
      }));
    }
    return await createOrUpdateTeam(args);
  }
}
