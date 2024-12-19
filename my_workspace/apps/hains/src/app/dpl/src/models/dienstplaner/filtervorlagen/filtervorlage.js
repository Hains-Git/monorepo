import { debounce, wait } from "../../../tools/debounce";
import { showConsole } from "../../../tools/flags";
import Basic from "../../basic";
import FilterGroup from "./filtergroup";
import FilterGroups from "./filtergroups";

class FilterVorlage extends Basic {
  constructor(obj, appModel = false) {
    super(appModel);
    this._setObject("groups", {});
    this._set("DEFAULT_PARAMS", obj);
    this._set("GRUPPEN", new FilterGroups(this, Object.keys(obj)));
    this.initFilter(obj);
    this.registerToPage();
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Setzt das parent-Attribut
   * @param {Object} parent
   */
  setParent(parent = false) {
    if (!parent) console.log("Vorlage hat kein Parent", parent, this);
    this._set("parent", parent);
  }

  /**
   * Rendered die Dienste aus Vorlage in dem Filter neu
   */
  rerenderDiensteAusVorlage() {
    this.getGroupsByNames(["diensteAusVorlage"], (group) => {
      if (group.rerenderDiensteAusVorlage) {
        group.rerenderDiensteAusVorlage();
      } else console.log("Rerender Dienste aus Vorlage existiert nicht!", group.rerenderDiensteAusVorlage);
    });
  }

  /**
   * Registriert alle FilterVorlagen auf der Seite, hier beim Dienstplaner
   */
  registerToPage() {
    const page = this._page;
    if (page) {
      page._pushToRegister(() => this.rerenderDiensteAusVorlage(), this._filterVorlagenRegisterKey);
    }
  }

  /**
   * Deaktiviert die Auswahl einer Filtergruppe für alle Elemente der Gruppe
   */
  uncheckAll() {
    this.getGroups((group) => {
      group.getFields((field) => {
        field.setChecked(false);
        group._update();
      });
    });

    // this.debouncedUpdateParent();
  }

  /**
   * Setzt die Filter-Parameter auf den default zurück
   */
  resetDefaultFilter() {
    this.setChecked(this.DEFAULT_PARAMS, false, true);
    // this.debouncedUpdateParent();
  }

  /**
   * Aktualisiert die Filter über das Eltern-Element
   */
  updateParent() {
    if (this?.parent?.updateFilter) this.parent.updateFilter();
  }

  /**
   * Führt das Update debounced aus und anschließend
   * ggf. einen callback.
   * @param {Function} callback
   */
  debouncedUpdateParent = debounce((callback) => {
    this.updateParent();
    if (this._isFunction(callback)) callback();
  }, wait);

  /**
   * @param {Function} callback
   * @param {Function} filter
   * @returns Array mit den Gruppen des Filters
   */
  getGroups(callback = false, filter = false) {
    const arr = [];
    const getCallBack = (group, key) => (callback ? callback(group, key) : group);
    const firstElements = ["uncheckAllButton", "resetDefaultParams"];
    if (this.groups) {
      for (const key in this.groups) {
        const group = this.groups[key];
        if (filter) {
          if (!filter(group, key)) continue;
        }
        firstElements.includes(key)
          ? arr.unshift(getCallBack(group, key))
          : arr.push(getCallBack(group, key));
      }
    } else console.log("Es existieren keine Gruppen für diese Vorlage", this.groups);

    return arr;
  }

  /**
   * @param {Array} names
   * @param {Function} callback
   * @returns Array mit den Gruppen-Namen
   */
  getGroupsByNames(names = [], callback = false) {
    const arr = [];
    names.forEach((name) => {
      const group = this?.groups?.[name];
      if (!group) return false;
      arr.push(callback ? callback(group, name) : group);
    });

    return arr;
  }

  /**
   * @param {Array} names
   * @param {Array} fieldIds
   * @param {Function} callback
   * @returns Liefert die Felder einer Gruppe
   */
  getFieldsByGroups(names = [], fieldIds = [], callback = false) {
    let fields = [];
    const groups = [];
    this.getGroupsByNames(names, (group) => {
      groups.push(group);
      fields = fields.concat(group.getFieldsByName(fieldIds, callback));
    });

    return {
      fields,
      groups
    };
  }

  /**
   * Iteriert über alle Gruppen der Vorlage
   * @param {Object} obj
   * @param {Function} callback
   */
  eachGRUPPEN(obj, callback = false) {
    this.GRUPPEN.getGroups(obj, (groupEl) => {
      if (callback) callback(groupEl);
    });
  }

  /**
   * Initialisiert die FilterVorlage
   * @param {Object} obj
   */
  initFilter(obj) {
    obj.vorlage = this;
    this.setParent(obj.parent);
    this.eachGRUPPEN(obj, (groupEl) => {
      const name = groupEl.name;
      this.groups[name] = new FilterGroup(groupEl, obj, this._appModel);
    });
    this._preventExtension();
  }

  /**
   * @param {Object} obj
   * Folgende Parameter werden verwendet:
   * wunsch, mitarbeiter, feld, dienst, date, funktion, team,
   * teams: { mitarbeiter, date, dienst }
   * @returns True, wenn alle Gruppen true zurückgeben
   */
  isInFilter(obj) {
    let result = false;
    for (const key in this.groups) {
      const group = this.groups[key];
      result = group.isInFilter(obj);
      if (!result) {
        break;
      }
    }
    return result;
  }

  /**
   * Führt in einer Gruppe setChecked aus
   * @param {Object} obj
   * @param {Boolean} updateFilterOptionsParent
   * @param {Boolean} updateFilterOption
   */
  setChecked(obj, updateFilterOptionsParent = false, updateFilterOption = true) {
    this.eachGRUPPEN(obj, (groupEl) => {
      const name = groupEl.name;
      this.groups[name].setChecked(groupEl, obj, updateFilterOptionsParent, updateFilterOption);
    });
  }

  /**
   * @returns Object mit den Parametern der FilterVorlage
   */
  getParams() {
    const result = {};
    for (const key in this.groups) {
      const group = this.groups[key];
      group.getParams(result);
    }

    return result;
  }

  /**
   * Speichert einen neuen Filter
   */
  save() {
    if (this?.parent?.setNewCustomFilter) {
      this.parent.setNewCustomFilter();
    }
  }
}

export default FilterVorlage;
