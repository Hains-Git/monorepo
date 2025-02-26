import { Injectable } from '@nestjs/common';

import {
  merkmal,
  mitarbeiter_merkmal,
  freigabe,
  freigabestatus,
  dienstrating,
  dienstwunsch,
  vertragsphase,
  urlaubssaldo_absprache,
  _einteilung_rotation,
  _dienstplanung,
  _datei,
  _funktion,
  _hains_groups,
  _mitarbeiter,
  _po_dienst,
  _team,
  _vertrag,
  _zeitraum_kategorie,
  _thema,
  _standort
} from '@my-workspace/prisma_cruds';

import { getMitarbeiterInfos, proceesDataForVertragsTyps } from './helper';
import { transformObject, processData, newDate } from '@my-workspace/utils';
import {
  addWeiterbildungsjahr,
  mitarbeiterTeamAm,
  rentenEintritt,
  getFreigegebeneDienste,
  getAutomatischeEinteilungen,
  getArbeitszeitAbsprachen,
  getKontingentEingeteiltBasis,
  User
} from '@my-workspace/models';

@Injectable()
export class MitarbeiterInfoService {
  async getMitarbeiterInfoData() {
    const result = {};
    const dataVertragsTyps = await _vertrag.getVertragsTypsForMitarbeiterinfo();
    const vertragsTyps = proceesDataForVertragsTyps(dataVertragsTyps);
    result['mitarbeiter_infos'] = await getMitarbeiterInfos();
    result['hains_groups'] = await _hains_groups.getAllHainsGroups();
    result['funktionen'] = await _funktion.getAllFunktionen();
    result['datei_typs'] = await _datei.getAllDateiTyps();
    result['vertrags_typ'] = vertragsTyps;
    result['zeitraumkategories'] = await _zeitraum_kategorie.getAllZeitraumKategories();
    result['mitarbeiters'] = await _mitarbeiter.getAllActiveMitarbeiter();
    result['all_mitarbeiters'] = await _mitarbeiter.getAllMitarbeiter();
    result['dienste'] = await _po_dienst.getAllPoDiensts();
    result['teams'] = await _team.getAllTeams();
    result['merkmale'] = await merkmal.getAll();
    result['standorte'] = await _standort.getAllStandorte();
    result['themen'] = await _thema.getAllThemas();

    return result;
  }

  async getEinteilungenInTime(body) {
    const { start, end, id: mitarbeiter_id } = body;
    const einteilungen = await _dienstplanung.getPublicRangeEinteilungenForMitarbeiter(
      mitarbeiter_id,
      start,
      end,
      {
        po_diensts: true,
        einteilungsstatuses: true
      }
    );
    return einteilungen;
  }

  async getMitarbeiterDetails(mitarbeiterId: number, userId: number) {
    const result = {};
    const isRotationsPlaner = await User.isRotationsPlaner(userId);
    const mitarbeiter = await _mitarbeiter.getMitarbeiterById(mitarbeiterId, {
      account_info: true,
      funktion: true
    });
    const teamAm = await mitarbeiterTeamAm(newDate(), null, null, null, mitarbeiterId);
    const teams = await _team.getAllTeams();
    const accountInfo = mitarbeiter.account_info;
    const freigaben = await freigabe.getByMitarbeiterId(mitarbeiterId);
    const freigabestatuses = await freigabestatus.getAll();
    const dienste = await getFreigegebeneDienste(mitarbeiterId);
    const ratings = await dienstrating.getByMitarbeiterId(mitarbeiterId);
    const dienstwunsche = await dienstwunsch.getByMitarbeiterIdForFuture(mitarbeiterId);
    const vertragsphasen = await vertragsphase.getByMitarbeiterId(mitarbeiterId);
    const automatischeEinteilungen = await getAutomatischeEinteilungen(mitarbeiterId);
    const arbeitszeitAbsprachen = await getArbeitszeitAbsprachen(mitarbeiterId);
    const urlaubssaldoAbsprachen = await urlaubssaldo_absprache.getByMitarbeiterId(mitarbeiterId);
    const merkmale = await merkmal.getAll({ merkmal_options: true });
    const mitarbeiterMerkmale = await mitarbeiter_merkmal.getAll();
    const statistic = await getKontingentEingeteiltBasis(mitarbeiterId);
    const alleRotationen = isRotationsPlaner
      ? await _einteilung_rotation.sortedByVon(mitarbeiterId)
      : await _einteilung_rotation.getPublished(mitarbeiterId);

    result['urlaubssaldo_absprachen'] = urlaubssaldoAbsprachen;
    result['mitarbeiter_merkmale'] = mitarbeiterMerkmale;
    result['arbeitszeit_absprachen'] = arbeitszeitAbsprachen;
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
    result['freigaben'] = freigaben;
    result['statuse'] = processData('id', freigabestatuses);
    result['dienste'] = dienste.map((dienst) => ({ id: dienst.id, name: dienst.name }));
    result['ratings'] = processData('po_dienst_id', ratings);
    result['dienstwunsche'] = dienstwunsche;
    result['vertragsphase'] = vertragsphasen.map((vp) => {
      // vp.von = formatDate(vp.von, 'yyyy-MM-dd') as unknown as Date;
      // vp.bis = formatDate(vp.bis, 'yyyy-MM-dd') as unknown as Date;
      return vp;
    });
    result['automatische_einteilungen'] = automatischeEinteilungen;
    result['merkmale'] = merkmale;
    result['kontingente'] = statistic.kontingente;
    result['rotationen'] = statistic.rotationen;
    result['alle_rotationen'] = alleRotationen;

    alleRotationen.forEach((rotation) => {
      result['rotationen'][rotation.kontingent_id].push(rotation);
    });

    return result;
  }
}
