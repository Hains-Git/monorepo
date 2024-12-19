import Basic from '../basic';

/**
 * Klasse um ein Dienst-Objekt zu erstellen.
 * Dienst entspricht PoDienst aus der API.
 * @class
 */
class Dienst extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set('aneasy_name', obj.aneasy_name);
    this._set('aufwand', obj.aufwand);
    this._set('beschreibung', obj.beschreibung);
    this._set('color', obj.color);
    this._setArray('freigabetypen_ids', obj.freigabetypen_ids);
    this._setInteger('id', obj.id);
    this._setInteger('order', obj.order);
    this._set('name', obj.name);
    this._set('planname', obj.planname);
    this._set('converted_planname', obj.converted_planname);
    this._set('preset', obj.preset);
    this._set('sys', obj.sys);
    this._setArray('thema_ids', obj.thema_ids);
    this._setInteger('team_id', obj.team_id);
    this._setInteger('kostenstelle_id', obj.kostenstelle_id);
    this._set('priorisiere_wunsch', obj.priorisiere_wunsch);
    this._set('frei_eintragbar', obj.frei_eintragbar);
    this._set(
      'defaultStd',
      obj.stundennachweis_default_std
        ? parseFloat(obj.stundennachweis_default_std)
        : 0.0
    );
    this._set('stundennachweis_urlaub', obj.stundennachweis_urlaub);
    this._set('stundennachweis_krank', obj.stundennachweis_krank);
    this._set('stundennachweis_sonstig', obj.stundennachweis_sonstig);
    this._set('use_tagessaldo', obj.use_tagessaldo);
    this._set('ignore_before', obj.ignore_before);
    this._set('oberarzt', obj.oberarzt);
    this._set('dpl_all_teams', obj.dpl_all_teams);
    this._setArray(
      'rating_ids',
      obj?.dienstratings ? obj?.dienstratings : obj.rating_ids
    );
    this._setArray(
      'bedarf_ids',
      obj?.dienstbedarves ? obj?.dienstbedarves : obj.bedarf_ids
    );
    this._set('weak_parallel_conflict', !!obj.weak_parallel_conflict);
    this.resetAttributes(obj);
    this.setCustomColor();
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert die Kostenstelle des Dienstes
   */
  get kostenstelle() {
    return this._getIdsObject('_kostenstellen', 'kostenstelle_id', true);
  }

  /**
   * Testet, ob es zu diesem Dienst einen Bedarf gibt
   */
  get hasBedarf() {
    const l = this?.bedarf_ids?.length;
    return l ? l > 0 : false;
  }

  /**
   * Nur Dienste mit dem Flag frei_eintragbar und keinem Bedarf gelten als freiEintragbar
   */
  get isFreiEintragbar() {
    return this.frei_eintragbar && !this.hasBedraf;
  }

  /**
   * Liefert die Anzahl an erforderlichen Freigaben
   */
  get countFreigaben() {
    return this?.freigabetypen_ids?.length || 0;
  }

  /**
   * Liefert das zugehörige Team
   */
  get team() {
    return this._getIdsObject('_teams', 'team_id', true);
  }

  /**
   * Liefert die Bedarfe
   */
  get bedarfe() {
    return this._getIdsObject('_bedarfe', 'bedarf_ids', true);
  }

  /**
   * Liefert die Freigabe-Typen
   */
  get freigabeTypen() {
    return this._getIdsObject('_freigabetypen', 'freigabetypen_ids', true);
  }

  /**
   * Liefert die Ratings
   */
  get ratings() {
    return this._getIdsObject('_ratings', 'rating_ids', true);
  }

  /**
   * Liefert die Themen
   */
  get themen() {
    return this._getIdsObject('_themen', 'thema_ids', true);
  }

  /**
   * Liefert "Keins", falls Dienst zu keinem Team gehört.
   * Ansonsten wird der Name des Teams zurückgegeben
   */
  get teamName() {
    return this?.team?.name || 'Keins';
  }

  /**
   * Liefert Informationen zum Dienst
   */
  get mainInfos() {
    const mainInfos = {
      id: { value: this.id.toString(), label: 'ID' },
      dienst: { value: this.planname, label: 'Planname' },
      team: { value: this.teamName, label: 'Team' },
      name: { value: this.name, label: 'Name' },
      order: { value: this.order.toString(), label: 'Position' }
    };
    if (this.aufwand) {
      mainInfos.aufwand = { value: this.aufwand.toString(), label: 'Aufwand' };
    }
    if (this.priorisiere_wunsch) {
      mainInfos.prioWunsch = { value: '', label: 'Wunsch wird priorisiert.' };
    }
    if (this.dpl_all_teams) {
      mainInfos.dplAllTeams = { value: '', label: 'Für alle Teams.' };
    }
    if (this.use_tagessaldo) {
      mainInfos.useTagessaldo = { value: '', label: 'Tagessaldo verwenden.' };
    }
    if (this.ignore_before) {
      mainInfos.ignoreBefore = {
        value: '',
        label:
          'Konflikt wird bei Überschneidung mit vorhergehenden Tagen ignoriert.'
      };
    }
    return mainInfos;
  }

  /**
   * Liefert weitere Informationen zur Dienst
   */
  get popupInfos() {
    const infos = {};
    if (this.beschreibung && this.beschreibung.trim() !== '') {
      infos.Beschreibung = {
        value: {
          beschreibung: { value: '', label: this.beschreibung || '' }
        },
        label: 'Beschreibung'
      };
    }
    const { bedarfe, freigabeTypen, themen, ratings } = this;
    if (bedarfe.length) {
      infos.Dienstbedarfe = {
        value: {},
        label: 'Dienstbedarfe',
        sorting: 'asc'
      };
      bedarfe.forEach((b) => {
        infos.Dienstbedarfe.value[b.id] = {
          value: b._info,
          label: b.id,
          sort: b.id
        };
      });
    }
    if (freigabeTypen.length) {
      infos.Freigaben = { value: {}, label: 'Freigaben', sorting: 'alph-asc' };
      freigabeTypen.forEach((f) => {
        infos.Freigaben.value[f.id] = f._info;
      });
    }
    if (themen.length) {
      infos.Themen = { value: {}, label: 'Themen', sorting: 'alph-asc' };
      themen.forEach((t) => {
        infos.Themen.value[t.id] = t._info;
      });
    }
    if (ratings.length) {
      infos.Ratings = { value: {}, label: 'Bewertungen', sorting: 'asc' };
      ratings.forEach((r) => {
        infos.Ratings.value[r.id] = r._infoDienst;
      });
    }
    return infos;
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
      label: 'Dienst'
    };
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
   * Zurücksetzen einiger Attribute
   */
  resetAttributes({ idsQualifizierterMitarbeiter = [] } = {}) {
    this._setArray(
      'idsQualifizierterMitarbeiter',
      idsQualifizierterMitarbeiter
    );
  }

  /**
   * Testet, ob alle nötigen Freigaben in freigabetypenIds enthalten sind
   * @param {Array} freigabetypenIds
   * @returns True, wenn Mitarbeiter für alle Freigaben qualifiziert ist
   */
  includesFreigabetypenIds(freigabetypenIds) {
    let same = false;
    if (this._isArray(freigabetypenIds)) {
      const l = this.freigabetypen_ids.length;
      same = l === 0;
      for (let i = 0; i < l && l <= freigabetypenIds.length; i++) {
        same = freigabetypenIds.includes(this.freigabetypen_ids[i]);
        if (!same) break;
      }
    }
    return same;
  }

  /**
   * Fügt die Mitarbeiter-Id hinzu, wenn Mitarbeiter qualifiziert sind
   * @param {Object} mitarbeiter
   * @returns Array mit allen qualifizierten Mitarbeiter-IDs
   */
  addQualifizierteMitarbeiter(mitarbeiter) {
    const { id, freigabetypen_ids } = mitarbeiter;
    if (
      !this.idsQualifizierterMitarbeiter.includes(id) &&
      this.includesFreigabetypenIds(freigabetypen_ids)
    ) {
      this.idsQualifizierterMitarbeiter.push(id);
      if (mitarbeiter?.addToFreigegebeneDienste) {
        mitarbeiter.addToFreigegebeneDienste(this.id);
      }
      return this.idsQualifizierterMitarbeiter;
    }
    return false;
  }

  /**
   * Entfernt einen Mitarbeiter aus Qualifizierten Mitarbeitern
   * @param {Object} mitarbeiter
   * @returns Array mit allen qualifizierten Mitarbeiter-IDs
   */
  removeQualifizierteMitarbeiter(mitarbeiter) {
    const { id, freigabetypen_ids } = mitarbeiter;
    const index = this.idsQualifizierterMitarbeiter.indexOf(id);
    if (index >= 0 && !this.includesFreigabetypenIds(freigabetypen_ids)) {
      this.idsQualifizierterMitarbeiter.splice(index, 1);
      if (mitarbeiter?.removeFromFreigegebeneDienste) {
        mitarbeiter.removeFromFreigegebeneDienste(this.id);
      }
      return this.idsQualifizierterMitarbeiter;
    }
    return false;
  }

  /**
   * Setzt die Custom-Color des Dienstes. Dies entspricht einer benutzerdefinierten
   * Farbe für den Dienstplan
   * @param {String} color
   */
  setCustomColor(color = false) {
    if (typeof color !== 'string' && color !== false) {
      console.log('Es werden nur Strings oder false akzeptiert!');
      return;
    }
    this._set('customColor', color || this.color);
  }

  /**
   * Liefert die benutzerdefinierte Farbe
   * @returns {string} Benutzerdefinierte Farbe
   */
  getColor() {
    return this.customColor;
  }

  /**
   * Testet, ob der Dienst zum gegebenen Tag einen Bedarf hat.
   * @param {String} dateId
   * @returns {Boolean} True, wenn ein Bedarf existiert
   */
  hasBedarfAm(dateId) {
    const bedarfe = this.getBedarfAm(dateId);
    return bedarfe.length > 0;
  }

  /**
   * liefert alle Bedarfseinträge zu einem gegebenen Tag.
   * @param {String} dateId
   * @returns {Array} Array mit Bedarfseinträgen
   */
  getBedarfAm(dateId) {
    const bedarfe = [];
    this?._bedarfseintraege?._each?.((b) => {
      if (b.po_dienst_id === this.id && b.tag === dateId) bedarfe.push(b);
    });
    return bedarfe;
  }

  /**
   * Erstellt die Informationen zu dem Dienst
   */
  setInfo(evt, cleanup = true) {
    this._setPageInfoPopup(`Dienst: ${this.planname}`, this, cleanup);
  }

  /**
   * @param {Number} themaId
   * @returns {Boolean} true, wenn in thema_ids enthalten
   */
  hasThemaId(themaId) {
    return !!this.thema_ids?.includes?.(themaId);
  }
}

export default Dienst;
