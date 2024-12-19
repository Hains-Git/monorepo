import Timeline from '../rotationsplanung/timeline';
import Data from '../rotationsplanung/data/data';
import Basic from '../basic';
import { numericLocaleCompare } from '../../tools/helper';
import { formatDate, toDate, today } from '../../tools/dates';
import { returnError } from '../../tools/hains';
import { isObject } from '../../tools/types';
import { throttle, wait } from '../../tools/debounce';
import RotationsplanChannel from '../rotationsplanung/channel';

class Rotationsplan extends Basic {
  constructor(data, props, appModel = false) {
    super(appModel);
    this.reset();
    this._setObject('channel', new RotationsplanChannel(this, this._appModel));
    this.init(props, data);
    this._preventExtension();
  }

  updateMe() {
    this.timeline.fillContingentIds();
    this.timeline.fillEmployeeIds();
    if (this.timeline.view === 'contingent') {
      this.connectRotationenToContingent();
    }
    if (this.timeline.view === 'mitarbeiter') {
      this.connectRotationenToEmployee();
    }
  }

  /**
   * Setzt das Datum für die VK-Informationen und holt ggf. die Daten aus der API.
   * @param {string} date
   * @param {boolean} getVKTeamOverview
   * @returns {string} vkDate
   */
  setVKDate(date, getVKTeamOverview = false) {
    this._set('vkDate', date);
    if (getVKTeamOverview) this.throttleGetVKTeamOverview();
    return this.vkDate;
  }

  throttleGetVKTeamOverview = throttle(() => this.getVKTeamOverview(), wait);

  /**
   * Führt ein Update der VK-Informationen durch.
   * @param {Object} data
   */
  updateVkTeamOverview(data) {
    if (isObject(data)) {
      for (const dateKey in data) {
        this.vk_team_overview[dateKey] = data[dateKey];
      }
      this.update('vk-update', {});
    }
  }

  /**
   * Führt ein Update der VK-Informationen durch die API durch
   */
  getVKTeamOverview() {
    this?._hains?.api?.(
      'vk_team_overview',
      'get',
      {
        anfang: this.vkDate,
        ende: this.vkDate
      },
      (data) => {
        this.updateVkTeamOverview(data);
      },
      returnError
    );
  }

  /**
   * Liefert die VK-Informationen für das Team und das Kontingent
   * @param {number} tId
   * @param {number} kId
   * @returns {number} vk
   */
  getVKKontingent(tId, kId) {
    const yearMonth = toDate(this.vkDate).toISOString().slice(0, 7);
    return this.vk_team_overview[yearMonth]?.[tId]?.kontingente?.[kId]?.vk || 0;
  }

  /**
   * Liefert die VK-Informationen für das Team und das Kontingent im Detail.
   * @param {Number} tId
   * @param {Number} kId
   * @returns {string} msg
   */
  getVKKontingentTitle(tId, kId) {
    let msg = '';
    const yearMonth = toDate(this.vkDate).toISOString().slice(0, 7);
    const vk_team = this.vk_team_overview[yearMonth]?.[tId];
    if (!isObject(vk_team)) return msg;
    const vk_kontingent = vk_team?.kontingente?.[kId];
    const kontingent = this.data?.kontingente?.[kId];
    msg += `VK ${kontingent?.name || 'Kontingent'}: ${vk_kontingent?.vk || 0}\n`;
    msg += `VK ${kontingent?.team?.name || 'Kontingent'}: ${vk_team?.vk || 0}`;
    return msg;
  }

  /**
   * Liefert de Informationen zu den eingeteilten Kontingenten der Mitarbeiterin
   * @param {Number} mitarbeiterId
   * @returns Array
   */
  kontingenteEingeteilt(mitarbeiterId) {
    const id = parseInt(mitarbeiterId, 10) || 0;
    const _info = [];
    const aktiv = this._mitarbeiter[id]?.aktiv;
    if (!aktiv) {
      _info.push({ txt: 'Inaktiv', key: 'inaktiv' });
    }
    const eingeteilteKontingente = this.eingeteilte_kontingente?.[id];
    if (!this._isObject(eingeteilteKontingente)) return _info;
    for (const kId in eingeteilteKontingente) {
      const kontingent = eingeteilteKontingente[kId];
      const msg = [];
      if (this._isObject(kontingent.einteilungen)) {
        for (const key in kontingent.einteilungen) {
          const eingeteilt = [];
          const einteilung = kontingent.einteilungen[key];
          const typ = key === 'all' ? 'Ges.' : 'In Rot.';
          const sum = einteilung?.eingeteilt_sum || 0;
          const defaultValue = einteilung?.default_eingeteilt || 0;
          if (sum) eingeteilt.push(sum);
          if (defaultValue) eingeteilt.push(`(${defaultValue} Excel)`);
          if (eingeteilt.length) {
            eingeteilt.unshift(typ);
            msg.push(eingeteilt.join(' '));
          }
        }
      }
      _info.push({
        txt: `${kontingent.name}: ${msg.join(', ') || '0'}`,
        key: `${kontingent.id}-${_info.length}`
      });
    }
    return _info.sort((a, b) => a.txt.localeCompare(b.txt));
  }

  updateKontingenteEngeteilt(data) {
    const id = parseInt(data?.mitarbeiter_id, 10) || 0;
    if (this._isObject(data?.eingeteilte_kontingente)) {
      this.eingeteilte_kontingente[id] = data.eingeteilte_kontingente;
    }
  }

  setTimeline(timeline = {}) {
    this._set('timeline', timeline);
  }

  setData(data = {}) {
    this._set('data', data);
  }

  reset() {
    this.setTimeline();
    this.setData();
    this.setVKDate(formatDate(today()), false);
  }

  init(props = {}, data = {}) {
    this.setTimeline(new Timeline(props, this._appModel));
    const dataM = new Data(data, this._appModel);
    this.setData(dataM);
    this._setObject(
      'eingeteilte_kontingente',
      data?.eingeteilte_kontingente || {}
    );
    this._setObject('vk_team_overview', data?.vk_team_overview || {});
  }

  sortKontigentsByPositionAsc(a, b) {
    if (a.position === b.position) {
      return a.name.localeCompare(b.name);
    }
    return a.position - b.position;
  }

  sortKontigentsCompsByPositionAsc(a, b) {
    const aPos = a.props.contingent.position;
    const bPos = b.props.contingent.position;

    if (aPos === bPos) {
      return a.props.contingent.name.localeCompare(b.props.contingent.name);
    }
    return aPos - bPos;
  }

  eachKontingent(callback) {
    const arr = [];
    const contingente = this.data.kontingente;
    if (contingente) {
      for (const kId in contingente) {
        if (this.timeline.contingentIds.includes(parseInt(kId, 10))) {
          if (callback) {
            arr.push(callback(contingente[kId]));
          } else {
            arr.push(contingente[kId]);
          }
        }
      }
    }
    if (callback) {
      return arr.sort(this.sortKontigentsCompsByPositionAsc);
    }
    return arr.sort(this.sortKontigentsByPositionAsc);
  }

  eachEmployee(callback) {
    const arr = [];
    const employeesObj = this._mitarbeiter;
    const onlyActiveEmployees = this.timeline.onlyActiveEmployees;
    const employeeIds = this.timeline.employeeIds;
    if (employeesObj) {
      for (const eId in employeesObj) {
        const employee = employeesObj[eId];
        if (
          employeeIds.includes(parseInt(eId, 10)) &&
          (!onlyActiveEmployees || employee.aktiv)
        ) {
          arr.push(callback ? callback(employee) : employee);
        }
      }
    }
    return arr.sort((a, b) => {
      const mitarbeiterA = callback ? a.props.employee : a;
      const mitarbeiterB = callback ? b.props.employee : b;
      // Sort by Planname inside the same Funktion
      if (mitarbeiterA.funktion_id === mitarbeiterB.funktion_id) {
        return numericLocaleCompare(
          mitarbeiterA.planname,
          mitarbeiterB.planname
        );
      }
      // Sort by Funktion-ID
      return mitarbeiterA.funktion_id - mitarbeiterB.funktion_id;
    });
  }

  connectRotationenToEmployee() {
    for (const id in this.data.rotationen) {
      const rotation = this.data.rotationen[id];
      rotation.addToEmployee();
    }
    for (const id in this.data.mitarbeiter) {
      const employee = this.data.mitarbeiter[id];
      employee.sortAndSetPos();
    }
  }

  connectRotationenToContingent() {
    for (const id in this.data.rotationen) {
      const rotation = this.data.rotationen[id];
      rotation.addToContingent();
    }
    for (const id in this.data.kontingente) {
      const kontingent = this.data.kontingente[id];
      kontingent.sortAndSetPos();
    }
  }

  disconnectRotationenFromEmployee() {
    for (const id in this.data.mitarbeiter) {
      const employee = this.data.mitarbeiter[id];
      employee.resetIds();
    }
  }

  disconnectRotationenFromContingent() {
    for (const id in this.data.kontingente) {
      const kontingent = this.data.kontingente[id];
      kontingent.resetIds();
    }
  }

  eachTeam(callback) {
    const arr = [];
    this?._teams?._each((team) => {
      arr.push(callback(team));
    });
    return arr;
  }
}

export default Rotationsplan;
