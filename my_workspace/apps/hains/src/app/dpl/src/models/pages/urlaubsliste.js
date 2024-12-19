import Basic from '../basic';
import Einteilung from '../apimodels/einteilung';
import Team from '../apimodels/team';
import {
  apiGetEinteilungenOhneBedarf,
  prepareUrlaubsSaldi,
  getSaldo,
  saveAbwesentheitenSettings,
  loadAbwesentheiten,
  createNewCounterAbwesentheiten,
  removeCounterAbwesentheiten
} from '../../tools/helper';
import AbwesentheitenChannel from '../urlaubsliste/channel';

/**
 *
 * @class
 * @classdesc
 */
class Urlaubsliste extends Basic {
  constructor(data, props, appModel = false) {
    super(appModel);
    this._set('einteilungen', {});
    this.init(data.einteilungen);
    this.dates = data.dates;
    this.sortDates();
    this.createMitarbeitersEinteilung();
    this._set('isLoading', false);
    this._set('channel', new AbwesentheitenChannel(this, this._appModel));
    this.date_view_last = '';
    this._set('team', {});
    this._set('teams', {});
    this._set('teamIds', []);
    this._set('preparedSaldi', {});
    this._set('abwesentheiten', data?.abwesentheiten);
    this._set('allCustomColumns', data?.all_column_keys);
    this._set('awColumnNames', data.aw_column_names);
    this._set('settings', data.settings);
    this._set('counters', data.counters);
    this._set('aw_counter_po_dienst', data.aw_counter_po_dienst);
    this.initSaldi(data?.urlaubssaldi, data.dates);
    this.activeMitarbeiters = this._mitarbeiters
      ._each(
        () => {},
        (m) => m?.aktiv
      )
      .arr.sort((a, b) => {
        if (a.funktion_id < b.funktion_id) return -1;
        if (a.funktion_id > b.funktion_id) return 1;
        return a.planname.localeCompare(b.planname);
      });
    this._set('kalendermarkierung', {});
    this.setKalenderMarkierung(data.kalendermarkierung, data.dates);
  }

  setKalenderMarkierung(kalendermarkierung, dates) {
    const datesArr = Object.keys(dates);
    datesArr.forEach((date) => {
      const { flag, tooltip, color } = this.getKalenderMarkierungObj(date, kalendermarkierung);
      if (flag) {
        this.kalendermarkierung[date] = { tooltip, color };
      }
    });
  }

  getKalenderMarkierungObj(date, kalendermarkierung) {
    let flag = false;
    const tooltip = [];
    let prio = 0;
    let color = '';
    kalendermarkierung.forEach((km) => {
      const sdate = new Date(km.start).getTime();
      const edate = new Date(km.ende).getTime();
      const cdate = new Date(date).getTime();
      if (cdate >= sdate && cdate <= edate) {
        const category = km.category;
        const name = km.name;
        const title = { txt: `${category} - ${name}`, prio: km.prio };
        tooltip.push(title);
        flag = true;
        if (km.prio > prio) {
          color = km.color;
          prio = km.prio;
        }
      }
    });
    tooltip.sort((a, b) => b.prio - a.prio);
    return { flag, tooltip, color };
  }

  addTeam(items) {
    items.forEach((item) => {
      if (!this.team[item.team.id]) {
        this.team[item.team.id] = item.team;
      }
    });
  }

  createTeams() {
    this._set('team', this._teams._each().obj);
  }

  updateMe() {
    this.createTeams();
  }

  createNewTeamFromTeams = (team) => {
    return new Team(team, this._appModel);
  };

  initSaldi(urlaubssaldi, dates) {
    if (!this._isObject(dates)) {
      console.error('dates not an object', dates);
      return;
    }
    const datesArr = Object.keys(dates);
    const saldiTeam = urlaubssaldi?.saldi || urlaubssaldi;
    const prepareSaldi = prepareUrlaubsSaldi(
      saldiTeam,
      datesArr,
      this._statistiken,
      this.teams,
      this.createNewTeamFromTeams
    );
    this._set('preparedSaldi', { ...this.preparedSaldi, ...prepareSaldi });
  }

  getSaldo(teamID, day) {
    return getSaldo(teamID, day, this.preparedSaldi, this._statistiken, this.teams);
  }

  addDates(dates) {
    Object.values(dates).forEach((date) => {
      if (!this.dates[date.id]) {
        this.dates[date.id] = date;
      }
    });
  }

  sortDates() {
    this.datesArr = [...Object.values(this.dates)].sort((a, b) => a.date_nr - b.date_nr);
  }

  addEinteilung(einteilung) {
    if (this.einteilungen[einteilung.id]) return;
    this.einteilungen[einteilung.id] = einteilung;
  }

  init(einteilungen) {
    einteilungen.forEach((e) => {
      const einteilung = new Einteilung(e, this._appModel);
      this.addEinteilung(einteilung);
    });
  }

  uiUpdate() {
    this.update('ui');
  }

  createMitarbeitersEinteilung() {
    const einteilungen = Object.values(this.einteilungen);
    const m = {};
    einteilungen.forEach((einteilung) => {
      const mId = einteilung.mitarbeiter_id;
      const dateStr = einteilung.tag;
      if (!m[mId]) {
        m[mId] = {};
      }
      if (!m[mId][dateStr]) {
        m[mId][dateStr] = [];
      }
      m[mId][dateStr].push(einteilung);
    });
    this._set('einteilungenNachMitarbeiter', m, true);
    return m;
  }

  setLoader(setState) {
    this._set('setLoaderState', setState);
  }

  loadNewAbwesentheiten(year) {
    this.setLoaderState(() => true);
    const params = {
      year
    };
    loadAbwesentheiten(params, (response) => {
      this.abwesentheiten[year] = response.abwesentheiten[year];
      this.setLoaderState(() => false);
      this.update('newAbwesentheiten');
    });
  }

  loadNewData(scrollPast, dateView, updateWideScreen = false) {
    this.setLoaderState(() => true);
    const direction = scrollPast ? 'past' : 'future';
    const params = {
      date_view: dateView,
      left_side_date: dateView,
      init: false,
      direction
    };

    if (dateView === this.date_view_last) {
      return;
    }

    if (this.isLoading) {
      return;
    }

    apiGetEinteilungenOhneBedarf(params, (response) => {
      this.init(response.einteilungen);
      this.addDates(response.dates);
      this.createMitarbeitersEinteilung();
      this._set('isLoading', false);
      this.date_view_last = dateView;
      this.sortDates();
      this.initSaldi(response.urlaubssaldi, response.dates);
      this.setKalenderMarkierung(response.kalendermarkierung, response.dates);
      this.setLoaderState(() => false);
      this.uiUpdate();
      if (updateWideScreen) this.update('wideScreen');
    });

    this._set('isLoading', true);
  }

  loadNewDataForBiggerScreens(scrollPast, dateView) {
    this.loadNewData(scrollPast, dateView, true);
  }

  updateSettings(setting) {
    this._set('settings', setting);
  }

  saveSettings(visibleColumns, visibleTeamIds, cb) {
    const params = {
      visible_columns: visibleColumns,
      visible_team_ids: visibleTeamIds
    };
    saveAbwesentheitenSettings(params, (res) => {
      if ('id' in res) {
        this.updateSettings(res);
        cb();
      }
    });
  }

  addCounter(counter) {
    if (this.counters[counter.id]) return;
    this.counters[counter.id] = counter;
  }

  addAwCounterVal(awCounter, id) {
    if (this.aw_counter_po_dienst[id]) return;
    this.aw_counter_po_dienst[id] = awCounter;
  }

  addNewCounter(counter, setLoading) {
    createNewCounterAbwesentheiten(counter, (res) => {
      setLoading(false);
      this.addCounter(res?.counter);
      const awCounterId = Object.keys(res.aw_counter_po_dienst)[0];
      const awCounter = res.aw_counter_po_dienst[awCounterId];
      this.addAwCounterVal(awCounter, awCounterId);
      this.update('counterUpdate');
    });
  }

  removeCounter(id, setLoading) {
    const idInt = parseInt(id, 10);
    removeCounterAbwesentheiten({ id: idInt }, (res) => {
      setLoading(false);
      if (res.destroyed) {
        delete this.counters[idInt];
        delete this.aw_counter_po_dienst[idInt];
        this.update('counterUpdate');
      } else {
        alert('Eintrag konnte nicht entfernt werden');
      }
    });
  }

  addNeweinteilung(einteilungen) {
    einteilungen.forEach((e) => {
      const einteilung = new Einteilung(e, this._appModel);
      this.addEinteilung(einteilung);
    });
  }

  removeEinteilungen(mitarbeiter_ids, von, bis) {
    if (!von || !bis || !mitarbeiter_ids) return;
    const vonZahl = this._dateZahl(von);
    const bisZahl = this._dateZahl(bis);

    mitarbeiter_ids?.forEach?.((mId) => {
      const mitarbeiterEinteilungen = this.einteilungenNachMitarbeiter[mId];
      if (!mitarbeiterEinteilungen) return;
      for (const date in mitarbeiterEinteilungen) {
        const dateZahl = this._dateZahl(date);
        const einteilungen = mitarbeiterEinteilungen[date];
        if (dateZahl >= vonZahl && dateZahl <= bisZahl) {
          einteilungen?.forEach?.((e) => {
            if (this.einteilungen[e.id]) {
              delete this.einteilungen[e.id];
            }
          });
        }
      }
    });
  }

  updateEinteilungenByChannel(einteilungen, mitarbeiter_ids, von, bis) {
    this.removeEinteilungen(mitarbeiter_ids, von, bis);
    this.addNeweinteilung(einteilungen);
    this.createMitarbeitersEinteilung();
    this.uiUpdate();
  }

  updateAbwesentheiten(item) {
    const mitarbeiter_id = item?.mitarbeiter_id;
    const year = item?.jahr;
    this.abwesentheiten[year][mitarbeiter_id] = item;
    this.update('newAbwesentheiten');
  }
}

export default Urlaubsliste;
