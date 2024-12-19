import {
  abwesendClass,
  freigabenClasses,
  possibleConflict,
  seriousConflict,
  sonderstatusClass
} from '../../styles/basic';
import { development } from '../../tools/flags';
import {
  cleanInactiveName,
  getPrioRotationHelper,
  numericLocaleCompare
} from '../../tools/helper';
import Basic from '../basic';

/**
 * Klasse um ein Kostenstelle-Objekt zu erstellen.
 * Mitarbeiter können verschiedenen Diensten und Tagen zugeordnet werden
 * und entsprechen unserer Mitarbeitern aus der API.
 * Die Funktionen des Mitarbeiters wurden in seine einzelenen Klassen aufgeteitl,
 * welche sich gegenseitig erweitern.
 * In dieser Klasse sollen idealerweise nur Attribute und getter erscheinen
 * @class
 */
class Mitarbeiter extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);

    this._set('a_seit', obj.a_seit);
    this._set('abwesend', obj.abwesend);
    // Mitarbeiter ohne accountInfo sind nicht aktiv
    this._set(
      'aktiv',
      !!(
        (obj.accountInfo || obj?.account_infos?.[0]) &&
        !obj.platzhalter &&
        obj.aktiv
      )
    );
    this._set('aktiv_bis', obj.aktiv_bis);
    this._setInteger('id', obj.id);
    this._set('aktiv_von', obj.aktiv_von);
    this._set('anrechenbare_zeit', obj.anrechenbare_zeit);
    this._set('name', obj.name);
    this._setInteger('funktion_id', obj.funktion_id);
    this._set('pass_count', obj.pass_count);
    this._set('personalnummer', obj.personalnummer);
    this._set('planname', obj.planname);
    this._set('platzhalter', !!obj.platzhalter);
    this._set('zeit_kommentar', obj.zeit_kommentar);
    this._set(
      'accountInfo',
      obj?.account_infos ? obj?.account_infos?.[0] : obj.accountInfo
    );
    this._setArray(
      'rating_ids',
      obj?.dienstratings ? obj?.dienstratings : obj.rating_ids
    );
    this._setArray(
      'freigaben_ids',
      obj?.dienstfreigabes ? obj?.dienstfreigabes : obj.freigaben_ids
    );
    this._setArray('freigabetypen_ids', obj.freigabetypen_ids);
    this._setArray(
      'vertrag_ids',
      obj?.vertrags ? obj?.vertrags : obj.vertrag_ids
    );
    this._setArray('vertragphasen_ids', obj.vertragphasen_ids);
    this._setArray('vertrags_arbeitszeits_ids', obj.vertrags_arbeitszeits_ids);
    this._setObject('dienst_id_rating_id', obj?.dienst_id_rating_id || {});
    this.setIdsFreigegebenerDienste(obj?.idsFreigegebenerDienste || []);
    this.resetAttributes();
    if (preventExtension) this._preventExtension();
  }

  /**
   * Ersetzt das OLD/bis Datum im plannamen durch (X)
   */
  get cleanedPlanname() {
    return this.aktiv ? this.planname : cleanInactiveName(this.planname);
  }

  /**
   * Liefert die Funktion der Mitarbeiter
   */
  get funktion() {
    return this._getIdsObject('_funktionen', 'funktion_id', true);
  }

  /**
   * Liefert die Ratings
   */
  get ratings() {
    return this._getIdsObject('_ratings', 'rating_ids', true);
  }

  /**
   * Liefert die Freigaben
   */
  get freigaben() {
    return this._getIdsObject('_freigaben', 'freigaben_ids', true);
  }

  /**
   * Liefert die Rotationen
   */
  get rotationen() {
    return this._getIdsObject('_rotationen', 'rotationenIds', true);
  }

  /**
   * Leifert die Vertragsphasen
   */
  get vertragsphasen() {
    return this._getIdsObject('_vertragsphasen', 'vertragphasen_ids', true);
  }

  /**
   * Leifert die Vertragsphasen
   */
  get vertragsarbeitszeiten() {
    return this._getIdsObject('_vertrags_arbeitszeiten', 'vertrags_arbeitszeits_ids', true);
  }

  /**
   * Liefert das Team der Funktion der Mitarbeiter
   */
  get funktionsTeam() {
    return this?.funktion?.team || false;
  }

  /**
   * gibt die Anzahl der feigebenen Dienste zurück
   */
  get countFreigegebeneDienste() {
    return this.idsFreigegebenerDienste.length;
  }

  /**
   * True, wenn Mitarbeiter einen freigebenen Dienst hat
   */
  get hasFreigegebeneDienste() {
    return this.countFreigegebeneDienste > 0;
  }

  /**
   * Liefert die Anzahl der Freigabetypen
   */
  get countFreigaben() {
    return this.freigabetypen_ids.length;
  }

  get freigegebenDienste() {
    return this._getIdsObject(
      ['_dienste', '_po_dienste'],
      'idsFreigegebenerDienste',
      true
    );
  }

  /**
   * Liefert Informationen zum Mitarbeiter
   */
  get mainInfos() {
    return {
      id: { value: this.id.toString(), label: 'ID' },
      name: { value: this.name || '', label: 'Name' },
      planname: { value: this.planname, label: 'Planname' },
      freigabenanzahl: {
        value: this.countFreigaben.toString(),
        label: 'Freigaben'
      },
      freigegebeneDiensteAnzahl: {
        value: this.countFreigegebeneDienste.toString(),
        label: 'Freigegebene Dienste'
      }
    };
  }

  /**
   * Liefert die Informationen zu den Absprachen
   */
  get arbeitszeitAbpsrachen() {
    const absprachen = this._getIdsObject(
      '_arbeitszeit_absprachen',
      'id',
      false
    );
    return absprachen || [];
  }

  /**
   * Liefert die Informationen zu den Absprachen
   */
  get nichtEinteilenAbsprachen() {
    const absprachen = this._getIdsObject(
      '_nicht_einteilen_absprachen',
      'id',
      false
    );
    return absprachen || [];
  }

  /**
   * Liefert weitere Informationen zur Mitarbeiterin
   */
  get popupInfos() {
    const infos = {
      Status: {
        value: {
          aktiv: { value: this.aktiv ? 'Ja' : 'Nein', label: 'Aktiv' },
          sonderstatus: {
            value: this.abwesend ? 'Ja' : 'Nein',
            label: 'Sonderstatus (Abwesend)'
          }
        },
        label: 'Status'
      },
      Funktion: this.funktion._info,
      Absprachen: {
        value: {
          arbeitszeit: { value: {}, label: 'Arbeitszeit' },
          nichteinteilen: { value: {}, label: 'Nicht einteilen' }
        },
        label: 'Absprachen',
        ignore: true
      },
      Einteilungen: {
        value: {},
        label: 'Einteilungen',
        ignore: true,
        sorting: 'alph-asc'
      }
    };
    if (this?.funktion) {
      infos.Funktion = {
        value: {
          f: this.funktion._info
        },
        label: 'Funktion'
      };
    }
    const {
      vertragsphasen,
      vertragsarbeitszeiten,
      freigaben,
      ratings,
      freigegebenDienste,
      rotationen,
      arbeitszeitAbpsrachen,
      nichtEinteilenAbsprachen
    } = this;
    if (vertragsphasen.length) {
      infos.Vertragsphasen = {
        value: {},
        label: 'Vertragsphasen',
        sorting: 'desc'
      };
      vertragsphasen.forEach((v) => {
        infos.Vertragsphasen.value[v.id] = v._info;
      });
    }
    if (vertragsarbeitszeiten.length) {
      infos.Vertragsarbeitszeiten = {
        value: {},
        label: 'Vertragsarbeitszeiten',
        sorting: 'desc'
      };
      vertragsarbeitszeiten.forEach((v) => {
        infos.Vertragsarbeitszeiten.value[v.id] = v._info;
      });
    }
    if (freigaben.length) {
      infos.Freigaben = { value: {}, label: 'Freigaben', sorting: 'alph-asc' };
      freigaben.forEach((f) => {
        infos.Freigaben.value[f.id] = f._info;
      });
    }
    if (ratings.length) {
      infos.Ratings = { value: {}, label: 'Bewertungen', sorting: 'asc' };
      ratings.forEach((r) => {
        infos.Ratings.value[r.id] = r._infoMitarbeiter;
      });
    }
    if (rotationen.length) {
      infos.Rotationen = { value: {}, label: 'Rotationen', sorting: 'asc' };
      rotationen.forEach((r) => {
        infos.Rotationen.value[r.id] = r._info;
      });
    }
    if (freigegebenDienste.length) {
      infos.Dienste = {
        value: {},
        label: 'Freigegebene Dienste',
        sorting: 'alph-asc'
      };
      freigegebenDienste.forEach((dienst) => {
        const label = dienst.planname;
        infos.Dienste.value[dienst.id] = {
          value: '',
          label,
          sort: label
        };
      });
    }
    if (arbeitszeitAbpsrachen.length) {
      const arbeitszeitAbspracheInfo = infos.Absprachen.value.arbeitszeit;
      arbeitszeitAbpsrachen.forEach((absprache) => {
        arbeitszeitAbspracheInfo.value[absprache.id] = absprache._info;
      });
      infos.Absprachen.ignore = false;
    }
    if (nichtEinteilenAbsprachen.length) {
      const nichtEinteilenAbspracheInfo = infos.Absprachen.value.nichteinteilen;
      nichtEinteilenAbsprachen.forEach((absprache) => {
        nichtEinteilenAbspracheInfo.value[absprache.id] = absprache._info;
      });
      infos.Absprachen.ignore = false;
    }

    this.eachEinteilungsTag((tag, einteilungen) => {
      if (!this._isArray(einteilungen)) return;
      infos.Einteilungen.ignore = false;
      infos.Einteilungen.value[tag] = {
        value: {},
        label: tag,
        sorting: 'alph-asc',
        sort: tag
      };
      const tagInfoValue = infos.Einteilungen.value[tag].value;
      einteilungen.forEach((e) => {
        const dienstId = e?.dienst?.id;
        const label = e?.dienst?.planname || '';
        if (!dienstId) return;
        if (!tagInfoValue[e.dienst.id]) {
          tagInfoValue[e.dienst.id] = {
            value: 1,
            label,
            sort: label
          };
        } else {
          tagInfoValue[e.dienst.id].value =
            parseInt(tagInfoValue[e.dienst.id].value, 10) + 1;
        }
      });
    });

    return infos;
  }

  /**
   * Liefert ein aus Main und Popupinfos zusammengesetztes Objekt
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
      label: 'Mitarbeiter'
    };
  }

  /**
   * True, wenn RotationenIds vorhanden sind
   */
  get hasRotationen() {
    return !!this.rotationenIds.length;
  }

  aktivAm(dateId){
    return !!(dateId 
    ? this.aktiv && this.getVertragsPhase(dateId) && this.getVertragsArbeitszeit(dateId)
    : this.aktiv);
  }

  rotationenTitleAm(dateId){
    const data = this?._dates?.[dateId];
    if (!data) return 'Rotationen: \nDate not valid!';
    let rotationen = [];
    let all = [];
    const has = {};
    this.rotationen
      ?.sort?.((a, b) => a.prioritaet - b.prioritaet)
      ?.forEach?.((r) => {
        if (!data?.isInRotationTimeInterval(r)) return;
        rotationen.push(r.verteilerHoverLabel);
        has[r.kontingent_id] = true;
        if (r.all_rotations.length) all = r.all_rotations;
      });
    rotationen = rotationen.join('\n');
    all = all
      .filter((r) => {
        const result = !has[r.kontingent_id];
        has[r.kontingent_id] = true;
        return result;
      })
      .sort((a, b) =>
        numericLocaleCompare(
          a.verteilerHoverLabelNoPrio,
          b.verteilerHoverLabelNoPrio
        )
      )
      .map((r) => {
        return r.verteilerHoverLabelNoPrio;
      })
      .join('\n');
    const title = [];
    if (rotationen) title.push({ txt: `Rotationen: \n${rotationen}` });
    if (all) title.push({ txt: `Alle Rotationen:\n${all}` });
    return title;
  }

  initRatingDienst() {
    this?.ratings?.forEach?.((rating) => {
      this.dienst_id_rating_id[rating.po_dienst_id] = rating.id;
    });
  }

  eachArbeitszeitAbspracheAm(tag, callback) {
    const arr = [];
    const date = this._dates?.[tag];
    if (date) {
      this.arbeitszeitAbpsrachen?.forEach?.((absprache, i) => {
        if (!absprache?.showAbsprache?.(date)) return;
        arr.push(
          this._isFunction(callback) ? callback(absprache, i) : absprache
        );
      });
    }
    return arr;
  }

  /**
   * @param {String} date
   * @returns True, wenn es min. eine Rotation für den Tag gibt.
   */
  hasRotationenAm(tag = false) {
    const date = this._dates?.[tag];
    if (!date?.isInRotationTimeInterval) return this.hasRotationen;
    const rotationen = this._rotationen;
    return !!this.rotationenIds?.find?.((rId) => {
      const r = rotationen?.[rId];
      return !!(r && date.isInRotationTimeInterval(r));
    });
  }

  getPrioRotationAm(tag = false) {
    const date = this._dates?.[tag];
    if (date?.isInRotationTimeInterval) {
      return getPrioRotationHelper(this.rotationenIds, this._rotationen, (r) =>
        date.isInRotationTimeInterval(r)
      );
    }
    return false;
  }

  isInKontingentAm(tag, kId) {
    const date = this._dates?.[tag];
    if (!date?.isInRotationTimeInterval) return false;
    const rotationen = this._rotationen;
    return !!this.rotationenIds?.find?.((rId) => {
      const r = rotationen?.[rId];
      return !!(
        r &&
        `${r?.kontingent_id}` === `${kId}` &&
        date.isInRotationTimeInterval(r)
      );
    });
  }

  /**
   * Setzt die Ids der freigegebenen Dienste
   * @param {Array} ids
   */
  setIdsFreigegebenerDienste(ids = []) {
    this._setArray('idsFreigegebenerDienste', ids);
  }

  /**
   * Setzt die Ids der Rotationen
   * @param {Array} ids
   */
  setRotationenIds(ids = []) {
    this._setArray('rotationenIds', ids);
  }

  /**
   * zurücksetzen einiger Attribute
   */
  resetAttributes() {
    this.setRotationenIds([]);
    this._set('einteilungen', {
      monate: {},
      bloecke: {},
      tage: {},
      dienstgruppen: [],
      schichten: {},
      nachtdienste: [],
      tageDienste: {},
      dienste: {}
    });
    this._set('class', '');
    this.checkStatus();
  }

  /**
   * Führt ein update der Mitarbeiterdaten durch
   * @param {Object} freigabe
   * @param {Boolean} add
   */
  updateFreigabe(freigabe, add) {
    if (!freigabe?.id) return;
    if (add) {
      if (!this.freigaben_ids.includes(freigabe.id)) {
        this.freigaben_ids.push(freigabe.id);
      }
      if (!this.freigabetypen_ids.includes(freigabe.freigabetyp_id)) {
        this.freigabetypen_ids.push(freigabe.freigabetyp_id);
      }
    } else {
      const fTypenIndex = this.freigaben_ids.findIndex(
        (fId) =>
          fId !== freigabe.id &&
          freigabe.freigabetyp_id === this?._freigaben[fId]?.freigabetyp_id
      );
      if (fTypenIndex < 0) {
        const j = this.freigabetypen_ids.indexOf(freigabe.freigabetyp_id);
        if (j >= 0) {
          this.freigabetypen_ids.splice(j, 1);
        }
      }
      const i = this.freigaben_ids.indexOf(freigabe.id);
      if (i >= 0) {
        this.freigaben_ids.splice(i, 1);
      }
    }
  }

  /**
   * Führt ein update der Mitarbeiterdaten durch
   * @param {Object} rotation
   * @param {Boolean} add
   */
  updateRotation(rotation, add = true) {
    if (!rotation?.id) return;
    if (add) {
      this.addRotationId(rotation?.id);
    } else {
      const i = this.rotationenIds.indexOf(rotation.id);
      if (i >= 0) {
        this.rotationenIds.splice(i, 1);
      }
    }
  }

  /**
   * Aktualisiert das Attribut class
   */
  checkStatus() {
    if (this.abwesend) this.addClass(sonderstatusClass);
    if (!this.aktiv) this.addClass(abwesendClass);
    return this.class;
  }

  /**
   * Fügt dem Attribut class einen Namen hinzu
   * @param {String} className
   */
  addClass(className) {
    if (typeof className === 'string') {
      this._set('class', `${this.class} ${className}`.trim());
    }
    return this.class;
  }

  /**
   * Fügt die Dienst-Id den freigegebenen Diensten hinzu
   * @param {Number} dienstId
   * @returns Ids der freigegebenen Dienste
   */
  addToFreigegebeneDienste(dienstId = 0) {
    if (!this.idsFreigegebenerDienste.includes(dienstId)) {
      this.idsFreigegebenerDienste.push(dienstId);
    }
    return this.idsFreigegebenerDienste;
  }

  /**
   * Entfernt die Dienst-Id aus den freigegebenen Diensten
   * @param {Number} dienstId
   * @returns Ids der freigegebenen Dienste
   */
  removeFromFreigegebeneDienste(dienstId = 0) {
    const i = this.idsFreigegebenerDienste.indexOf(dienstId);
    if (i >= 0) {
      this.idsFreigegebenerDienste.splice(i, 1);
    }
    return this.idsFreigegebenerDienste;
  }

  /**
   * Fügt die Rotation-Id hinzu
   * @param {Number} rotId
   * @returns Ids der Rotationen
   */
  addRotationId(rotId = 0) {
    const rId = parseInt(rotId, 10);
    if (!this.rotationenIds.includes(rId)) {
      this.rotationenIds.push(rId);
    }
    return this.rotationenIds;
  }

  /**
   * Liefert die Team-Namen zu denen die Mitarbeiterin an entsprechendem Tag gehört.
   * Falls kein Team gefunden wird, wird das Funktions-Team zurückgegeben.
   * Funktioniert nur, wenn man im vorhinein, über die Rotationen, die Mitarbeiter zu den teams
   * tageweise zugeordnet hat.
   * @param {String} tag
   */
  getTeamNamenAm(tag = false) {
    const namen = [];
    this?._teams?._each?.((team) => {
      if (team.hasMitarbeiterTag(this.id, tag)) {
        if (!namen.includes(team.name)) namen.push(team.name);
      }
    });
    if (this?.funktionsTeam?.name && !namen.length) {
      namen.unshift(this?.funktionsTeam?.name);
    }
    return namen.length ? namen.join(',') : 'Kein Team';
  }

  /**
   * Erstellt in den einteilungen ein neues Objekt für den Monat und liefert dieses zurück
   * @param {Object} feld
   * @returns einteilung.monate[monat]
   */
  getEinteilungsMonat(feld) {
    const month = feld?.date?.month || 'Unbekannt';
    const monate = this.einteilungen.monate;
    const isInMainZeitraum = !!feld?.date?.isInMainZeitraum;
    // Erstelle die Grundlage zur Ermittlung der Konflikte
    // und genauen Zuordnung der Felder zu ihren Konflikten
    if (!monate?.[month]) {
      monate[month] = {
        isInMainZeitraum,
        dienstplan: {
          wochentage: {},
          wochenenden: {}
        },
        urlaubsplan: {
          wochentage: {},
          wochenenden: {}
        },
        arbeitszeittypen: {}
      };
      this?._konfliktArbeitszeittypen?.forEach?.((typ) => {
        monate[month].arbeitszeittypen[typ.id] = [];
      });
    }
    return monate[month];
  }

  /**
   * Initialisiert die Einteilung
   * @param {Object} feld
   * @returns Object
   */
  initEinteilung(feld = false) {
    const { isWeekend, bedarf } = feld || {};
    const keyPlan = bedarf ? 'dienstplan' : 'urlaubsplan';
    const keyTag = isWeekend ? 'wochenenden' : 'wochentage';
    const einteilungsMonat = this.getEinteilungsMonat(feld);
    const einteilungsPlan = einteilungsMonat[keyPlan];
    const einteilungsWochen = einteilungsPlan[keyTag];
    return {
      einteilungsWochen,
      einteilungsMonat,
      einteilungsPlan
    };
  }

  /**
   * Fügt das Feld den Einteilungen hinzu
   * @param {Object} feld
   */
  addEinteilung(feld) {
    if (this._isArray(feld)) {
      [...feld].forEach((_feld) => {
        this.addOneEinteilung(_feld);
      });
    } else {
      this.addOneEinteilung(feld);
    }
    this._update();
  }

  addOneEinteilung(feld) {
    if (!this._isObject(feld)) return false;
    const {
      dienstgruppeZeitraum,
      schichtenWithAusgleich,
      tag,
      dienstId,
      weekCounter,
      bedarf,
      isNachtDienst
    } = feld;
    const first_entry = bedarf?.is_block && bedarf?.first_entry;
    const { einteilungsWochen, einteilungsMonat } = this.initEinteilung(feld);
    const add = (obj, key, value) => {
      if (this._isObject(obj)) {
        if (!obj?.[key]) {
          obj[key] = [value];
        } else if (!obj[key].includes(value)) {
          obj[key].push(value);
        }
      } else {
        console.log('Das ist kein Objekt', obj, key);
      }
    };
    // Einteilung in Wochentage / Wochenenden
    add(einteilungsWochen, weekCounter, feld);
    // Einteilung in Blöcke
    if (first_entry) {
      add(this.einteilungen.bloecke, first_entry, feld);
    }
    // Einteilungen in Tage
    add(this.einteilungen.tage, tag, feld);
    // Einteilungen in Dienste
    add(this.einteilungen.dienste, dienstId, feld);
    // Einteilungen in TageDienste
    if (!this.einteilungen.tageDienste[tag]) {
      this.einteilungen.tageDienste[tag] = {};
    }
    add(this.einteilungen.tageDienste[tag], dienstId, feld);
    // Einteilungen in NachtDienste
    if (isNachtDienst) {
      add(this.einteilungen, 'nachtdienste', feld);
    }
    // Einteilung in Dienstgruppen
    if (dienstgruppeZeitraum) {
      add(this.einteilungen, 'dienstgruppen', feld);
    }
    // Einteilungen nach Schicht-Tagen
    schichtenWithAusgleich?.forEach?.((schicht) => {
      const tage = schicht.getTage();
      tage?.forEach?.((_tag) => {
        if (!this.einteilungen.schichten[_tag]) {
          this.einteilungen.schichten[_tag] = [{ schicht, feld }];
        } else if (
          !this.einteilungen.schichten[_tag].find(
            (obj) => obj.schicht === schicht && obj.feld === feld
          )
        ) {
          this.einteilungen.schichten[_tag].push({ schicht, feld });
        }
      });
      const arbeitszeittyp =
        einteilungsMonat.arbeitszeittypen?.[schicht.arbeitszeittyp_id];
      if (arbeitszeittyp?.includes && !arbeitszeittyp.includes(feld)) {
        arbeitszeittyp.push(feld);
      }
    });
  }

  /**
   * Entfernt das Feld aus den Einteilungen
   * @param {Object} feld
   */

  removeOneEinteilung(feld) {
    if (!this._isObject(feld)) return false;
    const {
      tag,
      dienstId,
      schichtenWithAusgleich,
      weekCounter,
      bedarf,
      isNachtDienst
    } = feld;
    const first_entry = bedarf?.is_block && bedarf?.first_entry;
    const { einteilungsWochen, einteilungsMonat } = this.initEinteilung(feld);
    const remove = (arr, value) => {
      const pos = this._isArray(arr) ? arr.indexOf(value) : -1;
      if (pos >= 0) {
        arr.splice(pos, 1);
      }
    };
    // Entfernen aus Wochenende / Wochentage
    remove(einteilungsWochen?.[weekCounter], feld);
    // Entfernung aus Tage
    remove(this.einteilungen.tage?.[tag], feld);
    // Entfernung aus Dienste
    remove(this.einteilungen.dienste?.[dienstId], feld);
    // Entfernung aus TageDienste
    remove(this.einteilungen.tageDienste?.[tag]?.[dienstId], feld);
    // Entfernung aus nachDienste
    remove(isNachtDienst && this.einteilungen.nachtdienste, feld);
    // Entfernung aus dienstgruppen
    remove(this.einteilungen.dienstgruppen, feld);
    // Entfernung aus Blöcken
    remove(first_entry && this.einteilungen.bloecke?.[first_entry], feld);
    // Entfernung aus Schichten nach Tagen
    schichtenWithAusgleich?.forEach?.((schicht) => {
      remove(
        einteilungsMonat.arbeitszeittypen?.[schicht.arbeitszeittyp_id],
        feld
      );
      const tage = schicht.getTage();
      tage?.forEach?.((_tag) => {
        const pos = this.einteilungen.schichten?.[_tag]
          ? this.einteilungen.schichten[_tag].findIndex(
              (obj) => obj.schicht.id === schicht.id && obj.feld === feld
            )
          : -1;
        if (pos >= 0) {
          this.einteilungen.schichten[_tag].splice(pos, 1);
        }
      });
    });
  }

  removeEinteilung(feld) {
    if (this._isArray(feld)) {
      [...feld].forEach((_feld) => {
        this.removeOneEinteilung(_feld);
      });
    } else {
      this.removeOneEinteilung(feld);
    }
    this._update();
  }

  /**
   * Fügt das Feld an das Array, wenn vorschlag = true ist.
   * @param {Array} arr
   * @param {Object} feld
   * @param {Boolean} vorschlag
   * @returns Array ggf. mit dem Feld im Array
   */
  addVorschlag(arr, feld, vorschlag) {
    let result = this._isArray(arr) ? [...arr] : [];
    if (vorschlag && !result.includes(feld)) {
      result = [...result, feld];
    }
    return result;
  }

  /**
   * Ermittelt die Konflikte der Mitarbeiterin für die entsprechenden Felder.
   * Damit diese Funktion erfolgreich Konflikte ermittelt, sind einige Bedinungen notwendig.
   * 1. Einteilungen sollten über die Feld-Klasse gehandelt werden
   * 2. PlanerDate wird verwendet, um zu jedem Tag die entsprechenden Eigenschaften zu haben
   * 3. Die Zuordnung der Feld-Klasse zu dem PlanerDate, Dienst, Team,
   * Bedarfseintrag und den Schichten funktioniert
   * 4. Die Teams beinhalten anhand der Rotationen, an welchen Tagen die Mitarbeiter
   * zu dem Team gehören.
   * @param {Object} feld
   * @param {Boolean} vorschlag
   */
  checkKonflikte(feld = false, vorschlag = false) {
    const konflikteApi = this._konflikte;
    if (!this._isObject(feld) || !konflikteApi) return false;
    const konflikte = {};
    const { einteilungsWochen, einteilungsMonat } = this.initEinteilung(feld);
    const { isWeekend, tag, bedarf, schichten, weekCounter, dienstId, team } =
      feld;
    const wunsch = this.getWunschAm(tag);
    // Prüft das aktiv und das sonderstatus-abwesend der Mitarbeiterin
    const abwesend = bedarf && konflikteApi.abwesenheitKonflikt(this, tag);
    if (abwesend?.check) konflikte.Abwesend = abwesend;
    // Prüft, ob der Mitarbeiter zum Team des Dienstes gehört
    const isInDienstTeam =
      wunsch?.hasDienst?.(dienstId) || this.isInDienstTeam(dienstId, tag);
    const teamKonflikt = konflikteApi.teamKonflikt(
      isInDienstTeam,
      team?.name || 'Kein Team',
      this.getTeamNamenAm(tag)
    );
    if (teamKonflikt?.check) konflikte.Team = teamKonflikt;
    // Prüft, wieviele Freigaben des Diensten erfüllt werden
    const freigabeKonflikt = konflikteApi.freigabeKonflikt(
      this.anteilFreigaben(dienstId)
    );
    if (freigabeKonflikt?.check) konflikte.Freigaben = freigabeKonflikt;
    // Prüft für Wochenend-Einteilungen, ob eine bestimmte Anzahl überschritten wird
    if (isWeekend && bedarf) {
      const obj = vorschlag ? { ...einteilungsWochen } : einteilungsWochen;
      if (vorschlag) {
        obj[weekCounter] = this.addVorschlag(obj[weekCounter], feld, vorschlag);
      }
      const wochenende = konflikteApi.wochenendenKonflikt(
        Object.values(obj),
        this._MAX_WOCHENENDEN
      );
      if (wochenende?.check) konflikte.Wochenende = wochenende;
    }
    // Prüft, ob die Einteilung eine Dienstgruppe im vorhinein fordert
    // und diese Bedingung erfüllt ist
    const fordertPreDienstgruppe = konflikteApi.preDienstgruppeKonflikt(
      feld,
      this.einteilungen.schichten,
      this?._pageName === 'dienstplaner'
    );
    if (fordertPreDienstgruppe?.check) {
      konflikte.Fordert_Dienstgruppe_Vorher = fordertPreDienstgruppe;
    }
    // Prüft, ob mehrere Einteilungen an einem Tag existieren
    const mehrfachEinteilungen = konflikteApi.mehrfacheinteilungenKonflikt(
      feld,
      this.addVorschlag(this.einteilungen.tage?.[tag], feld, vorschlag),
      wunsch
    );
    if (mehrfachEinteilungen?.check) {
      konflikte.Mehrfacheinteilungen = mehrfachEinteilungen;
    }
    // Prüft für bestimmte Arbeitszeittypen, ob die Mitarbeiterin
    // die min oder max-Einteilungen überschreitet
    const arbeitszeittypen = einteilungsMonat.arbeitszeittypen;
    for (const typId in arbeitszeittypen) {
      const typ = this?._arbeitszeittypen?.[typId];
      const isInArbeitszeittyp =
        typ &&
        schichten.find(
          (schicht) => schicht.arbeitszeittyp_id === parseInt(typId, 10)
        );
      if (isInArbeitszeittyp) {
        const arbeitszeittyp = konflikteApi.arbeitszeittypenKonflikt(
          this.addVorschlag(arbeitszeittypen[typId], feld, vorschlag),
          typ
        );
        if (arbeitszeittyp?.check) konflikte[typ.name] = arbeitszeittyp;
      }
    }
    // Prüft, ob die Einteilung eine Dienstgruppe im Anschluss fordert
    // und andere Einteilungen diese nicht erfüllen
    const fordertDienstgruppe = konflikteApi.fordertDienstgruppeKonflikt(
      feld,
      this.einteilungen.schichten
    );
    if (fordertDienstgruppe?.check) {
      konflikte.Fordert_Dienstgruppe = fordertDienstgruppe;
    }
    // Testet, ob eine andere Einteilung einen bestimmte Dienstgruppe fordert
    // und die aktuelle Einteilung diese erfüllt
    const dienstgruppeKonflikt = konflikteApi.dienstgruppeKonflikt(
      feld,
      this.einteilungen.dienstgruppen
    );
    if (dienstgruppeKonflikt?.check) {
      konflikte.Dienstgruppe = dienstgruppeKonflikt;
    }
    // Testet, ob Schichten anderer Einteilungen
    // eine Überschneidung mit der aktuellen Einteilung haben
    const ueberschneidungKonflikt = konflikteApi.ueberschneidungenKonflikt(
      feld,
      schichten,
      this.einteilungen.schichten,
      wunsch
    );
    if (ueberschneidungKonflikt?.check) {
      konflikte.Ueberschneidungen = ueberschneidungKonflikt;
    }
    return konflikte;
  }

  /**
   * Liefert den Wunsch eines bestimmten Tages.
   * Es wird empfohlen diese Funktion in den entsprechenden Seiten durch eine
   * geeignete Struktur der Zuordnung von Wünschen zu Mitarbeitern und Tagen
   * und Überschreiben der Funktion in einer eigenen Mitarbeiter-Klasse
   * aus Performance-Gründen zu ersetzen.
   * Z.B. im Dienstplaner beinhaltet die PlanerDate ein By-Mitarbeiter-Objekt,
   * welches die ID des Mitarbeiter-Wunsches an dem entsprechenden Tag enthält.
   * date = {
   *  by_mitarbeiter: {
   *    mitarbeiter-id: {
   *      wunsch-id
   *    }
   *  }
   * }
   * @param {String} dateId
   * @returns Wunsch
   */
  getWunschAm(dateId = '') {
    let wunsch = false;
    const date = this?._dates?.[dateId];
    const by_mitarbeiter = date?.by_mitarbeiter;
    if (by_mitarbeiter) {
      const wunschId = by_mitarbeiter?.[this.id]?.wunsch_id || 0;
      wunsch = this?._wuensche?.[wunschId] || false;
    } else if (development) {
      console.error(
        'Date und by_mitarbeiter nicht vorhanden',
        this?.dates,
        dateId,
        this.id,
        date,
        by_mitarbeiter
      );
    }
    return wunsch;
  }

  /**
   * Iteriert über die Einteilungen.
   * Bricht die Iteration ab, wenn der callback, true zurückgibt.
   * @param {Function} callback
   * @returns True, wenn alle Tage durchlaufen wurden
   */
  eachEinteilungsTag(callback = false) {
    if (!this._isFunction(callback)) return false;
    if (this._isObject(this.einteilungen?.tage)) {
      for (const tag in this.einteilungen.tage) {
        if (callback(tag, this.einteilungen.tage[tag])) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @param {String} dateId
   * @returns True, wenn der Mitarbeiter an dem Tag eingeplant ist
   */
  hasEinteilungenAm(dateId = '') {
    return !!this.getEinteilungenNachTag(dateId)?.length;
  }

  /**
   * Gibt die Einteilungen des Mitarbeiters zurück
   * @param {String} dateId
   * @returns Array
   */
  getEinteilungenNachTag(dateId = '') {
    return this.einteilungen.tage?.[dateId] || [];
  }

  hasAusgleichsFreiAm(dateId = '') {
    const schichten = this.einteilungen?.schichten?.[dateId];
    return schichten?.find?.((s) => s?.schicht?.hasDayFrei?.(dateId)) || false;
  }

  /**
   * Gibt die Einteilungen des Mitarbeiters zurück
   * @param {Number} dienstId
   * @returns Array
   */
  getEinteilungenNachDienst(dienstId = 0) {
    return this.einteilungen.dienste?.[dienstId] || [];
  }

  /**
   * Gibt die Einteilungen des Mitarbeiters zu einem bestimmten Tag und Dienst zurück
   * @param {String} dateId
   * @param {Number} dienstId
   * @returns Array
   */
  getEinteilungenNachTagAndDienst(dateId = '', dienstId = 0) {
    return this.einteilungen.tageDienste?.[dateId]?.[dienstId] || [];
  }

  /**
   * @param {String} dateId
   * @param {Number} dienstId
   * @param {Number} bereichId
   * @param {Array} schichtnr
   * @returns {Object|Boolean} Feld,
   * wenn eine Einteilung für diese Mitarbeiterin in den Bereich schon existiert
   */
  hasDoppelteEinteilung(dateId, dienstId, bereichId, schichtnr) {
    const einteilungen = this.getEinteilungenNachTagAndDienst(dateId, dienstId);
    const einteilung = einteilungen.find((f) =>
      f.isSame(dateId, dienstId, bereichId, schichtnr)
    );
    return einteilung || false;
  }

  /**
   * @param {Number} einteilungId
   * @param {String} dateId
   * @param {Number} dienstId
   * @returns {Object|Boolean} Feld,
   * wenn eine Einteilung für diese Mitarbeiterin in den Bereich schon existiert
   */
  hasDoppelteEinteilungById(einteilungId, dateId, dienstId) {
    const einteilungen = this.getEinteilungenNachTagAndDienst(dateId, dienstId);
    const einteilung = einteilungen.find(
      (f) => f?.einteilung?.id === einteilungId
    );
    return einteilung || false;
  }

  /**
   * Gibt alle Einteilungen des Mitarbeiters zurück
   * @param {String} dateId
   * @returns Array
   */
  getAllEinteilungen() {
    let einteilungen = [];
    Object.values(this.einteilungen.tage).forEach((arr) => {
      einteilungen = einteilungen.concat(arr);
    });
    return einteilungen;
  }

  /**
   * Liefert alle Nachtdienst-Einteilungen
   */
  getNachtDienste() {
    return this.einteilungen.nachtdienste || [];
  }

  /**
   * Führt eine Funktion für jeden Einteilungsmonat aus
   * @param {Function} callback
   */
  eachEinteilungsMonat(callback = false) {
    if (
      this._isObject(this?.einteilungen?.monate) &&
      this._isFunction(callback)
    ) {
      for (const monat in this.einteilungen.monate) {
        callback(this.einteilungen.monate[monat], monat);
      }
    }
  }

  /**
   * Iteriert über alle arbeitszeittypen
   * @param {Function} callback
   */
  eachArbeitszeittyp(callback = false) {
    if (this._isFunction(callback)) {
      this.eachEinteilungsMonat((einteilungsMonat, monat) => {
        const arbeitszeittypen = einteilungsMonat?.arbeitszeittypen;
        for (const typId in arbeitszeittypen) {
          const typ = this?._arbeitszeittypen?.[typId];
          callback(typ, arbeitszeittypen[typId], einteilungsMonat, monat);
        }
      });
    }
  }

  isTrulyInTeam(team = false, dateId = false) {
    return this?._dates?.[dateId]
      ? team?.hasMitarbeiterTag?.(this.id, dateId)
      : team?.hasMitarbeiter?.(this.id);
  }

  /**
   * Testet, ob die Mitarbeiterin im Team des Dienstes ist.
   * Entweder an einem bestimmten Tag oder irgendwann.
   * @param {Number} dienstId
   * @param {String} dateId
   * @returns True, wenn dienst.dpl_all_teams oder Mitarbeiter im Team des Dienstes
   */
  isInDienstTeam(dienstId = 0, dateId = false) {
    const dienst = this?._dienste?.[dienstId] || this?._po_dienste?.[dienstId];
    const team = dienst?.team;
    return !!(dienst?.dpl_all_teams || this.isTrulyInTeam(team, dateId));
  }

  /**
   * Berechnet, wieviele Freigaben des Dienstes erfüllt werden.
   * Freigaben höherer Qualifiktation werden nur mit einem halben Punkt addiert.
   * 0 => Keine Freigabe
   * 1 => Alle Freigaben
   * > 0 && < 1 => Einige Freigaben
   * @param {Number} dienstId
   * @param {Boolean} categories -> 0, 0.5 und 1
   * @returns zahl
   */
  anteilFreigaben(dienstId = 0, categories = false) {
    const dienst = this?._dienste?.[dienstId] || this?._po_dienste?.[dienstId];
    const l = dienst?.countFreigaben || 0;
    if (l > 0) {
      let result = 0;
      const freigaben = this.freigaben;
      dienst?.freigabetypen_ids?.forEach?.((typId) => {
        const freigabe = freigaben?.find?.((f) => f.freigabetyp_id === typId);
        if (freigabe) {
          result += freigabe?.erteilt ? 1 : 0.5;
        }
      });
      result /= l;
      return categories && result > 0 && result < 1 ? 0.5 : result;
    }
    return 1;
  }

  /**
   * Testet, welche Freigaben die Mitarbeiterin für dieses Feld hat
   * und liefert die Eigenschaften dieser Freigaben.
   * @param {Object} feld
   * @returns Object
   */
  getFreigaben(feld) {
    const l = feld?.dienst?.countFreigaben || 0;
    if (l > 0) {
      const score = this.anteilFreigaben(feld?.dienstId);
      if (score === 1) {
        return {
          msg: 'Alle Freigaben erteilt',
          className: freigabenClasses.all
        };
      }
      if (score === 0) {
        return {
          msg: 'Keine Freigaben erteilt',
          className: freigabenClasses.none
        };
      }
      return {
        msg: 'Einige Freigaben erteilt',
        className: freigabenClasses.some
      };
    }
    return false;
  }

  /**
   * Testet, ob die Mitarbeiterin an einem bestimmten Tag als abwesend gilt.
   * Abwesend sind Mitarbeiter mit einer Einteilung an einem bestimmten Tag,
   * Überschneidungen an diesem Tag,
   * falsche Dienstgruppe am entsprechenden Tag.
   * @param {Object} feld
   * @param {Object} konflikte
   * @returns True, wenn Mitarbeiter als abwesend gilt
   */
  isAbwesend(feld = false, konflikte = false) {
    const info = this._isObject(konflikte?.konflikte)
      ? konflikte
      : feld?.getKonflikteClassTitleAndInfo?.(this);
    return !!(
      (
        this._isObject(info?.konflikte) &&
        Object.values(info.konflikte).find((k) => k?.abwesend)
      )
    );
  }

  /**
   * Liefert die Vertragsphasen in einem bestimmten Zeitraum.
   * @param {String} dateIdVon
   * @param {String} dateIdBis
   * @param {arr} Vertragsphasen or Arbeitszeiten
   * @returns {Array} arr
   */
  filterVertragsPhasenOrArbeitszeiten(dateIdVon, dateIdBis, arr) {
    const dateZahlVon = this?._dateZahl?.(dateIdVon) || 0;
    const dateZahlBis = this?._dateZahl?.(dateIdBis) || 0;
    if(dateZahlVon && dateIdBis && dateZahlVon < dateZahlBis) {
      return arr?.filter?.((el) => (
        el?.vertrag?.gueltigInByZahl?.(dateZahlVon, dateZahlBis) && 
        el.gueltigInByZahl(dateZahlVon, dateZahlBis)
      )) || [];
    }
    return [];
  }

  /**
   * Liefert die zum Datum passende Vertragsphase
   * @param {String} dateId
   * @param {arr} Vertragsphasen or Arbeitszeiten
   * @returns object
   */
  findVertragsPhaseOrArbeitszeit(dateId, arr){
    const dateZahl = this?._dateZahl?.(dateId) || 0;
    return (
      dateZahl &&
      arr?.find?.((el) => (
        el?.vertrag?.gueltigAmByZahl?.(dateZahl) && 
        el.gueltigAmByZahl(dateZahl)
      ))
    );
  }

  /**
   * Liefert die Vertragsphasen in einem bestimmten Zeitraum.
   * @param {String} dateIdVon 
   * @param {String} dateIdBis
   * @returns {Array} Vertragarbeitszeiten
   */
  getVertragsArbeitszeiten(dateIdVon, dateIdBis) {
    this.filterVertragsPhasenOrArbeitszeiten(dateIdVon, dateIdBis, this.vertragsarbeitszeiten);
  }

  /**
   * Liefert die zum Datum passende Vertragsphase
   * @param {String} dateId
   * @returns object
   */
  getVertragsArbeitszeit(dateId) {
    return this.findVertragsPhaseOrArbeitszeit(dateId, this.vertragsarbeitszeiten);
  }


  /**
   * Liefert die Vertragsphasen in einem bestimmten Zeitraum.
   * @param {String} dateIdVon 
   * @param {String} dateIdBis
   * @returns {Array} Vertragsphasen
   */
  getVertragsPhasen(dateIdVon, dateIdBis) {
    this.filterVertragsPhasenOrArbeitszeiten(dateIdVon, dateIdBis, this.vertragsphasen);
  }

  /**
   * Liefert die zum Datum passende Vertragsphase
   * @param {String} dateId
   * @returns object
   */
  getVertragsPhase(dateId) {
    return this.findVertragsPhaseOrArbeitszeit(dateId, this.vertragsphasen);
  }

  /**
   * Liefert die zum Datum passende Vertragsphase
   * @param {String} dateId
   * @returns object
   */
  getStundenTag(dateId) {
    const phase = this.getVertragsPhase(dateId);
    const dateZahl = this?._dateZahl?.(dateId) || 0;
    const variante = phase?.vertragsstufe?.vertragsvariante;
    // variante?.gueltigAmByZahl?.(dateZahl)
    if (variante && dateZahl) {
      const ws = parseInt(variante.wochenstunden, 10) || 0;
      if (ws > 0) return ws / 5;
    }
    return 0;
  }

  /**
   * Liefert die zum Datum passende Vertragsphase
   * @param {String} dateId
   * @returns object
   */
  getVK(dateId) {
    let vk = 1.0;
    const va = this.getVertragsArbeitszeit(dateId);
    const vaVk = parseFloat(va?.vk) || 0.0;
    if (vaVk > 0.0) {
      vk = vaVk;
    }
    return vk;
  }

  /**
   * Liefert die Sollstunden anhand des VK und der Stunden pro Tag.
   * Wochenenden können ein- und ausgeschlossen werden.
   * @param {String} dateId
   * @param {Boolean} noWeekends
   * @returns Number
   */
  getSollStunden(dateId, noWeekends = true) {
    const date = this?._dates?.[dateId];
    if (noWeekends && (date?.isFeiertag || date?.is_weekend)) return 0.0;
    return this.getVK(dateId) * this.getStundenTag(dateId);
  }

  /**
   * Liefert alle Teams der Mitarbeiter an diesem Tag, ohne dem Funktions-Team
   * @param {String} tag
   * @returns Array
   */
  getTeamsWithoutFunktionsTeamAm(tag = '') {
    const result = [];
    this?._teams?._each?.((team) => {
      const inTeam = tag
        ? team.hasMitarbeiterTag(this.id, tag)
        : team.hasMitarbeiter(this.id);
      if (inTeam && !result.includes(team)) {
        result.push(team);
      }
    });
    return result;
  }

  /**
   * Liefert alle Teams der Mitarbeiter an diesem Tag
   * @param {String} tag
   * @returns Array
   */
  getTeamsAm(tag = '') {
    const result = [this.funktionsTeam];
    return result.concat(this.getTeamsWithoutFunktionsTeamAm(tag));
  }

  /**
   * Liefert das priorisierte Team
   * @param {String} tag
   * @returns Object
   */
  getPrioTeamAm(tag = '') {
    const result = this.getTeamsAm(tag);
    // Kleinste prio zuerst
    result.sort(
      (a, b) => a.rotationPrio(tag, this.id) - b.rotationPrio(tag, this.id)
    );
    return result?.[0] || false;
  }

  /**
   * Erstellt die Informationen zu dem Mitarbeiter
   */
  setInfo() {
    this._setPageInfoPopup(this.cleanedPlanname, this);
  }

  /**
   * Erstellt eine kleine Statistik für die Einteilung-Auswahl.
   * Es wird gezählt wieviele Einteilungen die Mitarbeiterin nach
   * Dienstplan, Urlaubsplan, Bereitschaftsdienst und Wochenende hat.
   * Der callback wird einmal für jedes Feld und einmal zum Schluss ausgeführt.
   * @param {Function} callback
   * @param {Function} shouldCount
   */
  getEinteilungenInfo(callback = false, shouldCount = false) {
    const info = {
      Bereitschaftsdienste: {
        title: [],
        anzahl: 0,
        info: {
          Alle: []
        },
        felder: [],
        className: ''
      },
      Wochenenden: {
        title: [],
        anzahl: 0,
        info: {},
        felder: [],
        className: ''
      },
      Dienstplan: {
        title: [],
        anzahl: 0,
        info: {},
        felder: []
      },
      Urlaubsplan: {
        title: [],
        anzahl: 0,
        info: {},
        felder: []
      }
    };
    const isValid = this._isFunction(shouldCount)
      ? (feld) => shouldCount(feld)
      : () => true;
    if (this._isObject(this?.einteilungen?.tage)) {
      const bdTyp = this?._arbeitszeittypen?._each?.(
        (typ) => !!typ?.bereitschaft,
        (typ) => !!typ?.bereitschaft
      )?.arr?.[0];
      for (const einteilungTag in this.einteilungen.tage) {
        if (!this.einteilungen.tage[einteilungTag]?.forEach) continue;
        this.einteilungen.tage[einteilungTag].forEach((feld) => {
          // Zählt die Infos nur für Einteilungen des gleichen Monats
          if (isValid(feld)) {
            const plan = feld?.dienst?.hasBedarf ? 'Dienstplan' : 'Urlaubsplan';
            info[plan].anzahl += 1;
            const planname = feld?.dienst?.planname || feld?.dienstId;
            const tag = feld?.date?.label || feld?.tag;
            if (!info[plan].info[planname]) info[plan].info[planname] = [];
            info[plan].info[planname].push(tag);
            info[plan].felder.push(feld);
            if (bdTyp && feld?.arbeitszeittypValue) {
              const bd = feld.arbeitszeittypValue(bdTyp) || 0;
              if (bd) {
                info.Bereitschaftsdienste.anzahl += bd;
                info.Bereitschaftsdienste.info.Alle.push(
                  `${feld?.label || ''} (${bd})`
                );
                info.Bereitschaftsdienste.felder.push(feld);
              }
            }
            if (feld?.isWeekend && feld?.bedarf) {
              const counter = feld?.weekCounter || 0;
              if (!info.Wochenenden.info[counter]) {
                info.Wochenenden.info[counter] = [];
                info.Wochenenden.anzahl += 1;
              }
              info.Wochenenden.info[counter].push(feld?.label);
              info.Wochenenden.felder.push(feld);
            }
          }
          if (this._isFunction(callback)) callback(feld, info);
        });
      }

      if (info.Wochenenden.anzahl > this._MAX_WOCHENENDEN) {
        info.Wochenenden.className = possibleConflict;
      }
      if (bdTyp) {
        if (bdTyp.max && info.Bereitschaftsdienste.anzahl > bdTyp.max) {
          info.Bereitschaftsdienste.className = seriousConflict;
        } else if (bdTyp.min && info.Bereitschaftsdienste.anzahl > bdTyp.min) {
          info.Bereitschaftsdienste.className = possibleConflict;
        }
      }
    }
    for (const plan in info) {
      if (!info?.[plan]?.title?.push) continue;
      info[plan].title.push({ txt: `${plan}: (${info[plan].anzahl})` });
      info[plan]?.info &&
        Object.entries(info[plan].info).forEach(([key, labels]) => {
          let msg = '';
          labels.forEach((value, i) => {
            if (i % 4 === 0) msg += '\n';
            else msg += ' | ';
            msg += value;
          });
          info[plan].title.push({
            txt: `${key} (${labels.length}): ${msg}`
          });
        });
    }

    if (this._isFunction(callback)) callback(false, info);
    return info;
  }

  getRatingByDienstId(dienstId) {
    const ratingId = this.dienst_id_rating_id[dienstId] || 0;
    const rating = this?._ratings?.[ratingId];
    const max = this?._MAX_RATING || 0;
    const value = rating?.rating || 0;
    const percValue = max ? Math.ceil(100 * (1 - value / max)) : 100;
    return {
      rating,
      max,
      value,
      percValue
    };
  }

  getVerteilungsCodes(feld) {
    const bedarf = feld?.bedarf;
    const verteilungstyp = bedarf?.dienstverteilungstyp;
    const verteilungscode = bedarf?.verteilungscode;
    let vPrio = -1;
    let vUni = -1;
    switch (verteilungstyp?.name) {
      case 'prio':
        vPrio = verteilungscode;
        break;
      case 'uniform':
        vUni = verteilungscode;
        break;
    }
    return {
      verteilungstyp_priocode: vPrio,
      verteilungstyp_unicode: vUni
    };
  }

  /**
   * Liefert die Eigenschaften zur Berechnung des Scores für ein Feld
   * @param {Object} feld
   * @returns Object
   */
  getScoreProps(feld) {
    const dienstId = feld?.dienstId || 0;
    const tag = feld?.tag || '';
    const einteilungen = this.getEinteilungenNachTag(tag) || [];
    const konflikte = feld?.getKonflikteClassTitleAndInfo?.(this);
    const rating = this.getRatingByDienstId(dienstId).value;
    const einteilungenInDienst = this.getEinteilungenNachDienst(dienstId);
    const { verteilungstyp_priocode, verteilungstyp_unicode } =
      this.getVerteilungsCodes(feld);

    return {
      notActive: !this.aktivAm(tag),
      sonderstatus: this.abwesend,
      freigegebeneDienste: this?.idsFreigegebenerDienste?.length || 0,
      anzahlDiensteGesamt: this?._dienste?._length || 0,
      freigabenanzahl: this?.countFreigaben || 0,
      anzahlFreigabenGesamt: this?._freigabetypen?._length || 0,
      rating,
      MAX_RATING: this?._MAX_RATING || 0,
      prozentFreigaben: this.anteilFreigaben(dienstId),
      anwesend: !this.isAbwesend(feld, konflikte),
      wunsch: feld?.wunschSuccess?.(this, true),
      einteilungen,
      mehrfacheinteilungen: konflikte?.konflikte?.Mehrfacheinteilungen,
      inTeam: this.isInDienstTeam(dienstId, tag),
      ueberschneidungen: konflikte?.konflikte?.Ueberschneidungen,
      arbeitszeitIst: 0,
      arbeitszeitSoll: 0,
      arbeitszeitSaldo: 0,
      arbeitszeitBD: 0,
      arbeitszeitRD: 0,
      arbeitszeittypen: this?._konfliktArbeitszeittypen || [],
      arbeitszeittypenEnteilungen: {},
      wochenenden: 0,
      MAX_WOCHENENDEN: this?._MAX_WOCHENENDEN || 0,
      anzahlEinteilungen: 0,
      konflikte,
      rotationen: this.checkRotationen(feld),
      einteilungenInDienst,
      verteilungstyp_priocode,
      verteilungstyp_unicode,
      tag
    };
  }

  /**
   * Ermittelt den Score für das Feld für bestimmte Mitarbeiter
   * @param {Object} feld
   */
  getScore(feld) {
    const result = {
      value: 0,
      title: '',
      props: false
    };
    if (
      this?._scores?.getScore &&
      this?.einteilungen?.tage &&
      this._isObject(feld)
    ) {
      const props = this.getScoreProps(feld);
      const score = this._scores.getScore(props);
      if (score?.evaluatedScore) result.value = score.evaluatedScore;
      if (score?.title) result.title = score.title;
      result.props = props;
    }
    return result;
  }

  /**
   * Testet, ob die Rotationen für den Einteilungstag
   * zum Dienst passen.
   * @param {Object} feld
   * @returns Object
   */
  checkRotationen(feld) {
    const result = {
      dienst: feld?.dienst,
      date: feld?.date,
      fit: [],
      noFit: [],
      hasSonderroration: false
    };
    const themaIds = feld?.dienst?.thema_ids;
    this.rotationen?.forEach?.((r) => {
      if (!result.date?.isInRotationTimeInterval?.(r)) return false;
      // Rotationen passen zum Dienst, wenn sie ein gleiches Thema beinhalten
      const key = r?.hasThema?.(themaIds || []) ? 'fit' : 'noFit';
      result[key].push(r);
      if (r?.kontingent?.sonderrotation) result.hasSonderroration = true;
    });
    return result;
  }

  /**
   * Liefert die Informationen zu den Absprachen
   * @param {Object} date
   * @param {Object} dienst
   * @param {Object} bereich
   * @returns String
   */
  getAbsprachenInfos(date, dienst, bereich) {
    const arbeitszeitAbpsrachen = this.arbeitszeitAbpsrachen;
    const nichtEinteilenAbsprachen = this.nichtEinteilenAbsprachen;
    let arbeitszeit = '';
    arbeitszeitAbpsrachen?.forEach?.((absprache) => {
      if (!absprache?.showAbsprache?.(date)) return;
      if (!arbeitszeit) arbeitszeit += 'Abgesprochene Arbeitszeit\n';
      arbeitszeit += absprache.title;
    });
    const nichtEinteilen = nichtEinteilenAbsprachen?.find?.((absprache) =>
      absprache?.showAbsprache?.(date, dienst, bereich)
    )
      ? 'Es existiert eine nicht einteilen Absprache für den Dienst.'
      : '';
    let result = arbeitszeit;
    if (nichtEinteilen) {
      if (result) result += '\n';
      result += nichtEinteilen;
    }
    return result;
  }

  rotationPrioAm(tag = '') {
    const rotation = this.getPrioRotationAm(tag);
    const prio = parseInt(rotation?.prioritaet, 10);
    return Number.isNaN(prio) ? Infinity : prio;
  }

  static sortAlphabetically(mitarbeiter) {
    return (
      mitarbeiter?.sort?.((a, b) =>
        numericLocaleCompare(a.planname, b.planname)
      ) || []
    );
  }

  static sortByFunctionHelper(a, b) {
    const aFunktion = a?.funktion;
    const bFunktion = b?.funktion;
    const sort = (aFunktion?.prio || 0) - (bFunktion?.prio || 0);
    if (sort !== 0) return sort;
    return numericLocaleCompare(
      aFunktion?.planname || '',
      bFunktion?.planname || ''
    );
  }

  static sortByRotationHelper(a, b, tag = '') {
    const rotationA = a.getPrioRotationAm(tag);
    const rotationB = b.getPrioRotationAm(tag);
    const sort =
      (rotationA?.kontingentPosition || 0) -
      (rotationB?.kontingentPosition || 0);
    if (sort !== 0) return sort;
    return numericLocaleCompare(
      a.getPrioRotationAm(tag)?.name || '',
      b.getPrioRotationAm(tag)?.name || ''
    );
  }

  static sortByFunction(mitarbeiter) {
    return (
      mitarbeiter?.sort?.((a, b) => {
        const sort = Mitarbeiter.sortByFunctionHelper(a, b);
        if (sort !== 0) return sort;
        return numericLocaleCompare(a.planname, b.planname);
      }) || []
    );
  }

  static sortByRotation(mitarbeiter, tag = '') {
    return (
      mitarbeiter?.sort?.((a, b) => {
        const sort = Mitarbeiter.sortByRotationHelper(a, b, tag);
        if (sort !== 0) return sort;
        return numericLocaleCompare(a.planname, b.planname);
      }) || []
    );
  }

  static sortByRotationAndFunction(mitarbeiter, tag = '') {
    return (
      mitarbeiter?.sort?.((a, b) => {
        const sort = Mitarbeiter.sortByRotationHelper(a, b, tag);
        if (sort !== 0) sort;
        const fSort = Mitarbeiter.sortByFunctionHelper(a, b);
        if (fSort !== 0) return fSort;
        return numericLocaleCompare(a.planname, b.planname);
      }) || []
    );
  }

  static sortByFunctionAndRotation(mitarbeiter, tag = '') {
    return (
      mitarbeiter?.sort?.((a, b) => {
        const sort = Mitarbeiter.sortByFunctionHelper(a, b);
        if (sort !== 0) return sort;
        const rSort = Mitarbeiter.sortByRotationHelper(a, b, tag);
        if (rSort !== 0) return rSort;
        return numericLocaleCompare(a.planname, b.planname);
      }) || []
    );
  }
}

export default Mitarbeiter;
