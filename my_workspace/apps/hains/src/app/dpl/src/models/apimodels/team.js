import { dateRegEx, getWeek } from '../../tools/dates';
import { getPrioRotationHelper } from '../../tools/helper';
import Basic from '../basic';

/**
 * Klasse um ein Team-Objekt zu erstellen.
 * Mitarbeiter, Dienste und Kontingente sind unterschiedlichen Teams zugeordnet.
 * @class
 */
class Team extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger('id', obj.id);
    this._set('name', obj.name);
    this._set('default', obj.default);
    this._set('verteiler_default', obj.verteiler_default);
    this._setInteger('kostenstelle_id', obj.kostenstelle_id);
    this._setArray(
      'funktionen_ids',
      obj?.team_funktions ? obj?.team_funktions : obj.funktionen_ids
    );
    this._setArray(
      'dienste_ids',
      obj?.po_diensts ? obj?.po_diensts : obj.dienste_ids
    );
    this._setArray(
      'kontingente_ids',
      obj?.kontingents ? obj?.kontingents : obj.kontingente_ids
    );
    this._setInteger('krank_puffer', obj.krank_puffer);
    this.initTeamKwKrankPuffers(obj.team_kw_krankpuffers);
    this.resetAttributes();
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert ein Array mit allen zugegörigen Funktionen
   */
  get funktionen() {
    const result = [];
    this?.funktionen_ids?.forEach?.((fId) => {
      const f = this?._funktionen[fId];
      if (f) result.push(f);
    });
    return result;
  }

  /**
   * Liefert die zugehörige Kostenstelle
   */
  get kostenstelle() {
    return this._getIdsObject('_kostenstellen', 'kostenstelle_id', true);
  }

  /**
   * Liefert das Default-Objekt für die Team-Bedarfe
   */
  get defaultBedarf() {
    return {
      Bedarf: 0,
      Min: 0,
      Opt: 0,
      Einteilung: 0,
      Krank: 0,
      Urlaub: 0,
      Sonstig: 0,
      Verfuegbar: 0,
      label: this.name,
      ID: this.id,
      acceptedFunktionen: this.funktionen_ids,
      default: this.default
    };
  }

  initTeamKwKrankPuffers(teamKwKrankPuffers = false) {
    this._setObject('team_kw_krankpuffers', {});
    if (this._isArray(teamKwKrankPuffers)) {
      teamKwKrankPuffers.forEach((kwKrankPuffer) => {
        const kw = parseInt(kwKrankPuffer?.kw, 10);
        const puffer = parseInt(kwKrankPuffer?.puffer, 10);
        // KW und Puffer müssen positiv sein
        if (
          !Number.isNaN(kw) &&
          !Number.isNaN(puffer) &&
          kw > 0 &&
          puffer >= 0
        ) {
          this.team_kw_krankpuffers[kw] = puffer;
        }
      });
    }
  }

  /**
   * Liefert den passenden Krankpuffer zu einem Tag
   * @param {String} day
   * @returns Number
   */
  getKrankPuffer(day = false) {
    const dayStr = day?.toString?.() || '';
    if (dateRegEx.test(dayStr)) {
      const kw = getWeek(dayStr);
      if (this.team_kw_krankpuffers[kw] !== undefined)
        return this.team_kw_krankpuffers[kw];
    }
    return this.krank_puffer;
  }

  /**
   * Setzt die Attribute zurück
   */
  resetAttributes() {
    this._set('mitarbeiterNachTag', {});
    this._set('mitarbeiter', []);
  }

  /**
   * Fügt eine Id in das zu name enstprechende Array ein
   * @param {String} name Key des Atrributes
   * @param {String|Number} id einzutragende Id
   */
  add(name, id = false) {
    const thisId = parseInt(id, 10);
    const isNotValid =
      Number.isNaN(thisId) || typeof name !== 'string' || !this[name];
    if (isNotValid) {
      console.log(
        'Ungültiger Attributname oder ungültige ID',
        id,
        thisId,
        name
      );
      return;
    }
    if (this[name].includes(thisId)) return;

    this[name].push(thisId);
  }

  /**
   * Entfertn eine Id aus dem zu name entsprechenden Array
   * @param {String} name Key des Atrributes
   * @param {String|Number} id einzutragende Id
   */
  remove(name, id = false) {
    const thisId = parseInt(id, 10);
    const isNotValid =
      Number.isNaN(thisId) || typeof name !== 'string' || !this[name];
    if (isNotValid) {
      console.log(
        'Ungültiger Attributname oder ungültige ID',
        id,
        thisId,
        name
      );
      return;
    }

    const i = this[name].indexOf(thisId);
    if (i >= 0) this[name].splice(i, 1);
  }

  /**
   * Hinzufügen der ID eines Mitarbeiters zu dem mitarbeiter-Array.
   * Und Erweitern des mitarbeiterNachTag-Objektes um den Tag und die MitarbeiterId
   * {mitarbeiterId: {tag: [rotationId]}}
   * @param {String} tag
   * @param {String|Number} mitarbeiterId
   */
  addMitarbeiter(tag = false, mitarbeiterId = false, rId = 0) {
    const thisId = parseInt(mitarbeiterId, 10);
    const rotId = parseInt(rId, 10);
    const mitarbeiter = this.mitarbeiterNachTag;
    if (typeof tag !== 'string' || Number.isNaN(thisId)) {
      console.log('Ungültiger tag oder ungültige ID', tag, thisId);
      return;
    }
    if (!mitarbeiter[thisId]) mitarbeiter[thisId] = {};
    if (!mitarbeiter[thisId][tag]) mitarbeiter[thisId][tag] = [];
    if (!mitarbeiter[thisId][tag].includes(rotId))
      mitarbeiter[thisId][tag].push(rotId);
    this.add('mitarbeiter', thisId);
  }

  /**
   * Entfernen der ID eines Mitarbeiters aus dem mitarbeiter-Array.
   * Entfernen der ID aus dem mitarbeiterNachTag-Objekt und den tag-key löschen,
   * wenn das entsprechende Array leer ist.
   * @param {String} tag
   * @param {String|Number} mitarbeiterId
   */
  removeMitarbeiter(tag = false, mitarbeiterId = false, rId = 0) {
    const thisId = parseInt(mitarbeiterId, 10);
    const rotId = parseInt(rId, 10);
    const mitarbeiter = this.mitarbeiterNachTag;
    if (typeof tag !== 'string' || Number.isNaN(thisId)) {
      console.log('Ungültiger tag oder ungültige ID', tag, thisId);
      return;
    }

    if (mitarbeiter[thisId]?.[tag]) {
      const i = mitarbeiter[thisId][tag].indexOf(rotId);
      if (i >= 0) {
        mitarbeiter[thisId][tag].splice(i, 1);
      }
      if (!mitarbeiter[thisId][tag].length) {
        delete this.mitarbeiterNachTag[thisId][tag];
        if (!Object.keys(this.mitarbeiterNachTag[thisId]).length) {
          delete this.mitarbeiterNachTag[thisId];
          this.remove('mitarbeiter', mitarbeiterId);
        }
      }
    }
  }

  /**
   * True, wenn DienstId im dienste-Array
   * @param {String|Number} dienstId
   * @returns true/false
   */
  hasDienst(dienstId = false) {
    const thisId = parseInt(dienstId, 10);
    return this.dienste_ids.includes(thisId);
  }

  /**
   * True, wenn KontingentId im kontingente-Array
   * @param {String|Number} kontingentId
   * @returns true/false
   */
  hasKontingent(kontingentId = false) {
    const thisId = parseInt(kontingentId, 10);
    return this.kontingente_ids.includes(thisId);
  }

  /**
   * Testet, ob die Mitarbeiter-Funktion das Team enthält
   * @param {Number} mId
   * @returns Wenn Mitarbeiter-Funktion-Team = Team
   */
  isMitarbeitersFunktionsTeam(mId) {
    const m = this?._mitarbeiter?.[mId] || this?._mitarbeiters?.[mId];
    const team = m?.funktionsTeam;
    return team ? team.id === this.id : false;
  }

  /**
   * @param {Number} mId
   * @param {String} tag
   * @returns True, wenn Keine Rotationen existieren und Mitarbeiter-Funktion-Team = Team
   */
  isMitarbeiterFunktionInTeamCheckRotationen(mId, tag = false) {
    const m = this?._mitarbeiter?.[mId] || this?._mitarbeiters?.[mId];
    return !m?.hasRotationenAm?.(tag) && this.isMitarbeitersFunktionsTeam(mId);
  }

  getRotationenIdsAm(tag = false, mId = false) {
    const thisId = parseInt(mId, 10);
    return this.mitarbeiterNachTag?.[thisId]?.[tag] || [];
  }

  /**
   * True, wenn MitarbeiterId im Array des entsprechenden Tages aus dem mitarbeiterNachTag-Objekt.
   * @param {String|Number} mId
   * @param {String} tag
   * @returns {Boolean} true/false
   */
  hasMitarbeiterTag(mId = false, tag = false) {
    let result = this.isMitarbeiterFunktionInTeamCheckRotationen(mId, tag);
    const thisId = parseInt(mId, 10);
    if (typeof tag !== 'string' || Number.isNaN(thisId)) {
      console.log('Ungültiger tag oder ungültige ID', tag, thisId);
      return result;
    }
    const mitarbeiter = this.mitarbeiterNachTag?.[thisId];
    if (!result && mitarbeiter) result = !!mitarbeiter?.[tag]?.length;
    return result;
  }

  rotationPrio(tag = false, mId = false) {
    const rotationenIds = this.getRotationenIdsAm(tag, mId);
    let prio = Infinity;
    const rotation = getPrioRotationHelper(this._rotationen, rotationenIds);
    const rPrio = parseInt(rotation?.prioritaet, 10);
    if (!Number.isNaN(rPrio)) prio = rPrio;
    return prio;
  }

  /**
   * True, wenn MitarbeiterId im mitarbeiter-Array
   * @param {String|Number} mId
   * @returns {Boolean} true/false
   */
  hasMitarbeiter(mId = false) {
    const thisId = parseInt(mId, 10);
    return (
      this.mitarbeiter.includes(thisId) ||
      this.isMitarbeiterFunktionInTeamCheckRotationen(mId, false)
    );
  }
}

export default Team;
