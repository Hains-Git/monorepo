import Basic from "../basic";

/**
 * Klasse um ein PlanerDate-Objekt zu erstellen.
 * @class
 */
class PlanerDate extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setArray("bedarfeIds", obj.bedarf);
    this._setArray("bedarfseintraegeIds", obj.bedarfseintraege);
    this._setObject("by_dienst", obj.by_dienst);
    this._setObject("by_mitarbeiter", obj.by_mitarbeiter);
    this._set("celebrate", obj.celebrate);
    this._set("id", obj.id);
    this._set("date_id", obj.date_id);
    this._setInteger("day", obj.day);
    this._setInteger("day_of_year", obj.day_of_year);
    this._setObject("einteilungenIds", obj.einteilungen);
    this._set("feiertag", this._isObject(obj.feiertag) ? obj.feiertag : false);
    this._set("full_date", obj.full_date);
    this._set("is_weekend", obj.is_weekend);
    this._set("label", obj.label);
    this._set("last_week", obj.last_week);
    this._set("local_date_string", obj.local_date_string);
    this._set("month", obj.month);
    this._setInteger("month_nr", obj.month_nr);
    this._setArray("rotationenIds", obj.rotationen);
    this._set("week", obj.week);
    this._setInteger("week_counter", obj.week_counter);
    this._set("week_day", obj.week_day);
    this._setInteger("week_day_nr", obj.week_day_nr);
    this._set("weekend", obj.weekend);
    this._setArray("wuenscheIds", obj.wuensche);
    this._setInteger("year", obj.year);
    this._setArray("zeitraumkategorien", obj.zeitraumkategorien);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert den Index des Datums in _dates
   */
  get _index() {
    let i = this?._dates?._getIndex
      ? this?._dates?._getIndex(this.date_id)
      : -1;
    if (!Number.isInteger(i)) {
      i = -1;
    }
    return i;
  }

  /**
   * Gibt das erste Date-Objekt aus den Dates zurück
   */
  get isFirstDate() {
    return this._index === 0;
  }

  /**
   * Liefert das letzte Date-Objekt aus Dates
   */
  get isLastDate() {
    const i = this._index;
    const l = this?._dates?._length || 0;

    return i >= 0 && i === l - 1;
  }

  /**
   * Liefert einen String mit den Klassen wochenende und feiertag
   */
  get _className() {
    return ` ${this.weekend} ${this.celebrate}`;
  }

  /**
   * Liefert das Datum als Zahl YYYYMMDD
   */
  get _zahl() {
    return this._dateZahl(this.date_id);
  }

  /**
   * Liefert true bei einem Feiertag, ansonsten false
   */
  get isFeiertag() {
    return this._isObject(this.feiertag);
  }

  /**
   * Liefert den Namen des Feiertags
   */
  get feiertagName() {
    return this?.feiertag?.name || "";
  }

  /**
   * Liefert die Rotationen
   */
  get rotationen() {
    return this._getIdsObject("_rotationen", "rotationenIds", true);
  }

  /**
   * Liefert die Bedarfe
   */
  get bedarfe() {
    return this._getIdsObject("_bedarfe", "bedarfeIds", true);
  }

  /**
   * Liefert die Bedarfseinträge
   */
  get bedarfseintraege() {
    return this._getIdsObject("_bedarfseintraege", "bedarfseintraegeIds", true);
  }

  /**
   * Liefert die Einteilungen
   */
  get einteilungen() {
    const einteilungen = [];
    for(const dienstplanId in this.einteilungenIds) {
      const ids = this.einteilungenIds[dienstplanId];
      ids?.forEach?.((id) => {
        const einteilung = this._einteilungen?.[id];
        if (einteilung) {
          einteilungen.push(einteilung);
        }
      });
    }
    return einteilungen;
  }

  /**
   * Liefert die Wünsche
   */
  get wuensche() {
    return this._getIdsObject("_wuensche", "wuenscheIds", true);
  }

  /**
   * Liefert Informationen zum Datum
   */
  get mainInfos() {
    return {
      id: { value: this.label, label: "Datum" },
      kw: { value: this.week.toString(), label: "KW" },
      feiertag: { value: this.feiertagName || "Nein", label: "Feiertag" },
      tag: { value: this.day_of_year.toString(), label: "Tag des Jahres" },
      month: { value: this.month, label: "Monat" },
      weekCounter: { value: this.week_counter.toString(), label: "Wochenende ID" }
    };
  }

  /**
   * Liefert Informationen zum Datum
   */
  get popupInfos() {
    const {
      bedarfseintraege,
      rotationen,
      wuensche,
      einteilungen
    } = this;
    const infos = {};
    if (bedarfseintraege.length) {
      infos.Bedarfseintraege = { value: {}, label: "Bedarfseintraege", sorting: "alph-asc" };
      bedarfseintraege.forEach((b) => {
        const planname = b?.dienst?.planname || b.po_dienst_id;
        infos.Bedarfseintraege.value[b.id] = {
          ...b._info,
          label: planname,
          sort: planname
        };
      });
    }
    if (rotationen.length) {
      infos.Rotationen = { value: {}, label: "Rotationen", sorting: "asc" };
      rotationen.forEach((r) => {
        infos.Rotationen.value[r.id] = r._info;
      });
    }
    if (wuensche.length) {
      infos.Wuensche = { value: {}, label: "Wünsche", sorting: "alph-asc" };
      wuensche.forEach((w) => {
        const initialien = w?.getInitialien ? w.getInitialien() : w.id;
        const mitarbeiter = w?.mitarbeiter?.planname || w.mitarbeiter_id;
        const label = `${initialien}, ${mitarbeiter}`;
        infos.Wuensche.value[w.id] = {
          ...w._popupInfo,
          label,
          sort: label
        };
      });
    }
    if (einteilungen.length) {
      infos.Einteilungen = { value: {}, label: "Einteilungen", sorting: "alph-asc" };
      einteilungen.forEach((e) => {
        const planname = e?.dienst?.planname || e.po_dienst_id;
        const mitarbeiter = e?.mitarbeiter?.planname || e.mitarbeiter_id;
        const label = `${planname}, ${mitarbeiter}`;
        infos.Einteilungen.value[e.id] = {
          ...e._feldInfo,
          label,
          sort: label
        };
      });
    }

    return infos;
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _info() {
    return {
      mainInfos: this.mainInfos,
      popupInfos: this.popupInfos
    };
  }

  /**
   * Liefert ein Objekt als PopUpInfos Anhang
   */
  get _feldInfo() {
    return {
      value: {
        ...this.mainInfos,
        ...this.popupInfos
      },
      label: "Tag"
    };
  }

  addWunschIdToMitarbeiterEl(id, mitarbeiterId) {
    const byMitarbeiter = this.getMitarbeiterEl(mitarbeiterId);
    if(byMitarbeiter?._setInteger) {
      byMitarbeiter._setInteger("wunsch_id", id);
    } else if(byMitarbeiter) {
      byMitarbeiter.wunsch_id = id;
    }
  }

  addWunsch(wunsch) {
    const id = wunsch?.id || 0;
    if(!id || !wunsch) return;
    this?._wuensche?._set(id, wunsch);
    if(!this.wuenscheIds.includes(id)) this.wuenscheIds.push(id);
    this.addWunschIdToMitarbeiterEl(id, wunsch?.mitarbeiter_id || 0);
    const dienstkategorie = wunsch?.dienstkategorie;
    if(!dienstkategorie) return;
    dienstkategorie?.dienste_ids?.forEach?.((dienstId) => {
      const wunschIds = this.getDienstEl(dienstId)?.wunsch_ids;
      if(this._isArray(wunschIds) && !wunschIds.includes(id)) wunschIds.push(id);
    });
  }

  removeWunsch(wunsch) {
    const id = wunsch?.id || 0;
    if(!id || !wunsch) return;
    if(this?._wuensche?.[id]) delete this._wuensche[id];
    const i = this.wuenscheIds.indexOf(id);
    if(i >= 0) this.wuenscheIds.splice(i, 1);
    this.addWunschIdToMitarbeiterEl(0, wunsch?.mitarbeiter_id || 0);
    const dienstkategorie = wunsch?.dienstkategorie;
    if(!dienstkategorie) return;
    dienstkategorie?.dienste_ids?.forEach?.((dienstId) => {
      const wunschIds = this.getDienstEl(dienstId)?.wunsch_ids;
      const j = this._isArray(wunschIds) ? wunschIds.indexOf(id) : -1;
      if(j >= 0) wunschIds.splice(j, 1);
    });
  }

  /**
   * @param {Object} rotation
   * @returns true, wenn dateZahl im Zeitraum der Rotation liegt
   */
  isInRotationTimeInterval(rotation) {
    const dateZahl = this._zahl;
    if (!rotation?.vonZahl || !dateZahl) return false;
    return (rotation?.vonZahl || 0) <= dateZahl && (rotation?.bisZahl || 0) >= dateZahl;
  }

  /**
   * Führt ein update der Rotationen durch
   * @param {Object} rotation
   * @param {Boolean} add
   */
  updateRotation(rotation, add = true) {
    const rId = rotation?.id;
    if (!rId) return;
    if (add) {
      this.addRotation(rotation);
    } else {
      this.removeRotation(rotation);
    }
  }

  /**
   * Entfernt die Rotation-Id aus der Liste
   * @param {Obejct} rotation
   */
  removeRotation(rotation) {
    const rId = rotation?.id;
    if (!rId) return;
    const i = this.rotationenIds.indexOf(rId);
    if (i >= 0) {
      this.rotationenIds.splice(i, 1);
    }
  }

  /**
   * Fügt die Rotation-Id der Liste hinzu
   * @param {Object} rotation
   */
  addRotation(rotation) {
    const rId = rotation?.id;
    if (!rId) return;
    if (this.isInRotationTimeInterval(rotation)) {
      if (!this.rotationenIds.includes(rId)) {
        this.rotationenIds.push(rId);
      }
    }
  }

  /**
   * Führt ein Update der Einteilung-Ids durch
   * @param {Object} einteilung
   * @param {boolean} add
   */
  updateEinteilungen(einteilung, add = true) {
    const eId = einteilung?.id;
    if (!eId) return;
    if (add) {
      this.addEinteilung(einteilung);
    } else {
      this.removeEinteilung(einteilung);
    }
  }

  /**
   * Entfernt die Einteilung-Id aus der Liste
   * @param {Obejct} einteilung
   */
  removeEinteilung(einteilung) {
    const id = einteilung?.id;
    if (!id) return;
    for(const dienstplanId in this.einteilungenIds) {
      this.einteilungenIds[dienstplanId] = this.einteilungenIds[dienstplanId]?.filter?.((eId) => eId !== id) || [];
    }
  }

  /**
   * Fügt die Einteilung-Id der Liste hinzu
   * @param {Object} einteilung
   */
  addEinteilung(einteilung) {
    const id = einteilung?.show && einteilung?.id;
    const dienstplanId = einteilung?.dienstplan_id;
    if (!id) return;
    if(!this.einteilungenIds[dienstplanId]) this.einteilungenIds[dienstplanId] = [];
    if (!this.einteilungenIds[dienstplanId].includes(id)) {
      this.einteilungenIds[dienstplanId].push(id);
    }
  }

  /**
   * Liefert die min und opt Bedarfe der Teams
   * @param {String} defaultName
   * @returns Object
   */
  getTeamBedarfe(defaultName = "Kein Team") {
    const result = {};
    this.eachDienst((dienst) => {
      if (dienst?.hasBedarfAm?.(this.id)) {
        const team = dienst?.team;
        const teamName = team?.name;
        if (!result[teamName]) {
          result[teamName] = team?.defaultBedarf || {
            Bedarf: 0,
            Min: 0,
            Opt: 0,
            Einteilung: 0,
            Krank: 0,
            Urlaub: 0,
            Sonstig: 0,
            Verfuegbar: 0,
            ID: 0,
            label: defaultName
          };
        }
        result[teamName].Bedarf += this.countUnbesetzt(dienst?.id);
        const bedarfe = dienst.getBedarfAm(this.id);
        bedarfe?.forEach?.((b) => {
          if (b) {
            result[teamName].Min += b.min;
            result[teamName].Opt += b.opt;
          }
        });
      }
    }, false);
    return result;
  }

  /**
   * Iteriert durch alle Dienste.
   * @param {Function} callback
   * @param {Boolean} sort
   * @returns Array
   */
  eachDienst(callback = false, sort = false) {
    const dienste = [];
    const diensteObj = this?._dienste || this._po_dienste;
    diensteObj?._each?.((dienst) => {
      if (sort) {
        dienste.push(dienst);
      } else {
        dienste.push(this._isFunction(callback) ? callback(dienst) : dienst);
      }
    });
    if (sort) {
      dienste.sort((a, b) => a.dienst.order - b.dienst.order);
      dienste.forEach((dienst) => (this._isFunction(callback)
        ? callback(dienst)
        : callback(dienst)));
    }
    return dienste;
  }

  /**
   * Zählt die unbesetzten Felder.
   * @param {Number} dienstId
   * @returns number
   */
  countUnbesetzt(dienstId = 0) {
    return 0;
  }

  /**
   * Zählt die besetzten Felder
   * @param {Number} dienstId
   * @returns number
   */
  countBesetzt(dienstId = 0) {
    return 0;
  }

  /**
   * Iteriert über alle By-Mitarbeiter
   * @param {Function} callback 
   */
  eachByMitarbeiter(callback = false) {
    if (this._isFunction(callback) && this._isObject(this.by_mitarbeiter)) {
      for (const mitarbeiterId in this.by_mitarbeiter) {
        callback(this.by_mitarbeiter[mitarbeiterId], mitarbeiterId);
      }
    }
  }

  /**
   * Iteriert über alle By-Dienst
   * @param {Function} callback
  */
  eachByDienst(callback = false) {
    if (this._isFunction(callback) && this._isObject(this.by_dienst)) {
      for (const dienstId in this.by_dienst) {
        callback(this.by_dienst[dienstId], dienstId);
      }
    }
  }

  /**
   * Liefert das entsprechende by_mitarbeiter-Element
   * @param {Number} mitarbeiterId
   * @returns object
   */
  getMitarbeiterEl(mitarbeiterId = 0) {
    return this?.by_mitarbeiter?.[mitarbeiterId] || false;
  }

  /**
   * Gibt das entsprechende Element aus by_dienst zurück
   * @param {Number} dienstId
   * @returns object
   */
  getDienstEl(dienstId) {
    return this?.by_dienst?.[dienstId] || false;
  }

  /**
   * @param {Number} zeitraumkategorieId 
   * @returns True, wenn das Datum in der Zeitrakategorie liegt
   */
  isInZeitraumkategorie(zeitraumkategorieId = 0) {
    return !!this.zeitraumkategorien?.includes?.(zeitraumkategorieId);
  }
}

export default PlanerDate;
