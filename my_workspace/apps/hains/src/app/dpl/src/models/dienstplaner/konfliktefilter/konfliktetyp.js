import Basic from "../../basic";

/**
 * Erstellt eine neue Instanz eines KonflikteTyp
 * @class
 */
class KonflikteTyp extends Basic {
  constructor(
    appModel = false,
    parent = false,
    id = 0,
    title = "",
    label = "",
    sort = 0,
    check = false
  ) {
    super(appModel);
    this._set("parent", parent);
    this._set("id", id);
    this._set("label", label);
    this._set("title", title);
    this._set("sort", sort);
    this.setCheck(check);
    this._preventExtension();
  }

  /**
   * Führt ein Update der UI durch
   */
  updateUI() {
    this._update();
    this?.parent?.debouncedUpdateMitarbeiter?.();
    this?._dienstplanTable?.updatePopup?.();
  }

  /**
   * ändert das check-Attribut
   * @param {Object} evt
   */
  handleChange = (evt) => {
    evt.stopPropagation();
    this.setCheck(!this.check);
    this.updateUI();
  };

  /**
   * Setzt das check-Attribut
   * @param {Boolean} check
   */
  setCheck(check = false) {
    this._set("check", check);
  }
}

export default KonflikteTyp;
