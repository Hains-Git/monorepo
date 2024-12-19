import {
  createSearchGroup,
  setPageWarning,
  isInFilter
} from '../../tools/helper';
import InfoTab from './info-tab';
import { returnError } from '../../tools/hains';

class EinteilungsstatusAuswahl extends InfoTab {
  constructor(appModel = false, preventExtension = false) {
    super(appModel);
    this.setInfoTitle('Einteilungen nach Status');
    this.setEinteilungsstatusId(0, 0);
    this.setEinteilungen();
    this.setDienstplaene();
    this.setMainSearchValue();
    this._setObject('searchGroups', {
      dienste: createSearchGroup(this, 'dienste'),
      mitarbeiter: createSearchGroup(this, 'mitarbeiter'),
      dates: createSearchGroup(this, 'dates'),
      kws: createSearchGroup(this, 'kws'),
      funktionen: createSearchGroup(this, 'funktionen'),
      mitarbeiterTeam: createSearchGroup(this, 'mitarbeiterTeam'),
      dienstTeam: createSearchGroup(this, 'dienstTeam')
    });
    this.setInfoFkt(false);
    this._setArray('einteilungsstatuse', []);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert den Einteilungsstatus zu der Einteilungsstatus ID
   */
  get einteilungsstatus() {
    return this._getIdsObject(
      '_einteilungsstatuse',
      'einteilungsstatus_id',
      true
    );
  }

  /**
   * Liefert die Einteilungsstatus-Abkürzung
   * @returns {String} Statusletter vom Einteilungsstatus || NA: not available
   */
  get statusLetter() {
    return this.einteilungsstatus?.statusLetter || 'NA';
  }

  /**
   * Setzt den Wert für die Haupt-Suche
   * @param {String} value
   */
  setMainSearchValue(value = '') {
    this._set('mainSearchValue', value);
  }

  /**
   * Sortiert die Einteilungen nach Gruppen
   * @param {Object} einteilungen
   */
  setEinteilungen(
    einteilungen = {
      mehrfacheEnteilungenKeys: {}
    }
  ) {
    this._setObject('einteilungen', einteilungen);
  }

  /**
   * Setzt ein Array mit Dienstplan-Ids und sortiert die Dienstpläne absteigend nach Anfangsdatum.
   * Sortierung ist wichtig, damit die Einteilungen zum richtigen Dienstplan
   * zugeordnet werden können.
   * @param {Array} plaene
   */
  setDienstplaene(plaene = []) {
    this._setArray('dienstplaene', plaene);
    // Sortiere Dienstpläne absteigend nach Anfangsdatum
    this.dienstplaene.sort(
      (a, b) =>
        this._dateZahl(b.plantime_anfang) - this._dateZahl(a.plantime_anfang)
    );
  }

  /**
   * Initialisiert die Auswahl der Einteilungsstatuse
   */
  initEinteilungsstatuse() {
    if (!this.einteilungsstatuse?.length) {
      this?._einteilungsstatuse?._each?.((e) => {
        if (!e.waehlbar) return false;
        const l = this.einteilungsstatuse.length;
        if (!this.einteilungsstatus_id) this.setEinteilungsstatusId(e.id, l);
        this.einteilungsstatuse.push({
          id: e.id,
          name: `${e.name} (${e.statusLetter})`,
          index: l,
          fkt: () => {
            this.setEinteilungsstatusId(e.id, l);
          },
          title: '',
          einteilungsstatus: e
        });
      });
      // Default-Status ist Counts
      const countsStatus = this.einteilungsstatuse.find(
        (e) =>
          !e?.einteilungsstatus?.vorschlag &&
          e?.einteilungsstatus?.counts &&
          !e?.einteilungsstatus?.public
      );
      countsStatus?.fkt?.();
    }
  }

  /**
   * Setzt das Einteilungsstatus Attributs
   * @param {Number} status
   */
  setEinteilungsstatusId(status, start = 0) {
    this._setInteger('einteilungsstatus_id', status);
    this._setInteger('einteilungsstatusStart', start);
    this._update();
  }

  /**
   * @param {Object} e
   * @returns True, wenn die Einteilung zum Filter passt
   */
  isInFilter(e) {
    return isInFilter(e, this.mainSearchValue, this.searchGroups);
  }

  /**
   * Filtert die Einteilungen nach bestimmten Bedingungen.
   * Wird in den Kind-Klassen überschrieben.
   * @param {Object} e
   * @returns True, wenn die Einteilung berücksichtigt werden soll
   */
  showEinteilung(e) {
    return true;
  }

  sorteinteilungen(a, b) {
    const date = a.date._zahl - b.date._zahl;
    if (date !== 0) return date;
    const dienst = a.dienst.planname.localeCompare(b.dienst.planname);
    if (dienst !== 0) return dienst;
    const mitarbeiter = a.mitarbeiter.planname.localeCompare(
      b.mitarbeiter.planname
    );
    return mitarbeiter;
  }

  createEinteilungenBase(status, es_id) {
    const obj = {
      show: false,
      hide: [],
      einteilungen: [],
      mehrfacheEnteilungen: {
        hide: [],
        einteilungen: []
      },
      notWritable: {
        einteilungen: [],
        hide: [],
        mehrfacheEnteilungen: {
          hide: [],
          einteilungen: []
        }
      },
      einteilungsstatus: status,
      id: `${es_id}-einteilungsstatus-auswahl-status`
    };
    return obj;
  }

  /**
   * Einteilungen nach Einteilungsstatus gruppieren
   * @returns {Object}
   */
  groupEinteilungen() {
    const result = {
      mehrfacheEnteilungenKeys: {}
    };
    const mehrfacheEnteilungen = result.mehrfacheEnteilungenKeys;
    this?._einteilungen?._each?.((e) => {
      const es_id = e?.einteilungsstatus_id;
      const status = e?.einteilungsstatus;
      const checkMehrfacheEinteilungKey = e?.checkMehrfacheEinteilungKey;
      const key = this.isInFilter(e) ? 'einteilungen' : 'hide';
      if (!result[es_id]) {
        result[es_id] = this.createEinteilungenBase(status, es_id);
        result[es_id].show = !!this?.einteilungen?.[es_id]?.show;
      }
      
      const show = this.showEinteilung(e);
      const base = show ? result[es_id] : result[es_id].notWritable;
      base[key].push(e);
      if(mehrfacheEnteilungen[checkMehrfacheEinteilungKey]) {
        if(!mehrfacheEnteilungen[checkMehrfacheEinteilungKey]?.isDouble) {
          const obj = mehrfacheEnteilungen[checkMehrfacheEinteilungKey];
          const es_id_key = obj.einteilung?.einteilungsstatus_id;
          const _base = obj.show ? result[es_id_key] : result[es_id_key].notWritable;
          _base.mehrfacheEnteilungen[obj.key].push(obj.einteilung);
          mehrfacheEnteilungen[checkMehrfacheEinteilungKey].isDouble = true;
        }
        base.mehrfacheEnteilungen[key].push(e);
      } else {
        mehrfacheEnteilungen[checkMehrfacheEinteilungKey] = {einteilung: e, key, isDouble: false, show};
      }
      return false;
    });

    const ignore = ['mehrfacheEnteilungenKeys'];
    for (const key in result) {
      if (ignore.includes(key)) continue;
      result[key].einteilungen.sort(this.sorteinteilungen);
      result[key].mehrfacheEnteilungen.einteilungen.sort(this.sorteinteilungen);
    }
    this.setEinteilungen(result);
    return this.einteilungen;
  }

  /**
   * Wird ausgeführt,nachdem der Einteilungsstatus von Einteilungen verändert wurde
   * @param {Object} res
   */
  statusChangeCallback(res) {
    if (this._isObject(res)) {
      const hasInfo = Object.keys(res).findIndex((key) => key !== 'info') >= 0;
      if (hasInfo) {
        for (const dplId in res) {
          const einteilungen = res[dplId];
          if (!this._isArray(einteilungen)) continue;
          einteilungen.forEach((e) => {
            const einteilung =
              e?.einteilungsstatus_id && this._einteilungen[e.id];
            if (!einteilung?.setEinteilungsstatusId) return;
            einteilung.updateStatus(e.einteilungsstatus_id, e.dienstplan_id);
          });
        }
        this._update();
      } else {
        setPageWarning(
          res?.info || 'Einteilunsstatus konnte nicht aktualisiert werden.'
        );
      }
    }
  }

  /**
   * Veröffentlicht die Einteilungen
   * @param {Array} einteilungen
   * @param {Boolean} all
   */
  publish(parent, all = false, setLoading = false) {
    if (this?._hains?.api) {
      const einteilungen_ids = {};
      const dienstplaene = [];
      this.dienstplaene.forEach((dpl) => {
        einteilungen_ids[dpl.id] = {
          dienstplan: dpl,
          einteilungen: []
        };
        dienstplaene.push(dpl);
      });
      const addEinteilungId = (e) => {
        if (!e?.id) return;
        if (einteilungen_ids?.[e?.dienstplan_id]?.einteilungen) {
          einteilungen_ids[e.dienstplan_id].einteilungen.push(e.id);
        } else {
          const dpl = this.dienstplaene.find(
            (d) => (e?.date?._zahl || 0) >= this._dateZahl(d.plantime_anfang)
          );
          einteilungen_ids?.[dpl?.id]?.einteilungen?.push?.(e.id);
        }
      };
      parent?.einteilungen?.forEach?.(addEinteilungId);
      all && parent?.hide?.forEach?.(addEinteilungId);
      this._hains
        .api('update_einteilungen_status', 'post', {
          einteilungsstatus_id: this.einteilungsstatus_id,
          einteilungen_ids
        })
        .then(
          (res) => {
            this.statusChangeCallback(res);
            setLoading?.(false);
          },
          (res) => {
            returnError(res);
            setLoading?.(false);
          }
        );
    }
  }

  /**
   * Wird ausgeführt, nachdem eine Einteilung aufehoben wurde
   * @param {Object} res
   * @param {Function} callback
   */
  removeCallback(res, callback = false) {
    const info = [];
    const callbackFkt = this._isFunction(callback) ? callback : () => {};
    const einteilungen = this._isArray(res) ? res : [res];
    let update = false;
    einteilungen.forEach((e) => {
      if(e?.id) {
        const einteilung = this._einteilungen[e.id];
        einteilung?.updateStatus?.(e.einteilungsstatus_id, e.dienstplan_id);
        callbackFkt(e);
        update = true;
      } else if(e?.info) {
        info.push(e.info);
      } else {
        info.push(`Es gab Probleme mit einer Einteilung.`);
      }
    });
    update && this._update();
    if(info.length) {
      setPageWarning(info.join('\n'));
    }
  }

  /**
   * Hebt eine Einteilung auf
   * @param {Array} einteilungen
   * @param {Function} setLoading
   */
  remove(einteilungen, setLoading = false) {
    this?._hains?.api?.('einteilung_aufheben', 'post', {
      einteilungs_id: einteilungen.map((e) => e.id)
    }).then((res) => {
      this.removeCallback(res);
      setLoading?.(false);
    }, (err) => {
      returnError(err);
      setLoading?.(false);
    });
  }

  /**
   * Veröffentlicht alle nicht veröffentlichten Einteilungen
   */
  publishAll(setLoading) {
    const parent = {
      einteilungen: [],
      hide: []
    };
    for (const key in this.einteilungen) {
      const obj = this.einteilungen[key];
      const isCurrentStatus =
        obj?.einteilungsstatus_id === this.einteilungsstatus_id;
      if (isCurrentStatus) continue;
      if (this._isArray(obj?.einteilungen)) {
        parent.einteilungen = parent.einteilungen.concat(obj.einteilungen);
      }
      if (this._isArray(obj?.hide)) {
        parent.einteilungen = parent.einteilungen.concat(obj.hide);
      }
    }
    this.publish(parent, true, setLoading);
  }

  /**
   * Veröffentlicht alle gefilterten nicht veröffentlichten Einteilungen
   */
  publishAllVisible(setLoading) {
    const parent = {
      einteilungen: []
    };
    for (const key in this.einteilungen) {
      const obj = this.einteilungen[key];
      const isCurrentStatus =
        obj?.einteilungsstatus_id === this.einteilungsstatus_id;
      if (this._isArray(obj?.einteilungen) && !isCurrentStatus) {
        parent.einteilungen = parent.einteilungen.concat(obj.einteilungen);
      }
    }
    this.publish(parent, false, setLoading);
  }

  /**
   * Checkt alle Filter
   */
  checkAll() {
    this.filterGroups.forEach((group) => {
      group.checkAll();
    });
  }

  /**
   * Triggert das filtern der Einteilungen
   * @param {String} mainSearchValue
   */
  search = (mainSearchValue) => {
    this.setMainSearchValue(mainSearchValue);
    this._update();
  };
}

export default EinteilungsstatusAuswahl;
