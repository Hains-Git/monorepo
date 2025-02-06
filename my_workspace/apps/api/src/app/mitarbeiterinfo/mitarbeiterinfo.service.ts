import { Injectable } from '@nestjs/common';

import {
  getAllDateiTyps,
  getAllFunktionen,
  getAllHainsGroups,
  getAllPoDiensts,
  getAllMerkmal,
  getAllZeitraumKategories,
  getAllTeams,
  getAllActiveMitarbeiter,
  getAllMitarbeiter,
  getAllStandorte,
  getAllThemas,
  getVertragsTypsForMitarbeiterinfo,
  getPublicRangeEinteilungenForMitarbeiter
} from '@my-workspace/prisma_hains';

import { getMitarbeiterInfos, proceesDataForVertragsTyps } from './helper';

@Injectable()
export class MitarbeiterInfoService {
  async getMitarbeiterInfoData() {
    const result = {};
    const dataVertragsTyps = await getVertragsTypsForMitarbeiterinfo();
    const vertragsTyps = proceesDataForVertragsTyps(dataVertragsTyps);
    result['mitarbeiter_infos'] = await getMitarbeiterInfos();
    result['hains_groups'] = await getAllHainsGroups();
    result['funktionen'] = await getAllFunktionen();
    result['datei_typs'] = await getAllDateiTyps();
    result['vertrags_typ'] = vertragsTyps;
    result['zeitraumkategories'] = await getAllZeitraumKategories();
    result['mitarbeiters'] = await getAllActiveMitarbeiter();
    result['all_mitarbeiters'] = await getAllMitarbeiter();
    result['dienste'] = await getAllPoDiensts();
    result['teams'] = await getAllTeams();
    result['merkmale'] = await getAllMerkmal();
    result['standorte'] = await getAllStandorte();
    result['themen'] = await getAllThemas();

    return result;
  }
  async getEinteilungenInTime(body) {
    const { start, end, id: mitarbeiter_id } = body;
    const einteilungen = await getPublicRangeEinteilungenForMitarbeiter(mitarbeiter_id, start, end, {
      po_diensts: true,
      einteilungsstatuses: true
    });
    return einteilungen;
  }
}
