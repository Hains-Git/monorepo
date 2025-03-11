import { Injectable } from '@nestjs/common';

import {
  _merkmal,
  _mitarbeiter_merkmal,
  _freigabe,
  _freigabestatus,
  _dienstrating,
  _dienstwunsch,
  _vertragsphase,
  _urlaubssaldo_absprache,
  _einteilung_rotation,
  _diensteinteilung,
  _datei,
  _funktion,
  _hains_groups,
  _mitarbeiter,
  _po_dienst,
  _team,
  _vertrag,
  _zeitraum_kategorie,
  _thema,
  _standort,
  _nicht_einteilen_absprache,
  _dienstkategorie
} from '@my-workspace/prisma_cruds';

import { getMitarbeiterInfos, proceesDataForVertragsTyps } from './helper';
import { transformObject, processData, newDate } from '@my-workspace/utils';
import {
  User,
  Mitarbeiter,
  Geraetepass,
  NichtEinteilenAbsprache,
  AccountInfo,
  Dienstkategorie,
  Dienstwunsch
} from '@my-workspace/models';
import { addMonths, endOfMonth, startOfMonth } from 'date-fns';

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
    result['zeitraumkategorie'] = await _zeitraum_kategorie.getAllZeitraumKategories();
    result['mitarbeiters'] = await _mitarbeiter.getAllActiveMitarbeiter();
    result['all_mitarbeiters'] = await _mitarbeiter.getAllMitarbeiter();
    result['dienste'] = await _po_dienst.getAllPoDiensts();
    result['teams'] = await _team.findMany();
    result['merkmale'] = await _merkmal.getAll();
    result['standorte'] = await _standort.getAllStandorte();
    result['themen'] = await _thema.findMany();

    return result;
  }

  async getEinteilungenInTime(body) {
    const { start, end, id: mitarbeiter_id } = body;
    const einteilungen = await _diensteinteilung.getPublicRangeEinteilungenForMitarbeiter(
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
      account_info: {
        include: {
          user: {
            include: {
              user_gruppes: {
                include: {
                  gruppes: true
                }
              }
            }
          }
        }
      },
      funktion: true
    });
    const teamAm = await Mitarbeiter.mitarbeiterTeamAm(newDate(), null, null, null, mitarbeiterId);
    const teams = await _team.getAllTeams();
    const accountInfo = mitarbeiter.account_info;
    const freigaben = await _freigabe.getByMitarbeiterId(mitarbeiterId);
    const freigabestatuses = await _freigabestatus.getAll();
    const dienste = await Mitarbeiter.getFreigegebeneDienste(mitarbeiterId);
    const ratings = await _dienstrating.getByMitarbeiterId(mitarbeiterId);
    const dienstwunsche = await _dienstwunsch.getByMitarbeiterIdForFuture(mitarbeiterId);
    const vertragsphasen = await _vertragsphase.getByMitarbeiterId(mitarbeiterId);
    const automatischeEinteilungen = await Mitarbeiter.getAutomatischeEinteilungen(mitarbeiterId);
    const arbeitszeitAbsprachen = await Mitarbeiter.getArbeitszeitAbsprachen(mitarbeiterId);
    const urlaubssaldoAbsprachen = await _urlaubssaldo_absprache.getByMitarbeiterId(mitarbeiterId);
    const merkmale = await _merkmal.getAll({ merkmal_options: true });
    const mitarbeiterMerkmale = await _mitarbeiter_merkmal.getAll();
    const alleRotationen = isRotationsPlaner
      ? await _einteilung_rotation.sortedByVon(mitarbeiterId)
      : await _einteilung_rotation.getPublished(mitarbeiterId);

    const overview = await Geraetepass.searchOverview(mitarbeiter, { mitarbeiter_id: mitarbeiterId });
    const nichtEinteilenAbsprachen = await _nicht_einteilen_absprache.findMany(
      {
        where: {
          mitarbeiter_id: mitarbeiterId
        }
      },
      {
        zeitraumkategories: true,
        nicht_einteilen_standort_themen: {
          include: {
            standorts: true,
            themas: true
          }
        }
      }
    );

    const einteilungenInKontingenten = await _einteilung_rotation.getEinteilungenInKontingente(
      [mitarbeiterId],
      isRotationsPlaner
    );

    const statistic = await Mitarbeiter.getKontingentEingeteiltBasis(
      mitarbeiterId,
      einteilungenInKontingenten
    );

    const currentDate = newDate();
    const anfang = startOfMonth(currentDate);
    const ende = endOfMonth(addMonths(currentDate, 8));
    const diesntwunschVerteilung = await Dienstwunsch.verteilung(anfang, ende);
    result['dienstwunsch_verteilung'] = diesntwunschVerteilung;

    result['urlaubssaldo_absprachen'] = urlaubssaldoAbsprachen;
    result['mitarbeiter_merkmale'] = mitarbeiterMerkmale;
    result['arbeitszeit_absprachen'] = arbeitszeitAbsprachen;
    result['teams'] = processData('id', teams);
    result['mitarbeiter'] = transformObject(mitarbeiter, [
      {
        key: 'weiterbildungsjahr',
        method: Mitarbeiter.addWeiterbildungsjahr
      }
    ]);
    result['accountInfo'] = transformObject(accountInfo, [
      {
        key: 'renten_eintritt',
        method: AccountInfo.rentenEintritt
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

    result['geraetepaesse'] = overview.geraete;
    result['rollen'] = accountInfo.user.user_gruppes.map((ug) => ug.gruppes) || [];
    result['nicht_einteilen_absprachen'] =
      NichtEinteilenAbsprache.transformNichtEinteilenAbsprache(nichtEinteilenAbsprachen);

    result['dienstkategories'] = await Dienstkategorie.getDienstKategorieForMitarbeiterInfo();

    return result;
  }
}
