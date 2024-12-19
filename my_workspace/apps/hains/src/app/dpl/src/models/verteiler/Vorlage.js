import { returnError } from "../../tools/hains";
import Basic from "../basic";

class VerteilerVorlage extends Basic{
  constructor(obj, parent, appModel){
    super(appModel);
    this._setObject("parent", parent);
    this._set("name", obj.name);
    this._setInteger("id", obj.id);
    this._setInteger("order", obj.order, true, 0);
    this._set("typ", obj.typ);
    this._set("beschreibung", obj.beschreibung);
    this._setArray("dienste_ids", obj?.dienste_ids || []);
    this._setArray("bereiche_ids", obj?.bereiche_ids || []);
    this._setArray("team_ids", obj?.team_ids || []);
    this._setInteger("dienstplan_path_id", obj?.dienstplan_path_id || 0);
    this._set("kommentar", obj?.kommentar || "");
  }

  get publishable() {
    return !!this.id;
  }

  /**
   * Liefert true, wenn die Userin Admin ist
   */
  get isAdmin(){
    return this?.parent?.isAdmin;
  }

  /**
   * Liefert die Beschreibung als Titel
   */
  get title() {
    if (this.id === 0) return "Neue Vorlage erstellen";
    return this.beschreibung || "";
  }

  /**
   * Liefert die Dienste zu den Dienst-Ids
   */
  get dienste() {
    return this._getIdsObject(['_dienste', '_po_dienste'], 'dienste_ids', false) || [];
  }

  /**
   * Liefert die Bereiche zu den bereich-Ids
   */
  get bereiche() {
    return this._getIdsObject('_bereiche', 'bereiche_ids', false) || [];
  }

  /**
   * Liefert die Teams zu den team-Ids
   */
  get teams() {
    return this._getIdsObject('_teams', 'team_ids', false) || [];
  }

  get dienstplanPath() {
    return this._getIdsObject('_dienstplanpfade', 'dienstplan_path_id', false);
  }

  /**
   * Testet ob die ID in dienste_ids, bereiche_ids oder team_ids vorhanden ist.
   * @param {String} name 
   * @param {Number} id 
   * @returns True, wenn die ID in dem Array vorhanden ist.
   */
  isInArray(name = "dienste_ids", id = 0) {
    const intId = parseInt(id, 10) || 0;
    return !!this[name]?.includes?.(intId);
  }

  /** 
   * @param {number} id 
   * @returns True, wenn die ID in bereiche_ids vorhanden ist.
   */
  includesBereichId(id) {
    return this.isInArray("bereiche_ids", id);
  }

  /** 
   * @param {number} id 
   * @returns True, wenn die ID in dienste_ids vorhanden ist.
   */
  includesDienstId(id) {
    return this.isInArray("dienste_ids", id);
  }

  eachPath(callback) {
    const arr = [];
    this._dienstplanpfade?._each?.((el) => {
      arr.push(callback(el));
    });
    return arr;
  }

  /**
   * Iteriert über alle Bereich-Tagesverteiler / Bereich-Wochenverteiler
   * @param {Function} callback 
   */
  eachBereichOrDienst(callback) {
    this?.parent?.parent?.eachBereichOrDienst?.(callback);
  }

  /**
   * Iteriert über die Teams und führt den Callback aus
   * @param {Function} callback 
   */
  eachTeam(callback) {
    this?._teams?._each?.(callback);
  }

  /**
   * Funktion die aufgerufen wird, sobald die Vorlage in den Settings ausgewählt wird.
   */
  fkt = () => {
    this?.parent?.setStartVorlage?.(this.id);
  };

  /**
   * Speichert die Vorlage
   * @param {String} name
   * @param {String} beschreibung
   * @param {Number} order
   * @param {Array} dienste_ids
   * @param {Array} bereiche_ids
   * @param {Number} dienstplan_path_id
   * @param {Array} team_ids
   */
  save(
    name,
    beschreibung,
    kommentar,
    order,
    dienste_ids,
    bereiche_ids,
    dienstplan_path_id,
    team_ids,
    setLoading = () => {},
    reset = () => {}
  ) {
    if(this?._hains?.api) {
      this._hains.api("update_verteiler_vorlagen", "post", {
        id: this.id,
        name,
        beschreibung,
        kommentar,
        order,
        dienste_ids,
        bereiche_ids,
        dienstplan_path_id,
        team_ids,
        typ: this.typ
      }).then((response) => {
        this.parent?.save?.(response);
        setLoading?.(() => false);
        reset?.();
      }, (err) => {
        setLoading?.(() => false);
        this.parent?.updateUi?.();
        returnError(err);
      });
    } else {
      setLoading?.(() => false);
      reset?.();
    }
  }

  remove(
    setLoading = () => {},
    reset = () => {}
  ) {
    if (!this.id === 0) return;
    if(this?._hains?.api) {
      this._hains.api("remove_verteiler_vorlagen", "post", {
        id: this.id
      }).then((response) => {
        this.parent?.remove?.(response);
        setLoading?.(() => false);
        reset?.();
      }, (err) => {
        setLoading?.(() => false);
        this.parent?.updateUi?.();
        returnError(err);
      });
    } else {
      setLoading?.(() => false);
      reset?.();
    }
  }
}

export default VerteilerVorlage;