import Basic from "../basic";
import VerteilerVorlage from "./Vorlage";

class VerteilerVorlagen extends Basic{
  constructor(parent, appModel){
    super(appModel);
    this._setObject("parent", parent);
    this.setStartVorlage(0);
    this.initVorlagen();
  }

  /**
   * True, wenn die Userin Admin ist
   */
  get isAdmin(){
    return this._user?.isAdmin;
  }

  /**
   * Liefert den Typ des Verteilers
   */
  get type() {
    return this.parent?.pageName || "tagesverteiler";
  }

  /**
   * @returns den Index der ausgewählten Vorlage
   */
  get vorlageIndex() {
    const index = this.vorlagen.findIndex((vorlage) => vorlage.id === this.startVorlage);
    return index >= 0 ? index : 0;
  }

  /**
   * @returns {Object} Die ausgewählte Vorlage
   */
  get vorlage(){
    return this.vorlagen[this.vorlageIndex] || false;
  }

  /**
   * Führt ein Update des User Interfaces durch
   */
  updateUi() {
    this._update();
  }

  /**
   * Setzt die ID der Startvorlage
   * @param {Number} id 
   */
  setStartVorlage(id = 0){
    this._setInteger("startVorlage", id);
    this?.parent?.grid?.setCssProperties?.();
    this.updateUi();
  }

  /**
   * Erstellt eine VerteilerVorlage
   * @param {Object} vorlage 
   * @returns Object
   */
  createVorlage(vorlage){
    return new VerteilerVorlage(vorlage, this, this._appModel);
  };

  setVorlagen(vorlagen = []) {
    this._setArray("vorlagen", vorlagen);
    this.sortVorlagen();
  }

  /**
   * Initialisiert die Vorlagen der Nutzerin
   */
  initVorlagen() {
    const vorlagen = [];
    if (this?._user?.isAdmin) {
      vorlagen.push(this.createVorlage({
        id: 0,
        name: "Neue Vorlage",
        beschreibung: "",
        typ: this.type,
        order: 0,
        dienste_ids: [],
        bereiche_ids: [],
        team_ids: []
      }));
    }
    this?.parent?.data?.vorlagen?.[this.type]?.forEach?.((vorlage) => {
      vorlagen.push(this.createVorlage(vorlage));
    });
    this.setVorlagen(vorlagen);
  }

  /**
   * Sortiert die Vorlagen nach der Reihenfolge.
   * Die Vorlage mit der ID 0 wird immer an letzter Stelle stehen.
   */
  sortVorlagen() {
    this._setArray("vorlagen", this.vorlagen.sort((a, b) => {
      if (b.id === 0) return -1;
      if (a.id === 0) return 1;
      return a.order - b.order;
    }));
    this.vorlagen?.[0]?.fkt?.();
  }

  /**
   * Ergänzt die Vorlage in den vorlagen 
   * @param {Object} vorlage
   */
  save(vorlage) {
    if (vorlage?.id) {
      const vorlagen = [...this.vorlagen];
      const index = vorlagen.findIndex((v) => v.id === vorlage.id);
      if (index >= 0) {
        vorlagen[index] = this.createVorlage(vorlage);
      } else {
        vorlagen.push(this.createVorlage(vorlage));
      }
      this.setVorlagen(vorlagen);
    } else {
      alert(typeof vorlage?.data === "string" 
        ? vorlage.data 
        : "Die Vorlage konnte nicht gespeichert werden.");
    }
    this.updateUi();
  }

  /**
   * Ergänzt die Vorlage in den vorlagen 
   * @param {Object} data
   */
  remove(data) {
    const id = parseInt(data?.id, 10) || 0;
    if (id > 0) {
      this?._pageData?.layouts?.remove?.(id);
      this.setVorlagen(this.vorlagen.filter((v) => v.id !== id));
    } else {
      alert(typeof data?.data === "string" 
        ? data.data 
        : "Die Vorlage konnte nicht gespeichert werden.");
    }
    this.updateUi();
  }
}

export default VerteilerVorlagen;