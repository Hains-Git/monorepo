import Basic from "../basic";

/**
 * Erstellt ein Basic-Objekt mit den Funktionen für das Info-Tab (Popup)
 * 
 * Attribute: 
 * - infoFkt: Funktion, die die Infos für das Tab bereitstellt (wird aufgerufen, wenn das Tab geöffnet wird)
 * - infoEl: Element, dessen Infos angezeigt werden sollen
 * - infoTitle: Titel des Tabs,
 * - footInfo: Informationen, die im Tab-Fuß angezeigt werden sollen
 * 
 * Methoden:
 * - setInfoFkt: Setzt die Funktion, die die Infos bereitstellt
 * - setInfoEl: Setzt das Element, dessen Infos angezeigt werden sollen
 * - setInfoTitle: Setzt den Titel des Tabs
 * - setFootInfo: Setzt die Informationen des Tab-Fußes
 * - setInfo: Schließt das Tab
 * - setInfoPopUp: Öffnet das Tab und erstellt die Informationen, die angezeigt werden sollen
 * @class
 */
class InfoTab extends Basic {
  constructor(appModel = false) {
    super(appModel);
    this.setTabPosition(0);
    this.setInfoPopUp();
  }

   /**
   * Setzt das Attribut Position
   */
   setTabPosition(position = 0) {
    this._setInteger("tabPosition", position);
    this._update();
  }

  /**
   * Setzt das Element, von dem die Infos angezeigt werden
   * @param {Object} el
   */
  setInfoEl(el = false) {
    this._set("infoEl", el);
  }

  /**
   * Setzt die InfoFkt zurück
   */
  setInfo() {
    this.setInfoFkt(false);
  }

  /**
   * Erstellt Informationen zu dem Objekt
   * @param {Function} fkt
   */
  setInfoFkt(fkt = false) {
    this._set("infoFkt", fkt);
    this._update();
  }

  /**
   * Setzt den Titel der Komponente
   * @param {String} title
   */
  setInfoTitle(title = "") {
    this._set("infoTitle", title);
  }

  /**
   * Setzt die Informationen des Tab-Fußes
   * @param {String} info
   */
  setFootInfo(info = "") {
    this._set("footInfo", info);
  }

  /**
   * Führt ein Update des Popups aus
   */
  updatePopup(){
    this._setState({}, "popup");
  }

  /**
   * Erstellt die Infos zu einem Element
   * @param {String} title
   * @param {Object} el
   */
  setInfoPopUp(title = "", el = false, foot = "") {
    this.setInfoTitle(title);
    this.setInfoEl(el);
    this.setFootInfo(foot);
    const infoFkt = this?.infoEl 
      ? () => this?.infoEl?._info || false
      : false;
    this.setInfoFkt(infoFkt);
    this.updatePopup();
  }
}

export default InfoTab;