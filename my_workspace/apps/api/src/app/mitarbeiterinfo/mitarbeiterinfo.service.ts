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
  getPublicRangeEinteilungenForMitarbeiter,
  getMitarbeiterById
} from '@my-workspace/prisma_cruds';

import { getMitarbeiterInfos, proceesDataForVertragsTyps } from './helper';
import { transformObject, processData, newDate } from '@my-workspace/utils';
import { addWeiterbildungsjahr, mitarbeiterTeamAm, rentenEintritt } from '@my-workspace/models';

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

  async getMitarbeiterDetails(mitarbeiterId: number, userId: number) {
    const result = {};
    const mitarbeiter = await getMitarbeiterById(mitarbeiterId, { account_info: true, funktion: true });
    const teamAm = await mitarbeiterTeamAm(newDate(), null, null, null, mitarbeiterId);
    const teams = await getAllTeams();
    const accountInfo = mitarbeiter.account_info;
    result['teams'] = processData('id', teams);
    result['mitarbeiter'] = transformObject(mitarbeiter, [
      {
        key: 'weiterbildungsjahr',
        method: addWeiterbildungsjahr
      }
    ]);
    result['accountInfo'] = transformObject(accountInfo, [
      {
        key: 'renten_eintritt',
        method: rentenEintritt
      }
    ]);
    result['team_am'] = teamAm;
    return result;
  }
}
