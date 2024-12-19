import Basic from "../basic";

/**
 * Klasse um ein Funktion-Objekt zu erstellen.
 * @class
 */
class Funktion extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("planname", obj.planname);
    this._set("beschreibung", obj.beschreibung);
    this._set("color", obj.color);
    this._set("prio", obj.prio);
    this._set("id", obj.id);
    this._set("name", obj.name);
    this._setInteger("team_id", obj.team_id);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert das zugehörige Team
   */
  get team() {
    return this._getIdsObject("_teams", "team_id", true);
  }

  /**
   * Liefert den Namen des Teams
   */
  get teamName() {
    return this.team ? this.team.name : "Kein Team";
  }

  /**
   * Liefet die Info zu der Funktion
   */
  get _info() {
    const info = {
      value: {
        id: { value: this.id.toString(), label: "ID" },
        planname: { value: this.planname, label: "Planname" },
        color: { value: this.color || "", label: "Farbe" },
        prio: { value: this.prio.toString(), label: "Position" },
        team: { value: this.teamName, label: "Team" }
      },
      label: this.name
    };
    if (this.beschreibung && this.beschreibung.trim() !== "") {
      info.value.beschreibung = { value: this.beschreibung, label: "Beschreibung" };
    }
    return info;
  }
}

export default Funktion;
