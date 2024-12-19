import { debounce, wait } from "../../../tools/debounce";
import Basic from "../../basic";

class FilterOption extends Basic {
  constructor(
    appModel = false,
    keyInGroup = "",
    id = "",
    label = "",
    title = "",
    checked = true,
    group = false,
    bedingung = () => {},
    elId = false,
    callback = false,
    button = false
  ) {
    super(appModel);
    this.setGroup(group);
    this._set("key", keyInGroup);
    this._set("id", id);
    this._set("label", label);
    this._set("title", title);
    this._set("elId", elId);
    this._set("button", button);
    this.setChecked(checked);
    this._set("handleCheck", (check = false, updateParent = false, updateMe = true) => {
      if (!this.button) this.setChecked(check);
      if (callback) callback(check);
      if (updateMe) this._update();
      // if (updateParent) this.updateParent();
    });
    this._set("bedingung", bedingung);
    this._preventExtension();
  }

  /**
   * Gibt die Vorlage aus der Gruppe zurück
   */
  get vorlage() {
    return this?.group?.vorlage || false;
  }

  /**
   * Führt die Funktion updateParent des Parents aus
   */
  updateParent() {
    this?.vorlage?.debouncedUpdateParent?.();
  }

  /**
   * Debounced handleCheck
   */
  debouncedHandleCheck = debounce((check = false, updateParent = false, updateMe = true) => {
    this.handleCheck(check, updateParent, updateMe);
  }, wait);

  /**
   * Setzt das Group-Attribut
   * @param {Object} group
   */
  setGroup(group = false) {
    if (!group) console.log("Gruppe fehlt!", group, this);
    this._set("group", group);
  }

  /**
   * Setzt das checked-Attribut
   * @param {Boolean} check
   */
  setChecked(check = false) {
    this._set("checked", check);
    this?.group?.updateFilterKeys?.(this);
  }
}

export default FilterOption;
