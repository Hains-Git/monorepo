import { getTagLabel, isNextDay } from '../../tools/dates';
import { development } from '../../tools/flags';
import {
  apiGetSaldi,
  getSaldo,
  prepareUrlaubsSaldi,
  getEinteilungenForAntraege
} from '../../tools/helper';
import Rotation from '../apimodels/rotation';
import Team from '../apimodels/team';
import Basic from '../basic';
import Data from '../urlaubsantraege/data/Data';
import UrlaubsantraegeTable from '../urlaubsantraege/urlaubsantraegetable';

class Urlaubsantraege extends Basic {
  constructor(data, props, appModel = false) {
    super(appModel);
    this.resetSalid();
    this.init(props, data);
    this.logger = false;
    this.resetEinteilungen();
    this._preventExtension();
  }

  updateSaldiUi() {
    this.update('updateSaldi');
  }

  updateEinteilungenUi() {
    this.update('einteilungenToReplace');
  }

  /**
   * Setzt die Daten
   * @param {Object} data
   */
  setData(data = {}) {
    this._set('data', data);
  }

  /**
   * Setzt das urlaubs_antraege_table-Objekt
   * @param {Object} obj
   */
  setUrlaubsAntraegeTable(obj = {}) {
    this._set('urlaubs_antraege_table', obj);
  }

  /**
   * Führt ein Reset der Daten aus
   */
  resetSalid() {
    this._setObject('saldiResponse', {});
    this._setObject("saldi", {});
    this._setObject("mitarbeiter_infos", {});
    this._setObject("teams", {});
  }

  resetEinteilungen() {
    this._setObject('einteilungenToReplace', {});
    this._setObject('einteilungenToCreateForDates', {});
  }

  /**
   * Liefert die Rotationen des Mitarbeiters
   * @param {Number} mitarbeiterId
   * @returns String
   */
  getRotationenMsg(mitarbeiterId) {
    const roationen = this.mitarbeiter_infos?.rotationen?.[mitarbeiterId];
    const rotationenMsg =
      (roationen?.length &&
        roationen
          ?.map?.(
            (rotation) =>
              new Rotation(rotation, this._appModel)?.kontingentLabel ||
              rotation?.id ||
              'Error'
          )
          ?.join?.(', ')) ||
      'Keine';
    return rotationenMsg;
  }

  /**
   * Liefert die Teams des Mitarbeiters
   * @param {Number} mitarbeiterId
   * @returns String
   */
  getTeamMsg(mitarbeiterId) {
    const teamDates = this.mitarbeiter_infos?.team_ids?.[mitarbeiterId];
    const teams = {};
    if (this._isObject(teamDates)) {
      for (const tag in teamDates) {
        teamDates[tag]?.forEach?.((teamId) => {
          const team = this._teams?.[teamId];
          if (!teams[teamId]) {
            teams[teamId] = {
              label: team?.name || `ÌD: ${teamId}`,
              msg: [[tag]],
              sort: this._dateZahl(tag)
            };
          } else {
            const i = teams[teamId].msg.length - 1;
            const arr = teams[teamId].msg?.[i];
            const j = (arr?.length || 1) - 1;
            const previousDay = arr?.[j];
            if (previousDay) {
              if (isNextDay(tag, previousDay)) {
                teams[teamId].msg[i].push(tag);
              } else {
                teams[teamId].msg.push([tag]);
              }
            } else {
              console.error(
                'Kein previousDay',
                teams[teamId],
                tag,
                i,
                j,
                arr,
                previousDay
              );
            }
          }
        });
      }
    }
    const teamsArray = Object.values(teams);
    const teamMsg = teamsArray.length
      ? teamsArray
          .sort((a, b) => a.sort - b.sort)
          .map(
            ({ label, msg }) =>
              `${label} (${msg
                .map((arr) =>
                  arr.length > 1
                    ? `${getTagLabel(arr[0])} - ${getTagLabel(arr[arr.length - 1])}`
                    : getTagLabel(arr[0])
                )
                .join(', ')})`
          )
          .join(', ')
      : 'Keine';
    return teamMsg;
  }

  formHasValues(formDataState) {
    return formDataState?.antragstyp_id && formDataState?.mitarbeiter_id && formDataState?.start && formDataState?.ende
  }

  getEinteilungen(formDataState, finishLoading) {
    this.resetEinteilungen();
    this.updateEinteilungenUi();
    if (this.formHasValues(formDataState)) {
      getEinteilungenForAntraege(formDataState, (data) => {
        development && console.log('getEinteilungen', data);
        if(this._isObject(data)) {
          this._setObject('einteilungenToReplace', data);
          const dataObj = {};
          Object.entries(data).forEach(([date, obj]) => {
            dataObj[date] = {
              dienst_id: obj?.select?.[0]?.po_dienst_id?.toString?.() || '',
              holiday: !!obj?.holiday
            }
          });
          this._setObject('einteilungenToCreateForDates', dataObj);
        }
        finishLoading();
        this.updateEinteilungenUi();
      }, () => {
        finishLoading();
        this.updateEinteilungenUi();
      });
    } else {
      finishLoading();
      this.updateEinteilungenUi();
    }
  }

  updateEinteilungenForDates(date, po_dienst_ids_str) {
    if(this._isObject(this.einteilungenToCreateForDates?.[date])) {
      this.einteilungenToCreateForDates[date].dienst_id = po_dienst_ids_str?.toString?.() || '';
    }
    this.updateEinteilungenUi();
  }

  /**
   * Berechnet das Saldo für ein Team und erstellt dessen Titel
   * @param {Number} teamId
   * @param {String} tag
   * @returns Object
   */
  getSaldo(teamId, tag) {
    return getSaldo(teamId, tag, this.saldi, this._statistiken, this.teams);
  }

  /**
   * Lädt die Urlaubssaldi aus der Datenbank, strukturiert die Daten und berechnet die Saldi.
   * @param {Object} formData
   * @param {Function} finishLoading
   */
  getSaldi(formData, finishLoading) {
    this.resetSalid();
    this.updateSaldiUi();
    if (this.formHasValues(formData)) {
      apiGetSaldi(
        formData,
        (res) => {
          development && console.log('getSaldi', res);
          const teams = {};
          this._setObject('saldiResponse', res);
          this._setObject('saldi', prepareUrlaubsSaldi(
            res?.saldi,
            res?.dates,
            this?._statistiken,
            teams,
            (team) => new Team(team, this._appModel)
          ));
          this._setObject('mitarbeiter_infos', res?.mitarbeiter_infos);
          this._setObject('teams', teams);
          finishLoading();
          this.updateSaldiUi();
        },
        () => {
          finishLoading();
          this.updateSaldiUi();
        }
      );
    } else {
      finishLoading();
      this.updateSaldiUi();
    }
  }

  init(props = {}, data = {}) {
    const dataM = new Data(data, this._appModel);
    this.setData(dataM);
    const urlaubsAntraegeTable = new UrlaubsantraegeTable(
      dataM,
      this._appModel
    );
    this.setUrlaubsAntraegeTable(urlaubsAntraegeTable);
  }
}

export default Urlaubsantraege;
