import Data from '../helper/data';
import VerteilerBedarfseintrag from './VerteilerBedarfseintrag';
import VerteilerEinteilung from './VerteilerEinteilung';
import VerteilerSchichten from './VerteilerSchichten';
import VerteilerPlanerdate from './VerteilerPlanerdate';
import Wunsch from '../apimodels/wunsch';
import Rotation from '../apimodels/rotation';
import Bedarf from '../apimodels/bedarf';
import { development } from '../../tools/flags';
import {
  getRandomNumberNotInSet,
  sortAuswahlDropdown,
  sortByRoom
} from '../../tools/helper';
import VerteilerCollections from './VerteilerCollections';
import WochenverteilerBereiche from './WochenverteilerBereiche';
import VerteilerLayouts from './VerteilerLayouts';
import { toDate } from '../../tools/dates';
import FeldV from './FeldV';

class VerteilerData extends Data {
  constructor(data, appModel = false) {
    console.time('VerteilerData');
    super(appModel);
    this.initData(data.verteiler_dates);
    this.collections = this.initCollections(data.collections);
    this.vorlagen = data.vorlagen;
    this.bereiche = this.initBereiche(data.bereiche);
    this.dienste = this._po_dienste;
    this.layouts = this.initLayout(data.layout);
    this.user_settings = this.initUserSettings(data);
    this.bedarfeMap = {};
    this._set('CLASSES', {
      bedarfseintraege: (obj) => {
        const vbe = new VerteilerBedarfseintrag(obj, appModel);
        if (!this.bedarfseintraege_hash[vbe.tag]) {
          this.bedarfseintraege_hash[vbe.tag] = {
            nachBereich: {},
            nachDienst: {}
          };
        }
        this.addToBedarfseintraegeHash(
          vbe.tag,
          vbe.id,
          'nachBereich',
          vbe.bereich_id,
          vbe.po_dienst_id
        );
        this.addToBedarfseintraegeHash(
          vbe.tag,
          vbe.id,
          'nachDienst',
          vbe.po_dienst_id,
          vbe.bereich_id
        );

        return vbe;
      },
      dates: (obj) => new VerteilerPlanerdate(obj, appModel),
      einteilungen: (obj) => {
        const ve = new VerteilerEinteilung(obj, appModel);
        if (!this.day_podienst_einteilungen[ve.tag]) {
          this.day_podienst_einteilungen[ve.tag] = {};
        }
        if (!this.day_podienst_einteilungen[ve.tag][ve.po_dienst_id]) {
          this.day_podienst_einteilungen[ve.tag][ve.po_dienst_id] = [];
        }
        this.day_podienst_einteilungen[ve.tag][ve.po_dienst_id].push(ve);
        return ve;
      },
      schichten: (arr) =>
        arr.map((schicht) => new VerteilerSchichten(schicht, appModel)),
      rotationen: (obj) => new Rotation(obj, appModel),
      wuensche: (obj) => new Wunsch(obj, appModel),
      bedarfe: (obj) => new Bedarf(obj, appModel)
    });
    if (development) this._whoAmI();
    console.timeEnd('VerteilerData');
  }

  get firstVerteilerDate() {
    return this.verteiler_dates?.[0];
  }

  get lastVerteilerDate() {
    return this.verteiler_dates?.[(this.verteiler_dates?.length || 1) - 1];
  }

  get anfang() {
    let result = this.firstVerteilerDate;
    const firstJsDate = new Date(this.firstVerteilerDate);
    const month = firstJsDate.getMonth();
    const year = firstJsDate.getFullYear();
    this?._dates?._each?.((date) => {
      const jsDate = new Date(date.id);
      if (jsDate.getMonth() === month && jsDate.getFullYear() === year) {
        result = date.id;
        return true;
      }
      return false;
    });
    return result;
  }

  get ende() {
    let result = this.lastVerteilerDate;
    const lastJsDate = new Date(this.lastVerteilerDate);
    const month = lastJsDate.getMonth();
    const year = lastJsDate.getFullYear();
    this?._dates?._each?.(
      (date) => {
        const jsDate = new Date(date.id);
        if (jsDate.getMonth() === month && jsDate.getFullYear() === year) {
          result = date.id;
          return true;
        }
        return false;
      },
      false,
      true
    );
    return result;
  }

  get kontingente() {
    return this?._kontingente?._each()?.arr || [];
  }

  /**
   * Holt sich das zur Vorlage passende Layout
   */
  get layout() {
    return this.layouts?.layout;
  }

  get allEinteilungenPublic() {
    let res = true;
    this.eachVerteilerDate((day) => {
      if (!res) return res;
      const dienste = this.day_podienst_einteilungen[day];
      if (!this._isObject(dienste)) return res;
      for (const po_dienst_id in dienste) {
        const einteilungen = dienste[po_dienst_id];
        if (!this._isArray(einteilungen)) continue;
        res = einteilungen.find((e) => !e.public) ? false : res;
        if (!res) return res;
      }
    });
    return res;
  }

  get dienstplan_ids() {
    return this.dienstplaene?.map?.((d) => d.id) || [];
  }

  /**
   * Gibt eine Liste mit den aktiven Mitarbeitern (für die Vorschläge) zurück,
   * sortiert nach Planname.
   * @returns Array mit aktiven Mitarbeitern
   */
  get aktiveMitarbeiter() {
    if (!this.__aktiveMitarbeiter?.length) {
      this.__aktiveMitarbeiter =
        this?._mitarbeiters?._each?.(false, (m) => !!m?.aktiv)?.arr || [];
    }
    return this.__aktiveMitarbeiter;
  }

  updateNotAllocatedEmployees() {
    this.update('not-allowcated-employee', {});
  }

  isMitarbeiterVerteilbar(mitarbeiter, tag) {
    return (
      mitarbeiter?.aktivAm?.(tag) &&
      !mitarbeiter?.hasEinteilungenAm(tag) &&
      !this.hasMitarbeiterDienstFreiAm(mitarbeiter?.id, tag)
    );
  }

  getDienstplanIdByTag(tag) {
    let result = this.dienstplaene?.[0]?.id || 0;
    const date = new Date(tag);
    const l = this.dienstplaene?.length || 0;
    if (l > 1) {
      this.dienstplaene?.find((dp) => {
        const anfang = new Date(dp.plantime_anfang);
        const ende = new Date(dp.plantime_ende);
        if (date >= anfang && date <= ende) {
          result = dp.id;
          return true;
        }
        return false;
      });
    }
    return result;
  }

  sortKontingenteByPriority(a, b, prios = {}) {
    const aPrio =
      prios[a] || this?._kontingente?.[a]?.isMagicEinteilungPrio || Infinity;
    const bPrio =
      prios[b] || this?._kontingente?.[b]?.isMagicEinteilungPrio || Infinity;
    prios[a] = aPrio;
    prios[b] = bPrio;
    return aPrio - bPrio;
  }

  createMagicEinteilungFeld(tag, dienstId, mId, bedarf) {
    const bereichId = bedarf?.bereich_id || 0;
    return new FeldV(
      {
        tag,
        bereichId,
        dienstId,
        bedarfeintragId: bedarf.id || 0,
        value: mId
      },
      this._appModel
    );
  }

  createMagicEinteilungData(tag, dienstId, mId, bereichId) {
    return {
      ...this._page.tmpEinteilung,
      dienstplan_id: this.getDienstplanIdByTag(tag),
      mitarbeiter_id: mId,
      po_dienst_id: dienstId,
      bereich_id: bereichId,
      von: tag,
      bis: tag,
      tag
    };
  }

  createMagicMitarbeiterAuswahl(
    bedarfFeld,
    tag,
    dienstId,
    bedarf,
    kId = 0,
    mitarbeiter = [],
    einteilungenMitarbeiter = {}
  ) {
    const used = new Set();
    const mitarbeiterAuswahl = [];
    const max = mitarbeiter?.length || 0;
    while (used.size < max) {
      const index = getRandomNumberNotInSet(max, used);
      const mit = mitarbeiter[index];
      const id = mit?.id || 0;
      const checked_id = `${tag}_${dienstId}_${kId}`;
      einteilungenMitarbeiter.checked = einteilungenMitarbeiter.checked || {};
      const checkedObj = einteilungenMitarbeiter.checked;
      if(!checkedObj?.[checked_id]) {
        checkedObj[checked_id] = {
          kontingent: this?._kontingente?.[kId],
          tag,
          dienst: this?._dienste?.[dienstId],
          k: this?._kontingente?.[kId]?.name, 
          d: this?._dienste?.[dienstId]?.planname,
          mitarbeiter: {}
        };
      }
      const isInKontingent = mit?.isInKontingentAm?.(tag, kId);
      const einteilen = isInKontingent && !einteilungenMitarbeiter[id];
      const key = isInKontingent ? 'inKontingent' : 'notInKontingent';
      checkedObj[checked_id].mitarbeiter[key] = checkedObj[checked_id].mitarbeiter[key] || {};
      checkedObj[checked_id].mitarbeiter[key][id] = {
        mitarbeiter: mit,
        name: mit?.planname,
        einteilen,
        eM: einteilungenMitarbeiter[id],
        isInKontingent
      };
      if (!einteilen) continue;
      const auswahl = {
        props: {
          feld: this.createMagicEinteilungFeld(tag, dienstId, id, bedarf),
          score: mit?.getScore?.(bedarfFeld) || {
            value: 0,
            title: '',
            props: false
          },
          mitarbeiter: mit
        }
      };
      mitarbeiterAuswahl.push(auswahl);
    }
    sortAuswahlDropdown(mitarbeiterAuswahl, false);
    return mitarbeiterAuswahl;
  }

  magicBedarfEinteilen(
    bedarfId,
    dienstId,
    tag,
    kId = 0,
    mitarbeiter = [],
    einteilungen = {}
  ) {
    const bedarf = this.bedarfseintraege?.[bedarfId];
    const l = mitarbeiter?.length || 0;
    if (!bedarf || !l) return;
    const bedarfFeld = this.createMagicEinteilungFeld(tag, dienstId, 0, bedarf);
    const gesamtBedarf = bedarf?.gesamtBedarf || 0;
    const fl = bedarf?.felder?.length || 0;
    if (fl >= gesamtBedarf) return;
    einteilungen[dienstId] = einteilungen[dienstId] || {};
    einteilungen[dienstId][tag] = einteilungen[dienstId][tag] || {};
    const einteilungenTag = einteilungen[dienstId][tag];
    einteilungen.mitarbeiter = einteilungen.mitarbeiter || {};
    einteilungen.mitarbeiter.count = einteilungen.mitarbeiter.count || 0;
    einteilungen.mitarbeiter[tag] = einteilungen.mitarbeiter[tag] || {};
    const einteilungMitarbeiter = einteilungen.mitarbeiter[tag];
    einteilungMitarbeiter.bedarfe = einteilungMitarbeiter.bedarfe || {};

    const mitarbeiterAuswahl = this.createMagicMitarbeiterAuswahl(
      bedarfFeld,
      tag,
      dienstId,
      bedarf,
      kId,
      mitarbeiter,
      einteilungMitarbeiter
    );
    const el = einteilungenTag[bedarfId]?.length || 0;
    const gl = fl + el;
    einteilungMitarbeiter.bedarfe[`${tag}_${dienstId}_${kId}_${bedarfId}`] = {
      k: this?._kontingente?.[kId]?.name, 
      tag, 
      d: this?._dienste?.[dienstId]?.planname,
      mitarbeiterAuswahl: mitarbeiterAuswahl.map(m => m.props.mitarbeiter.planname),
      infos: {fl, el, gl, ml: mitarbeiterAuswahl.length, gesamtBedarf}
    }
    for (let i = gl; i < gesamtBedarf && mitarbeiterAuswahl.length; i++) {
      const auswahl = mitarbeiterAuswahl.shift();
      const mitId = auswahl.props.mitarbeiter.id;
      einteilungMitarbeiter[mitId] = auswahl;
      auswahl.props.feld?.onDienstfrei?.(tag, (schichtTag) => {
        einteilungen.mitarbeiter[schichtTag] = einteilungen.mitarbeiter[schichtTag] || {};
        einteilungen.mitarbeiter[schichtTag][mitId] = true;
      });
      einteilungen.mitarbeiter.count++;
      if (einteilungenTag[bedarfId]) {
        einteilungenTag[bedarfId].push(auswahl);
      } else {
        einteilungenTag[bedarfId] = [auswahl];
      }
    }
  }

  magicDienstEinteilen(dienstId, dates, kId = 0, einteilungen = {}) {
    const funktionIds = this.user_settings?.funktion_ids || [];
    dates?.forEach?.((tag) => {
      if (!this?._dates?.[tag]) return;
      let mitarbeiter = this?.nichtVerteilte?.[tag] || [];
      if(funktionIds?.length) mitarbeiter = mitarbeiter.filter(m => funktionIds.includes(m.funktion_id));
      const bereiche =
        this?.bedarfseintraege_hash?.[tag]?.nachDienst?.[dienstId];
      if (!mitarbeiter?.length || !this._isObject(bereiche)) return;
      Object.values(bereiche).forEach((bedarfId) => {
        this.magicBedarfEinteilen(
          bedarfId,
          dienstId,
          tag,
          kId,
          mitarbeiter,
          einteilungen
        );
      });
    });
  }

  magicKontingentEinteilen(
    kId,
    dates,
    prios = {},
    einteilungen = {}
  ) {
    const kontingent = this?._kontingente?.[kId];
    const prio = prios[kId] || kontingent?.isMagicEinteilungPrio || Infinity;
    prios[kId] = prio;
    if (prio === Infinity) return;
    kontingent?.sortedEachMagicEinteilungDienst?.((dienst) => {
      const dienstId = dienst?.id;
      if (!dienstId) return;
      this.magicDienstEinteilen(dienstId, dates, kId, einteilungen);
    });
  }

  async magicRequest(dates, einteilungen, verteiler, finishLoading) {
    for (const dienstId in einteilungen) {
      if (dienstId === 'mitarbeiter') continue;
      for (const tag in einteilungen[dienstId]) {
        for (const bedarfId in einteilungen[dienstId][tag]) {
          for (const auswahl of einteilungen[dienstId][tag][bedarfId]) {
            if (!auswahl?.props?.feld) continue;
            const feld = auswahl.props.feld;
            // eslint-disable-next-line no-await-in-loop
            await verteiler.createNewEinteilung(
              this.createMagicEinteilungData(
                tag,
                dienstId,
                auswahl.props.mitarbeiter.id,
                feld?.bereichId
              )
            );
          }
        }
      }
    }
    if(this?._user?.isAdmin) {
      console.log("einteilungen", einteilungen, {...this.nichtVerteilte}, {...this.felder});
    }
    const includesDate = dates?.find?.(tag => this.verteiler_dates?.includes?.(tag));
    if(!includesDate) this.setNichtVerteilte(false);
    finishLoading();
  }

  getDates(vonDate, bisDate) {
    const dates = [];
    const curDate = new Date(vonDate);
    while (curDate <= bisDate) {
      const tag = curDate.toISOString().split('T')[0];
      curDate.setDate(curDate.getDate() + 1);
      if (!this?._dates?.[tag]) continue;
      dates.push(tag);
    }
    return dates;
  }

  magicEinteilen = (formData, finishLoading) => {
    const vonDate = new Date(formData.get('von'));
    const bisDate = new Date(formData.get('bis'));
    if (!vonDate.getTime() || !bisDate.getTime() || bisDate < vonDate) {
      finishLoading();
      alert('Bitte geben Sie ein gültiges Datum ein.');
      return;
    }
    const kontingente = formData.getAll('kontingente');
    if (!kontingente.length) {
      finishLoading();
      alert('Es wurde kein Kontingent ausgewählt.');
      return;
    }
    const dates = this.getDates(vonDate, bisDate);
    this.setNichtVerteilte(dates);
    const prios = {};
    const einteilungen = {};
    kontingente
      ?.sort((a, b) => this.sortKontingenteByPriority(a, b, prios))
      ?.forEach?.((kId) => {
        this.magicKontingentEinteilen(
          kId,
          dates,
          prios,
          einteilungen
        );
      });
    const verteiler = this._page;
    if (verteiler) {
      this.magicRequest(dates, einteilungen, verteiler, finishLoading);
    } else {
      finishLoading();
      alert('Es wurde kein Verteiler gefunden.');
      if (development)
        console.error('Es wurde kein Verteiler gefunden.', einteilungen, this);
    }
  };

  hasDienstplanID(id = 0) {
    return this.dienstplaene_ids.includes(id);
  }

  /**
   * Entfernt alle Einteilungen zu einem Tag, PoDienst und Bereich.
   * Nutzt das kopierte Array, damit die Schleife nicht durch die Änderung
   * des Arrays beeinflusst wird.
   * @param {String} tag
   * @param {Number} po_dienst_id
   * @param {Number} bereich_id
   */
  removeEinteilungenForBereich(tag, po_dienst_id, bereich_id) {
    const currentEinteilungen = this.getPoDienstEinteilungen(po_dienst_id, tag);
    currentEinteilungen.forEach((e) => {
      if (e.bereich_id === Number(bereich_id)) {
        this.einteilungAufhebenRemove(e.id);
      }
    });
  }

  getPoDienstEinteilungen(_po_dienst_id, dayCol, sort = false) {
    const einteilungen =
      this.day_podienst_einteilungen?.[dayCol]?.[_po_dienst_id];
    if (!this._isArray(einteilungen)) return [];
    return sort ? einteilungen.sort(sortByRoom) : einteilungen;
  }

  /**
   * Iteriert über die Verteiler_dates und führt eine Funktion aus.
   * @param {Function} func
   */
  eachVerteilerDate(func) {
    return this.verteiler_dates?.map?.((day, i) => func?.(day, i)) || [];
  }

  hasMitarbeiterDienstFreiAm(mId, day) {
    return !!this.dienstfrei?.[day]?.mitarbeiter_ids?.[mId]?.length;
  }

  setNichtVerteilte(dates = false) {
    this._setObject('nichtVerteilte', {});
    const call = (day) => {
      if (!this.nichtVerteilte[day]) this.nichtVerteilte[day] = [];
      this.nichtVerteilte[day] = this.aktiveMitarbeiter.filter((_record) => {
        return this.isMitarbeiterVerteilbar(_record, day);
      });
    };
    this.checkAllDienstfrei(dates);
    if(dates) {
      dates?.forEach?.(call);
    }else {
      this.eachVerteilerDate(call);
    }
    this.checkAddEmployeesToNichtVerteilt(dates);
    this.updateNotAllocatedEmployees();
    return this.nichtVerteilte;
  }

  getBedarf(tag, bereich_id, po_dienst_id) {
    const bereich =
      this.bedarfseintraege_hash?.[tag]?.nachDienst?.[po_dienst_id];
    // Finde den ersten Bedarf existierenden Bedarfseintrag für Josti_Bereich
    const bedarf_id =
      (!bereich_id && this._isObject(bereich)
        ? Object.values(bereich)?.[0]?.[0]
        : bereich?.[bereich_id]?.[0]) || 0;
    const be = this.bedarfseintraege?.[bedarf_id];
    return be;
  }

  getBedarfsBereiche(tag, po_dienst_id) {
    return this.bedarfseintraege_hash?.[tag]?.nachDienst?.[po_dienst_id] || {};
  }

  addEinteilungToDienstfrei(e, tag) {
    const dId = e.po_dienst_id;
    const mId = e.mitarbeiter_id;
    this.dienstfrei[tag] = this.dienstfrei[tag] || {};
    this.dienstfrei[tag][dId] = this.dienstfrei[tag][dId] || [];
    if (!this.dienstfrei[tag][dId].includes(e)) {
      this.dienstfrei[tag][dId].push(e);
    }
    if (this.dienstfrei[tag]?.mitarbeiter_ids?.[mId]) {
      this.dienstfrei[tag].mitarbeiter_ids[mId].push(e.id);
    } else {
      this.dienstfrei[tag].mitarbeiter_ids = this.dienstfrei[tag].mitarbeiter_ids || {};
      this.dienstfrei[tag].mitarbeiter_ids[mId] = [e.id];
    }
  }

  getPoDiensteDienstfrei(dayCol) {
    const po_dienste = [];
    if (!this.dienstfrei[dayCol]) return po_dienste;
    Object.entries(this.dienstfrei[dayCol]).forEach(
      ([po_dienst_id, einteilungen]) => {
        if (po_dienst_id === 'mitarbeiter_ids') return;
        const po_dienst = this.dienste[po_dienst_id];
        if (po_dienst && !po_dienste.includes(po_dienst)) {
          po_dienste.push({ po_dienst, einteilungen });
        }
      }
    );
    return po_dienste;
  }

  removeEinteilungFromDienstfrei(e) {
    e.dienstfreiKeys.forEach((tag) => {
      const mId = e.mitarbeiter_id;
      const dId = e.po_dienst_id;
      const dienstfreiTag = this.dienstfrei[tag];
      if (dienstfreiTag?.[dId]) {
        dienstfreiTag[dId] =
          dienstfreiTag?.[dId]?.filter?.((_e) => _e.id !== e.id) || [];
      }
      if (dienstfreiTag?.mitarbeiter_ids?.[mId]) {
        dienstfreiTag.mitarbeiter_ids[mId] =
          dienstfreiTag?.mitarbeiter_ids?.[mId]?.filter?.(
            (id) => id !== e.id
          ) || [];
        if (!dienstfreiTag.mitarbeiter_ids[mId].length) {
          delete dienstfreiTag.mitarbeiter_ids[mId];
        }
      }
    });
  }

  initUserSettings(data) {
    const defaultUserSettings = {
      user_id: this._user.id,
      funktion_ids: [1, 2, 3, 4],
      funktion_box: 'top',
      zoom: 1,
      bereiche: this.fillUserBereiche()
    };
    let userSettings = {};
    if (!data.user_settings) {
      userSettings = {
        ...defaultUserSettings
      };
    } else if (!data?.user_settings?.bereiche) {
      userSettings = {
        ...defaultUserSettings
      };
    } else {
      userSettings = {
        ...data.user_settings,
        bereiche: JSON.parse(data.user_settings.bereiche)
      };
    }
    return userSettings;
  }

  checkAllDienstfrei(dates = false) {
    const felder = this.felder;
    if (!this._isObject(felder)) return;
    const lastDateTime = (dates || this.verteiler_dates)?.reduce?.((last, tag) => {
          const time = new Date(tag).getTime();
          return time > last ? time : last;
        }, 0);
    for (const tag in felder) {
      const obj = felder[tag];
      if (!this._isObject(obj)) continue;
      if (lastDateTime && new Date(tag).getTime() > lastDateTime) continue;
      Object.values(obj).forEach((_felder) => {
        _felder?.forEach?.((f) => {
          f?.einteilung?.checkDienstfrei();
        });
      });
    }
  }

  checkAddEmployeesToNichtVerteilt(dates = false) {
    const felder = this.felder;
    if (!this._isObject(felder)) return;
    for (const tag in felder) {
      const obj = felder[tag];
      if ((
        !this._isObject(obj) 
        || !(dates || this.verteiler_dates)?.includes?.(tag)
      )) continue;
      Object.values(obj).forEach((_felder) => {
        _felder?.forEach?.((f) => {
          this.addEmployeeToNichtVerteilt(f);
        });
      });
    }
  }

  shouldAddEmployeeToNichtVerteilt(conflict, feld) {
    const isVerteilbar = this.isMitarbeiterVerteilbar(
      feld?.mitarbeiter,
      feld?.tag
    );
    if (isVerteilbar) return true;
    const konflikte = conflict?.konflikte?.konflikte;
    return (
      konflikte?.Fordert_Dienstgruppe_Vorher &&
      !konflikte?.Mehrfacheinteilungen?.check
    );
  }

  addEmployeeToNichtVerteilt(feld) {
    if (!this._isObject(feld)) return {};
    const conflict = feld.getStyle('mitarbeiter', false);
    if (!this.shouldAddEmployeeToNichtVerteilt(conflict, feld)) return conflict;
    const mitarbeiter = feld?.mitarbeiter;
    const tag = feld?.tag;
    if (!this.nichtVerteilte?.[tag]?.push) {
      this.nichtVerteilte[tag] = [];
    }
    if (!this.nichtVerteilte[tag].includes(mitarbeiter)) {
      this.nichtVerteilte[tag].push(mitarbeiter);
    }
    this.updateNotAllocatedEmployees();
    return conflict;
  }

  updateAfterFinishedLoading() {
    console.time('updateAfterFinishedLoading');
    this.addBedarfToBlock();
    this.einteilen();
    this.addRotationenToMitarbeiter();
    this.setNichtVerteilte(false);
    const noRelatedData = this.getNoRelatedData();
    this._page.initInfoTableModel(noRelatedData);
    this._page.einteilungsstatusAuswahl.initEinteilungsstatuse();
    this._page.einteilungsstatusAuswahl.setDienstplaene(
      this.dienstplaene.map((dp) => ({
        id: dp.id,
        plantime_anfang: dp.plantime_anfang
      }))
    );
    this._page.calendar.removeLoader();
    console.timeEnd('updateAfterFinishedLoading');
  }

  einteilen() {
    this.einteilungen._each((e) => {
      this.createFeldForEinteilung(e);
    });
    this.verteileEinteilungenFalscherBereich();
  }

  addRotationenToMitarbeiter() {
    if (!this?.rotationen) return;
    this?.dates?._each?.((date) => {
      date?.rotationenIds?.forEach?.((rId) => {
        const team = this.rotationen?.[rId]?.team;
        const mitarbeiter = this.rotationen?.[rId]?.mitarbeiter;
        if (!team?.addMitarbeiter || !mitarbeiter?.addRotationId) return;
        team.addMitarbeiter(date.id, mitarbeiter.id, rId);
        mitarbeiter.addRotationId(rId);
      });
    });
  }

  removeFromDayPoDienstEinteilungen(eId) {
    const einteilung = this.einteilungen[eId];
    const tag = einteilung.tag;
    const poId = einteilung.po_dienst_id;
    if (this.day_podienst_einteilungen[tag][poId]) {
      this.day_podienst_einteilungen[tag][poId] =
        this.day_podienst_einteilungen?.[tag]?.[poId]?.filter?.(
          (item) => item.id !== eId
        ) || [];
    }
  }

  removeFeldFromMitarbeiter(eId) {
    const einteilung = this.einteilungen[eId];
    const m = this._mitarbeiters[einteilung.mitarbeiter_id];
    m.removeEinteilung(einteilung?.feld);
  }

  addFeldToMitarbeiter(einteilung) {
    const m = this._mitarbeiters[einteilung.mitarbeiter_id];
    m.addEinteilung(einteilung?.feld);
  }

  removeFeldFromFelder(eId) {
    const einteilung = this.einteilungen[eId];
    const feld = einteilung?.feld;
    if (feld && this.felder?.[feld?.tag]?.[feld?.dienstId]) {
      this.felder[feld.tag][feld.dienstId] =
        this.felder?.[feld.tag]?.[feld.dienstId]?.filter?.((f) => f !== feld) ||
        [];
    }
  }

  removeFeldFromBedarf(eId) {
    const einteilung = this.einteilungen[eId];
    const feld = einteilung?.feld;
    if (feld) {
      feld.removeFromBedarf();
    }
  }

  resetName(fieldId) {
    this.update(`empty_${fieldId.id}_sug`, fieldId);
  }

  updateFieldsBySuffix(suf, fieldId, data = '') {
    this.update(`${suf}_${fieldId}`);
  }

  fillUserBereiche() {
    return (
      this.bereiche?.each?.((b) => ({
        bereich_id: b.bereich_id,
        po_dienst_id: b.po_dienst_id
      })) || []
    );
  }

  createFeldForEinteilung(ve) {
    const bedarf = this.getBedarf(ve.tag, ve.bereich_id, ve.po_dienst_id);
    if (bedarf?.id || !ve?.dienst?.hasBedarf) {
      ve.addFeld(bedarf?.id || 0);
    } else {
      this.einteilungen_falscher_bereich.push(ve);
    }
  }

  addToBedarfseintraegeHash(tag, id, key, key1, key2) {
    if (!this.bedarfseintraege_hash[tag][key][key1]) {
      this.bedarfseintraege_hash[tag][key][key1] = {};
    }
    if (!this.bedarfseintraege_hash[tag][key][key1][key2]) {
      this.bedarfseintraege_hash[tag][key][key1][key2] = [];
    }
    this.bedarfseintraege_hash[tag][key][key1][key2].push(id);
  }

  verteileEinteilungenFalscherBereich() {
    this._set(
      'einteilungen_falscher_bereich',
      this.einteilungen_falscher_bereich?.filter?.((e) => {
        const bereiche =
          this.bedarfseintraege_hash?.[e.tag]?.nachDienst?.[e.po_dienst_id];
        if (this._isObject(bereiche)) {
          let lastBe = false;
          // In den ersten Bedarfseintrag freien Plätzen eintragen
          for (const bereich_id in bereiche) {
            const bedarf_id = bereiche?.[bereich_id]?.[0];
            const be = this.bedarfseintraege?.[bedarf_id];
            if (!be) continue;
            lastBe = be;
            if (!be?.isFull) continue;
            e.addFeld(be?.id || 0);
            break;
          }
          // Wenn kein Bedarfseintrag frei ist, dann in den letzten eintragen
          if (!e?.feld && lastBe) {
            e.addFeld(lastBe?.id || 0);
          }
        }
        return !e?.feld;
      }) || []
    );
  }

  addBedarfToBlock() {
    this?.bedarfseintraege?._each?.((be) => {
      be.mapFirstEntry();
      if (be?.startBedarfsEintrag?.addToBlock) {
        be.startBedarfsEintrag.addToBlock(be.id);
      }
    });
  }

  resetAppData() {
    this?._appData?.resetMitarbeiter?.();
    this?._appData?.resetTeams?.();
  }

  resetDay(verteiler_dates = []) {
    this._setObject('nichtVerteilte', {});
    this._setArray('verteiler_dates', verteiler_dates);
  }

  initData(verteiler_dates = []) {
    this._setArray('dienstplaene', []);
    this._setObject('felder', {});
    this._setObject('nichtVerteilte', {});
    this._setObject('dienstfrei', {});
    this._setObject('bedarfseintraege_hash', {});
    this._setObject('day_podienst_einteilungen', {});
    this._setArray('einteilungen_falscher_bereich', []);
    this._setArray('dienstplaene_anfaenge', []);
    this._setArray('dienstplaene_ids', []);
    this.resetDay(verteiler_dates);
    this.resetAppData();
  }

  initMonatsplan(
    dienstplan,
    anfang,
    add = false,
    addFrontDateWindow = true,
    addBackDateWindow = true,
    bedarfeMap = {}
  ) {
    if (!dienstplan?.id) {
      alert(
        dienstplan?.error_msg ||
          `Dienstplan vom Monat (${anfang}) konnte nicht geladen werden.`
      );
      return;
    }
    // Dienstplan in den Cache packen
    this?._appModel?.addDienstplan?.(dienstplan);
    this.dienstplaene.push(dienstplan);
    this.dienstplaene_anfaenge.push(dienstplan.plantime_anfang);
    this.dienstplaene_ids.push(dienstplan.id);
    // Check Funktion, um nur die Tage aus dem Window-Frame (+/- 9 Tage) berücksichtigen,
    // die auch zu diesem Dienstplan gehören. Z.B. Bei laden von Juli und August im WV, dann
    // Juli - 9 Tage und August + 9 Tage
    let checkTag = () => true;
    if (!addFrontDateWindow && !addBackDateWindow) {
      checkTag = (tag) => {
        const time = new Date(tag).getTime();
        return (
          time <= new Date(dienstplan.plantime_ende).getTime() &&
          time >= new Date(dienstplan.plantime_anfang).getTime()
        );
      };
    } else if (!addFrontDateWindow) {
      checkTag = (tag) =>
        new Date(tag).getTime() >=
        new Date(dienstplan.plantime_anfang).getTime();
    } else if (!addBackDateWindow) {
      checkTag = (tag) =>
        new Date(tag).getTime() <= new Date(dienstplan.plantime_ende).getTime();
    }
    // Hier werden die Bedarfeinträge-Ids der zu berücksichtigenden Tage gespeichert
    // Damit kann man auch die Schichten entsprechend filtern
    const schichtenToAdd = {};
    if (dienstplan.bedarfs_eintraege) {
      this.initObjOrArray(
        dienstplan.bedarfs_eintraege,
        'bedarfseintraege',
        add && this.bedarfseintraege,
        (value) => {
          const tag = value?.tag;
          if(!tag) return false;
          const check = checkTag(tag);
          schichtenToAdd[value.id] = true;
          if (!check) {
            const key = `${tag}_${value?.po_dienst_id}_${value?.bereich_id}_${value?.dienstbedarf_id}`;
            bedarfeMap[key] = value;
          }
          return check;
        }
      );
    }
    if (dienstplan.dates)
      this.initObjOrArray(
        dienstplan.dates,
        'dates',
        add && this.dates,
        (value) => value?.id && checkTag(value.id)
      );
    if (dienstplan.einteilungen) {
      this.initObjOrArray(
        dienstplan.einteilungen,
        'einteilungen',
        add && this.einteilungen,
        (value) => value?.tag && checkTag(value.tag)
      );
    }
    if (dienstplan.rotationen) {
      this.initObjOrArray(
        dienstplan.rotationen,
        'rotationen',
        add && this.rotationen
      );
    }
    if (dienstplan.schichten) {
      this.initObjOrArray(
        dienstplan.schichten,
        'schichten',
        add && this.schichten,
        (value, key) => schichtenToAdd[key]
      );
    }
    if (dienstplan.wuensche) {
      this.initObjOrArray(
        dienstplan.wuensche,
        'wuensche',
        add && this.wuensche,
        (value) => value?.tag && checkTag(value.tag)
      );
    }
    if (dienstplan.bedarf) {
      this.initObjOrArray(dienstplan.bedarf, 'bedarfe', add && this.bedarf);
    }
    this.bedarfeMap = bedarfeMap;
    return bedarfeMap;
  }

  getNoRelatedData() {
    return this.einteilungen_falscher_bereich || [];
  }

  initBereiche(bereiche) {
    return new WochenverteilerBereiche(bereiche, this, this._appModel);
  }

  initCollections(collections) {
    return new VerteilerCollections(collections, this, this._appModel);
  }

  initLayout(layout) {
    return new VerteilerLayouts(layout, this, this._appModel);
  }

  updateLayout(newData) {
    this?.layouts?.updateLayout?.(newData);
  }

  addNewEinteilungIdToDates(dataEinteilung) {
    const { tag } = dataEinteilung;
    if (!this.dates[tag]) {
      console.error('Tag nicht vorhanden', tag, this.dates, this.dates[tag]);
      return;
    }
    this.dates[tag]?.addEinteilung?.(dataEinteilung);
  }

  addNewEinteilungToDayPoDienst(dataEinteilung) {
    const { tag, po_dienst_id } = dataEinteilung;
    if (!this.day_podienst_einteilungen[tag]) {
      this.day_podienst_einteilungen[tag] = {};
    }
    if (!this.day_podienst_einteilungen[tag][po_dienst_id]) {
      this.day_podienst_einteilungen[tag][po_dienst_id] = [];
    }
    this.day_podienst_einteilungen[tag][po_dienst_id].push(dataEinteilung);
  }

  addNewEinteilung(dataEinteilung) {
    const verteilerEinteilung = new VerteilerEinteilung(
      dataEinteilung,
      this._appModel
    );
    this.einteilungen._set(dataEinteilung.id, verteilerEinteilung);
    this.addNewEinteilungIdToDates(verteilerEinteilung);
    this.addNewEinteilungToDayPoDienst(verteilerEinteilung);
    this.createFeldForEinteilung(verteilerEinteilung);
    verteilerEinteilung?.updateCachedDienstplan?.();
    this.addEmployeeToNichtVerteilt(verteilerEinteilung?.feld);
    return verteilerEinteilung;
  }

  removeEinteilung(oldEinteilung) {
    const einteilung =
      this.einteilungen[oldEinteilung?.einteilungs_id || oldEinteilung?.id];
    if (!einteilung) return true;
    if (!this.dates[einteilung.tag]) {
      console.error(
        'Tag nicht vorhanden',
        einteilung.tag,
        this.dates,
        this.dates[einteilung.tag]
      );
    } else {
      this.dates[einteilung.tag]?.removeEinteilung?.(einteilung);
    }
    const dayPoDienstEinteilungen =
      this.day_podienst_einteilungen[einteilung.tag][einteilung.po_dienst_id];
    if (dayPoDienstEinteilungen?.filter) {
      this.day_podienst_einteilungen[einteilung.tag][einteilung.po_dienst_id] =
        dayPoDienstEinteilungen.filter((e) => e.id !== einteilung.id);
    }
    this.removeFeldFromMitarbeiter(oldEinteilung?.id);
    this.removeFeldFromBedarf(oldEinteilung?.id);
    this.removeEinteilungFromDienstfrei(einteilung);
    if (this.isMitarbeiterVerteilbar(einteilung?.mitarbeiter, einteilung.tag)) {
      this.addToNichtVerteilte(einteilung.id);
    }
    delete this.einteilungen[einteilung.id];
    return !!this.einteilungen?.[einteilung.id];
  }

  getAllMitarbeiterIds() {
    return Object.values(this.einteilung).map((e) => e.mitarbeiter_id);
  }

  async updateEinteilung(url, params) {
    const hains = this._hains;
    return hains.api(url, 'post', params);
  }

  getMitarbeiterForNichtVerteilte(eId) {
    const einteilung = this.einteilungen[eId];
    if (!einteilung) return;
    const tag = einteilung.tag;
    const mitarbeiter = this._mitarbeiters[einteilung.mitarbeiter_id];
    return [tag, mitarbeiter];
  }

  removeFromNichtVerteilte(eId) {
    const [tag, mitarbeiter] = this.getMitarbeiterForNichtVerteilte(eId);
    if (this.nichtVerteilte?.[tag]?.includes?.(mitarbeiter)) {
      this.nichtVerteilte[tag] =
        this.nichtVerteilte?.[tag]?.filter?.((m) => m !== mitarbeiter) || [];
    }
    this.updateNotAllocatedEmployees();
  }

  addToNichtVerteilte(eId) {
    const [tag, mitarbeiter] = this.getMitarbeiterForNichtVerteilte(eId);
    if (!this.nichtVerteilte[tag]?.includes?.(mitarbeiter)) {
      this.nichtVerteilte[tag]?.push?.(mitarbeiter);
    }
    this.updateNotAllocatedEmployees();
  }

  /**
   * Löscht die Einteilung aus den Daten
   * @param {Number|String} einteilungsId
   * @returns True, wenn Einteilung gelöscht wurde
   */
  einteilungAufhebenRemove(einteilungsId, addToNichtVerteilte = true) {
    const einteilung = this.einteilungen?.[einteilungsId];
    if (!einteilung) return true;
    this.removeFromDayPoDienstEinteilungen(einteilungsId);
    this.removeFeldFromMitarbeiter(einteilungsId);
    this.removeFeldFromFelder(einteilungsId);
    this.removeFeldFromBedarf(einteilungsId);
    this.removeEinteilungFromDienstfrei(einteilung);
    // Nur zu nicht-verteilte einfügen, wenn Mitarbeiter keine Einteilungen mehr hat
    if (addToNichtVerteilte && this.isMitarbeiterVerteilbar(einteilung?.mitarbeiter, einteilung.tag)) {
      this.addToNichtVerteilte(einteilung.id);
    }
    delete this.einteilungen[einteilungsId];
    einteilung?.updateCachedDienstplan?.();

    return !this.einteilungen?.[einteilungsId];
  }

  async einteilungAufheben(einteilungsId) {
    const params = { einteilungs_id: einteilungsId };
    const response = await this.updateEinteilung('einteilung_aufheben', params);
    if (response?.id === einteilungsId) {
      this.einteilungAufhebenRemove(einteilungsId);
      return true;
    }
    alert(response?.info || 'Aufheben nicht möglich.');

    return response;
  }

  /**
   * Erstellt eine neue Einteilung
   * @param {Object} einteilung
   * @returns Einteilung
   */
  createNewEinteilungAdd(einteilung) {
    const newEinteilung = this.addNewEinteilung(einteilung);
    this.removeFromNichtVerteilte(einteilung.id);
    return newEinteilung;
  }

  /**
   * Entfernt die alte Einteilung und erstellt eine neue Einteilung
   * @param {Object} einteilung
   */
  resetEinteilung(einteilung) {
    if (this._isObject(einteilung)) {
      const ve = new VerteilerEinteilung(einteilung, this._appModel);
      const oldEinteilung = this?.einteilungen?.[einteilung?.id];
      if (oldEinteilung) {
        this.einteilungAufhebenRemove(einteilung.id);
      }
      if (ve?.show) {
        this.createNewEinteilungAdd(einteilung);
      }
      ve?.mitarbeiter?._update?.();
    }
  }

  tagIsInDienstplaeneFrames(tag) {
    try {
      const date = tag && toDate(tag);
      if (!date) return false;
      const inDienstplaene = this.dienstplaene.find((dp) => {
        const start = toDate(dp.anfang_frame);
        const end = toDate(dp.ende_frame);
        return date >= start && date <= end;
      });
      return !!inDienstplaene;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async createNewEinteilung(data) {
    const info_comment =
      data.prevIds.length > 0
        ? this.einteilungen?.[data.einteilungs_id]?.info_comment
        : '';
    const params = { ...data, info_comment };

    const response = await this.updateEinteilung('update_einteilung', params);
    let alertMsg = '';
    if (this._isObject(response)) {
      Object.values(response).forEach((einteilung) => {
        if (einteilung?.id) {
          this.resetEinteilung(einteilung);
        } else if (einteilung?.info) {
          if (alertMsg) alertMsg += '\n';
          alertMsg += einteilung.info;
        }
      });
      if (alertMsg) {
        alert(alertMsg);
      }
      const einteilungen = Object.keys(response);
      return einteilungen.length;
    }
    return 0;
  }

  uiUpdate() {
    this.update('fullUpdate');
  }

  updateConflicts(conflicts) {
    this.conflicts = conflicts;
  }

  getPoDienstIdsTroughBedarf(bereich_id) {
    const ids = [];
    Object.values(this.bedarfseintraege_hash).forEach((obj) => {
      const poDienstObj = obj?.nachBereich?.[bereich_id];
      if (this._isObject(poDienstObj)) {
        Object.keys(poDienstObj).forEach((id) => {
          const idInt = parseInt(id, 10);
          if (!ids.includes(idInt)) {
            ids.push(idInt);
          }
        });
      }
    });
    return ids;
  }

  getEinteilung(mitarbeiter_id, po_dienst_id) {
    const einteilung = Object.values(this.einteilung).find(
      (item) =>
        item.mitarbeiter_id === mitarbeiter_id &&
        item.po_dienst_id === po_dienst_id
    );
    return einteilung;
  }

  getPoDienstByEinteilung(einteilungsId) {
    const po_dienst_id = this.einteilungen[einteilungsId].po_dienst_id;
    return this.dienste[po_dienst_id];
  }

  async roomChanged(einteilungsId, roomId) {
    const params = { einteilungsId, roomId };
    const response = await this.updateEinteilung('room_changed', params);

    if (response.status.msg === 'ok') {
      // this.addNewEinteilung(response.data);
      this.einteilungen[einteilungsId]?._set?.('arbeitsplatz_id', roomId);
      this.einteilungen[einteilungsId]?.updateCachedDienstplan?.();
    }

    return response.status;
  }

  async updateEinteilungsStatusId(eId, eStatusId) {
    const params = { id: eId, einteilungsstatus_id: eStatusId };
    const response = await this.updateEinteilung(
      'update_einteilungsstatus_id',
      params
    );
    if (response.status.msg === 'ok') {
      this.einteilungen[eId]?._set?.('einteilungsstatus_id', eStatusId);
      this.einteilungen[eId]?.updateCachedDienstplan?.();
    }
    return response;
  }

  async saveInfoComment(einteilungsId, comment) {
    const params = { einteilungs_id: einteilungsId, info_comment: comment };
    const response = await this.updateEinteilung('save_comment', params);
    if (response.status.msg === 'ok') {
      this.einteilungAufhebenRemove(einteilungsId, false);
      this.addNewEinteilung(response.data);
    }
    return response;
  }

  async updateUserSettings(userSettings, save = false, callback = () => {}) {
    if (this.user_settings.funktion_box !== userSettings.funktion_box) {
      this.update('change-grid-layout');
    }
    if (
      this.user_settings.funktion_ids.sort().join(',') !==
      userSettings.funktion_ids.sort().join(',')
    ) {
      this.updateNotAllocatedEmployees();
    }
    if (this.hasBereicheChanged(userSettings.bereiche)) {
      this.update('dateUpdate');
      this.update('content-container-height');
    }
    this.user_settings = userSettings;
    if (save) {
      const userSettingsMod = {
        ...userSettings,
        bereiche: JSON.stringify(userSettings.bereiche)
      };
      this._user?.saveDienstplanTableSettings?.(false);
      await this.updateEinteilung('update_user_settings_tv', userSettingsMod);
    }
    callback('done');
  }

  hasBereicheChanged(bereiche) {
    if (bereiche.length !== this.user_settings.bereiche.length) {
      return true;
    }
    return false;
  }
}

export default VerteilerData;
