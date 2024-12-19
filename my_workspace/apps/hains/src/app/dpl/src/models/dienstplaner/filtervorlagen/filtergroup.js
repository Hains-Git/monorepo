import { showConsole } from "../../../tools/flags";
import FilterGroupOptionen from "./filtergroupOptionen";
import FilterOption from "./filteroption";

class FilterGroup extends FilterGroupOptionen {
  constructor(groupEl, obj, appModel = false) {
    super(appModel);
    this.init(groupEl, obj);
    this._preventExtension();
  }

  /**
   * Liefert den Parent aus der Vorlage
   */
  get parent() {
    return this?.vorlage?.parent || false;
  }

  /**
   * Liefert alle Gruppen aus der Vorlage
   */
  get GRUPPEN() {
    return this?.vorlage?.GRUPPEN || {};
  }

  /**
   * Entfernt den Key aus den filterKeys oder fügt ihn hinzu
   * @param {Object} filterOption
   */
  updateFilterKeys(filterOption) {
    const key = filterOption?.key;
    if (filterOption?.button || !key) return;
    if (filterOption?.checked) {
      if (!this.filterKeys.includes(key)) {
        this.filterKeys.push(key);
      }
    } else {
      const i = this.filterKeys.indexOf(key);
      if (i >= 0) this.filterKeys.splice(i, 1);
    }
  }

  /**
   * Setzt das hinweis Attribut
   * @param {Array} txt
   */
  setHinweis(txt = []) {
    this._set("hinweis", txt);
  }

  /**
   * Setzt das showAlways Attribut
   * @param {Boolean} show
   */
  setShowAlways(show = false) {
    this._set("showAlways", show);
  }

  /**
   * Setzt das handleClick Attribut
   * @param {Function} callback
   */
  setHandleClick(callback = false) {
    this._set("handleClick", callback);
  }

  /**
   * Fügt dem Hinweis weitere Elemente hinzu
   * @param {String} txt
   */
  addHinweis(txt = "") {
    if (!this.hinweis.includes(txt)) this.hinweis.push(txt);
  }

  /**
   *
   * @param {String} key
   * @param {String|Nunmber} id
   * @param {String} label
   * @param {String} title
   * @param {Boolean} checked
   * @param {Function} bedingung
   * @param {Number|String} elId
   * @param {function} callback
   * @param {Boolean} button
   */
  addFilter(
    key = "",
    id = "",
    label = "",
    title = "",
    checked = true,
    bedingung = () => {},
    elId = false,
    callback = false,
    button = false
  ) {
    this.fields[key] = new FilterOption(
      this?._appModel,
      key,
      id,
      label,
      title,
      checked,
      this,
      bedingung,
      elId,
      callback,
      button
    );
  }

  /**
   * Liefert ein Array mit den enthaltenen Felder (Optionen)
   * @param {Function} callback
   * @param {Function} filter
   * @returns array
   */
  getFields(callback = false, filter = false) {
    const arr = [];
    if (this._isObject(this.fields)) {
      for (const key in this.fields) {
        const field = this.fields[key];
        if (filter) {
          if (!filter(field, key)) continue;
        }
        arr.push(callback ? callback(field, key) : field);
      }
    }

    return arr;
  }

  /**
   * Liefert die Felder mit entsprechenden Namen
   * @param {Array} names
   * @param {Function} callback
   * @returns array
   */
  getFieldsByName(names = [], callback = false) {
    const arr = [];
    names.forEach((name) => {
      const field = this?.fields?.[name];
      if (!field) return false;

      arr.push(callback ? callback(field) : field);
    });

    return arr;
  }

  /**
   * Fügt den Results die Parameter dieser Gruppe hinzu
   * @param {Object} result
   * @returns object
   */
  getParams(result = {}) {
    // Suche Parameter nur, wenn das Feld als einstellbare Vorlage betrachtet wird
    if (this.handleClick) return result;

    const arr = [];
    let fieldKey = false;
    this.getFields((field) => {
      const hasElId = field.elId !== false;
      if (hasElId) {
        if (field.checked) arr.push(field.elId);
        if (!fieldKey) fieldKey = field.id.split("_")[0];
      } else if (!hasElId) result[field.id] = field.checked;
    }, false, false);

    if (fieldKey) result[fieldKey] = arr;

    return result;
  }

  /**
  * Da die Dienstplan-Vorlage sich im laufenden Betrieb ändern kann,
  * müssen die Felder ggf angepasst werden.
  * Dafür wird getestet, ob sich die Dienstplan-Vorlage geändert hat und
  * dann werden die Dienst-Felder mit den aktuellen Parametern und
  * den Diensten aus der aktuellen Dienstplan-Vorlage neu erstellt
  * Falls inVorlageDienste == checked -> Check diensteAusVorlage
  */
  rerenderDiensteAusVorlage() {
    const isGruppe = this.id === "diensteAusVorlage";
    const newVorlage = this?._vorlage !== this.dienstplanVorlage;
    if (isGruppe && newVorlage) {
      // Erstellt die Felder neu, mit den alten checked als Parameter
      const obj = this.getParams();
      this.fkt(this, obj);
      this.setDienstplanVorlage(this._vorlage);
      this.resetDiensteAusVorlageDienste();
    }
  }

  /**
   * Durchsucht eine Gruppe nach dem Key bestimmter Felder, anhand deren Index
   * @param {String} groupId
   * @param {Array} index
   * @returns array
   */
  getFieldKeysByIndex(groupId = false, index = []) {
    const fieldKeys = [];
    const gruppen = this.GRUPPEN;
    const group = gruppen?.[groupId];
    const objKeys = group?.objKeys;
    if (objKeys && groupId) {
      objKeys.forEach((obj, i) => {
        const fieldKey = obj.key;
        if (index.includes(i) && !fieldKeys.includes(fieldKey)) {
          fieldKeys.push(fieldKey);
        }
      });
    }

    return fieldKeys;
  }

  /**
   * Setzt das id Attribut
   * @param {String} id
   */
  setId(id = "") {
    this._set("id", id);
  }

  /**
   * Setzt das label Attribut
   * @param {String} label
   */
  setLabel(label = "") {
    this._set("label", label);
  }

  /**
   * Setzt das fields Attribut
   * @param {Object} fields
   */
  setFields(fields = {}) {
    this._setObject("fields", fields);
    this._setArray("filterKeys", []);
  }

  /**
   * Setzt das title Attribut
   * @param {String} title
   */
  setTitle(title = "") {
    this._set("title", title);
  }

  /**
   * Setzt das sort Attribut
   * @param {Boolean} sort
   */
  setSort(sort = false) {
    this._set("sort", sort);
  }

  /**
   * Setzt das vorlage Attribut und warnt, wenn es unbesetzt ist
   * @param {Object} vorlage
   */
  setVorlage(vorlage = false) {
    if (!vorlage) console.log("Vorlage fehlt!", vorlage, this.name);
    this._set("vorlage", vorlage);
  }

  /**
   * Setzt das dienstplanVorlage Attribut
   * @param {Object} vorlage
   */
  setDienstplanVorlage(vorlage = false) {
    this._set("dienstplanVorlage", vorlage);
  }

  /**
   * @param {Array} names
   * @param {Function} callback
   * @returns Liefert eine Gruppe anhand ihres Namens
   */
  getGroupsByNames(names = [], callback = false) {
    return this?.vorlage?.getGroupsByNames?.(names, callback);
  }

  /**
   * @param {Array} names
   * @param {Array} fields
   * @param {Function} callback
   * @returns Liefert Felder bestimmter Gruppen
   */
  getFieldsByGroups(names = [], fields = [], callback = false) {
    return this?.vorlage?.getFieldsByGroups?.(names, fields, callback);
  }

  /**
   * Führt handleCheck eines Feldes aus, wenn das Feld existiert und kein button ist
   * @param {Object} field
   * @param {Boolean} check
   * @param {Boolean} updateFieldsParent
   * @param {Boolean} updateField
   */
  checkField(field = false, check = false, updateFieldsParent = false, updateField = true) {
    if (field && !field.button) field.handleCheck(check, updateFieldsParent, updateField);
  }

  /**
   * Setzt die checks der entsprechenden Felder.
   * Obj erwartet keys aus den GRUPPEN.
   * @param {Object} groupEl
   * @param {Object} obj
   * @param {Boolean} updateFilterOptionsParent
   * @param {Boolean} updateFilterOption
   */
  setChecked(groupEl, obj, updateFilterOptionsParent = false, updateFilterOption = true) {
    const keys = groupEl && groupEl.objKeys;
    if (!keys) {
      console.log("Es existieren keine Keys für diese Gruppe", groupEl, keys, this);
      return;
    }

    /*
      Geht durch jedes Feld der Gruppe und setzt
      den übergeben Parameter aus obj
      Falls kein Parameter für das Feld übergeben wurde, bleibt der Wert unangetastet
    */
    keys.forEach((el) => {
      const key = el.key;
      const check = obj[key];
      // Nur für existierende keys den Check ausführen
      if (check === undefined) return false;
      // Falls es eine Gruppe aus dem Datenmodell ist, wird ein Array mit IDs übergeben
      if (this._isArray(check)) {
        for (const id in this.fields) {
          const field = this.fields[id];
          // Erwartet, dass die IDs als Integer in dem Array stehen
          // bsp. obj = {funktionen: [1, 2, 3]}
          // Setzt alle Felder auf checked = false, wenn sie nicht in dem Array vorkommen
          this.checkField(
            field,
            check.includes(parseInt(id, 10)),
            updateFilterOptionsParent,
            updateFilterOption
          );
        }
      } else {
        const field = this.fields[key];
        if (field) this.checkField(field, check, updateFilterOptionsParent, updateFilterOption);
        else console.log("Feld existiert nicht!", this, this.fields, key);
      }
    });
  }

  /**
   * Initialisiert die Gruppe
   * @param {Object} groupEl
   * @param {Object} obj
   */
  init(groupEl, obj) {
    if (!groupEl || !obj) {
      console.log("Das GroupElement oder das Objekt fehlt.", groupEl, obj);
    }
    this.setHinweis();
    this.setFields();
    this.setShowAlways();
    this.setId(groupEl.name);
    this.setLabel(groupEl.label);
    this.setTitle(groupEl.title);
    this.setSort(groupEl.sort);
    this.setHandleClick();
    this.setDienstplanVorlage(this?._vorlage);
    const { vorlage } = obj;
    this.setVorlage(vorlage);
    groupEl.fkt(this, obj);
  }

  /**
   * Führt setChecked(true) eines Feldes aus
   * @param {Object} field
   */
  setFieldCheck = (field) => {
    field.setChecked(true);
  };

  /**
   * Funktionen um gewisse Filter zu setzen, wenn bestimmte andere Filter aktiviert wurden.
   * @param {Boolean} check
   */
  setDiensteAusVorlageTeam(check) {
    return this.setAusVorlage(check, () => {
      const fields = [];
      this?._dienste?._each?.((d) => {
        if (d?.isInVorlageTeam) fields.push(d);
      });
      return fields;
    }, ["dienste", "diensteAusVorlage"], "Kann durch Vorlage (Team) vorbelegt sein.");
  }

  /**
   * Funktionen um gewisse Filter zu setzen, wenn bestimmte andere Filter aktiviert wurden.
   * @param {Boolean} check
   */
  setTeamsAusVorlageTeam(check) {
    return this.setAusVorlage(check, () => {
      const team = this._team;
      const fields = [];
      if (team) fields.push(team.id);
      return fields;
    }, ["teams"], "Kann durch Vorlage (Team) vorbelegt sein.");
  }

  /**
   * Funktionen um gewisse Filter zu setzen, wenn bestimmte andere Filter aktiviert wurden.
   * @param {Boolean} check
   */
  setDiensteAusVorlageDienste(check) {
    return this.setAusVorlage(
      check,
      () => this._vorlageDiensteIds,
      ["dienste", "diensteAusVorlage"],
      "Kann durch Vorlage (Dienste) vorbelegt sein."
    );
  }

  /**
   * Funktionen um gewisse Filter zu setzen, wenn bestimmte andere Filter aktiviert wurden.
   * @param {Boolean} check
   */
  setFunktionenAusVorlageFunktionen(check) {
    return this.setAusVorlage(
      check,
      () => this._vorlageFunktionenIds,
      ["funktionen"],
      "Kann durch Vorlage (Funktion) vorbelegt sein."
    );
  }

  /**
   * Funktionen um gewisse Filter zu setzen, wenn bestimmte andere Filter aktiviert wurden.
   * @param {Boolean} check
   */
  setMitarbeiterAusVorlageFunktionen(check) {
    return this.setAusVorlage(check, () => {
      const mIds = [];
      if (this?._vorlageFunktionenIds?.length) {
        this?._mitarbeiter?._each?.((m) => {
          if (this._vorlageFunktionenIds.includes(m.funktion_id)) mIds.push(m.id);
        });
      }
      return mIds;
    }, ["mitarbeiter", "aktiveMitarbeiter"], "Kann durch Vorlage (Funktion) vorbelegt sein.");
  }

  /**
   * Setzt diensteAusVorlage-Filter zurück
   */
  resetDiensteAusVorlageDienste() {
    this.callOnCheckedField(2, [0], () => this.setDiensteAusVorlageDienste(true));
    this.callOnCheckedField(1, [0], () => this.setDiensteAusVorlageTeam(true));
  }

  /**
   * Testet, ob der Filter auf das Objekt passt.
   * @param {Object} obj
   * @returns true, wenn eines der Felder true zurückgibt, getestet werden nur ausgewählte Felder.
   */
  isInFilter(obj) {
    const l = this.filterKeys?.length || 0;
    let j = 0;
    for (let i = 0; i < l; i++) {
      const key = this.filterKeys[i];
      const {
        checked = false,
        button = true,
        bedingung = false
      } = this.fields[key] || {};
      if (checked && bedingung && !button) {
        j++;
        const result = bedingung(obj);
        if (result) return true;
      }
    }
    return !j;
  }

  /**
   * Setzt alle Felder einer Gruppe auf check
   * @param {Number|String} id
   * @param {Boolean} check
   * @param {String} key
   */
  setAll(id, check = true, key = "") {
    const obj = this?.[key];
    const arr = [0];
    if (obj?._each) obj._each((el) => arr.push(el.id));
    else if (obj?.forEach) obj.forEach((el) => arr.push(el.id));
    else {
      console.log("Womöglich stimmt der key nicht!", key, obj, obj._each);
      return false;
    }

    this.getFieldsByGroups([id], arr, (field) => {
      field.handleCheck(check, false, false);
    });

    // this.updateParent();
    this._update();
  }

  /**
   * Führt UpdateParent aus der Filter-Vorlage aus
   */
  updateParent() {
    this?.vorlage?.debouncedUpdateParent?.();
  }

  /**
   * Führt uncheckAll aus der Filter-Vorlage aus
   */
  uncheckAll() {
    this?.vorlage?.uncheckAll?.();
  }

  /**
   * Führt resetDefaultFilter aus der Filter-Vorlage aus
   */
  resetDefaultFilter() {
    this?.vorlage?.resetDefaultFilter?.();
  }

  /**
   * Setzt bestimmte Felder, wenn eine Gruppe bzg. auf die Dienstplan-Vorlage aktiv ist.
   * @param {Boolean} check
   * @param {Function} callback
   * @param {Array} groups
   * @param {Boolean|String} hinweis
   */
  setAusVorlage(check = false, callback = () => [], groups = [], hinweis = false) {
    // Liefert true, wenn aus der aktuellen Gruppe mindestens 1 Feld geupdated wurde
    if (!check) return;
    const fields = callback();
    if (!fields?.length) return;
    // Setzt das entsprechende Feld auf true und fügt der Gruppe den Hinweis hinzu
    this.getFieldsByGroups(groups, fields, (field) => {
      // Feld wird nur geupdated, wenn es vorher unchecked war
      field.handleCheck(check, false, false);
      const group = field.group;
      if (group && !group.hinweis) group.addHinweis(hinweis);
    });
  }

  /**
   * @param {Number} id
   * @returns True, wenn eine ID-doppelt vorkommt.
   */
  isDouble(id = "") {
    let has = false;
    let name = "";
    this.getGroupsByNames([id], (group) => {
      name = group.name;
      has = true;
    });
    if (showConsole && has) console.log("Es sollte nur eines von beidem geben", this.id, name, id, this);

    return has;
  }

  /**
  * Falls bestimmte Felder aus bestimmten Gruppen checked sind, soll der Callback aufgerufen werden.
  * @param {String} groupId
  * @param {Array} index
  * @param {Function} callback
  */
  callOnCheckedField(groupId = false, index = [], callback = () => {}) {
    if (groupId) {
      this.getFieldsByGroups([groupId], this.getFieldKeysByIndex(groupId, index), (field) => {
        if (field.checked) {
          callback();
        }
      });
    } else console.log("Falsche GroupId", groupId);
  }
}

export default FilterGroup;
