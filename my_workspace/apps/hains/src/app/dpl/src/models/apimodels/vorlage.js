import Basic from "../basic";

/**
 * Klasse um ein Vorlage-Objekt zu erstellen.
 * Entspricht einer Vorlage an Diensten.
 * Jeder Mitarbeiter hat die Möglichkeit Vorlagen zu erstellen,
 * damit der Dienstplan etwas handlicher wird und man sich auf
 * die für eine Aufgabe wichtigen Vorlagen beschränken kann.
 * @class
 */
class Vorlage extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._setInteger("id", obj.id);
    this._set("name", obj.name);
    this._setArray("dienste", obj.dienste);
    this._set("is_public", false);
    this._setArray("publish", []);
    this._setInteger("path_id", 0);
    this._set("publishable", false);
    this._setArray("pdf_zusatz_dienste", []);
    this._setInteger("position", obj.position);
    this.setFreitext("");
    const allgemeine_vorlage = this._isArray(obj.allgemeine_vorlages) ? obj.allgemeine_vorlages?.[0] : obj.allgemeine_vorlage;
    if (this._isObject(allgemeine_vorlage)) {
      this._set("is_public", true);
      this._set("publishable", allgemeine_vorlage.publishable);
      this._setArray("publish", allgemeine_vorlage.publish);
      this._setArray("pdf_zusatz_dienste", allgemeine_vorlage.pdf_zusatz_dienste);
      this._setInteger("path_id", allgemeine_vorlage.dienstplan_path_id);
      this._set("filepattern", allgemeine_vorlage.filepattern);
      this.setFreitext(allgemeine_vorlage.freitext || "");
    }
    this._setInteger("mitarbeiter_id", obj.mitarbeiter_id);
    this.setTeamId(obj.team_id);
    this._setArray("funktionen_ids", obj.funktionen_ids);
    this.setAnsichtId(obj.ansicht_id);
    this.setTitle(false);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Prüft, ob diese Vorlage im User als Standard gesetzt ist
   */
  get standard() {
    return this.id === this._user?.standardVorlageId;
  }

  /**
   * Liefert das Team der Vorlage oder false, falls kein Team existiert
   */
  get team() {
    return this._getIdsObject("_teams", "team_id", false);
  }

  /**
   * Liefert den Namen des ausgewählten Teams
   */
  get teamName() {
    return this?.team?.name || "Kein Team";
  }

  /**
   * Liefert ein Array mit den Funktionen aus der Vorlage
   */
  get funktionen() {
    return this._getIdsObject("_funktionen", "funktionen_ids", false);
  }

  get funktionenNamen() {
    const funktionen = [];
    if (this?._funktionen) {
      this?.funktionen_ids?.forEach?.((fId) => {
        const f = this._funktionen[fId];
        if (f) funktionen.push(f.planname);
      });
    }
    if (funktionen.length) {
      return funktionen.join(", ");
    }
    return "Keine";
  }

  /**
   * Liefert true, wenn die Mitarbeiter-Id mit der Id der Userin übereinstimmt
   */
  get isUsersVorlage() {
    return this.mitarbeiter_id === this?._user?.mitarbeiterId;
  }

  get isAdminAndPublic() {
    return this?._user?.isAdmin && this.is_public;
  }

  /**
   * Liefert true, wenn die Vorlage bearbeitet werden kann
   */
  get editable() {
    return this.isUsersVorlage || this.isAdminAndPublic;
  } 

  /**
   * Liefert einen String zur Ansicht zurück
   */
  get ansicht() {
    let result = "";
    if (this?._page?.getAnsichtName) {
      result = this._page.getAnsichtName(this.ansicht_id);
    }
    return result;
  }

  /**
   * Liefert den Pfad auf dem die Dienstpläne veröffentlicht werden
   */
  get veroeffentlichungspfad() {
    let result = "Kein Pfad gefunden";
    const pfad = this._getIdsObject('_dienstplanpfade', 'path_id', false);
    if (pfad) result = pfad.path;
    return result;
  }

  /**
   * Teste, ob Zusatz-Dienste für die PDF enthalten sind
   */
  get hasExtraDienste() {
    return this.publishable && this.pdf_zusatz_dienste?.length > 0;
  }

  /**
   * Setzt das Freitext Attribut
   * @param {String} text
   */
  setFreitext(text = "") {
    this._set("freitext", text);
  }

  /**
   * Testet, ob die Vorlage veröffentlicht werden kann.
   * Vorlagen können nur veröffentlicht werden, wenn publishable true ist
   * und wenn publish den Ansichtsnamen der Dienstplan-Tabelle enthält.
   * Der Ansichtsname folgt aus ansichten in der DienstplanTable.
   * @param {String} name
   * @returns
   */
  isPublishable(name) {
    return this.publishable && this.publish.includes(name);
  }

  /**
   * Liefert die Dienste aus der Vorlage oder den Return-Wert aus dem Callback
   * @param {Function} callback Eine Funktion, die als Parameter einen Dienst erhält
   * @returns Array mit Diensten oder dem Return aus dem Callback
   */
  getDienste(callback = false) {
    const result = [];
    this.dienste.forEach((dId) => {
      const dienst = this?._dienste?.[dId] || this?._po_dienste?.[dId];
      if (dienst) {
        result.push(this._isFunction(callback) ? callback(dienst) : dienst);
      }
    });

    return result;
  }

  /**
   * Liefert die Zusatz-Dienste aus der Vorlage oder den Return-Wert aus dem Callback
   * @param {Function} callback
   * @returns Arram mit Diensten oder Return aus dem Callback
   */
  getExtraDienste(callback) {
    const result = [];
    this.pdf_zusatz_dienste.forEach((dId, i) => {
      const dienst = this?._dienste?.[dId] || this?._po_dienste?.[dId];
      if (dienst) {
        result.push(this._isFunction(callback) ? callback(dienst, i) : dienst);
      }
    });

    return result;
  }

  /**
   * Setzt den Titel, der im Frontend bei Hovern über den Vorlagen angezeigt werden soll.
   * Dieser enthält das gewählte Team und die Funktionen
   * @param {Boolean} update Aktualisiert den Titel
   */
  setTitle(update = true) {
    const title = [{ txt: "Team: Kein Team" }, { txt: "Funktionen: Alle" }, { txt: `Position: ${this.position}` }];
    if (update) {
      const team = this.team;
      const funktionen = this.funktionen;
      const l = funktionen.length;
      if (team || l) {
        if (team) title[0].txt = `Team: ${team.name}`;
        if (l) title[1] = { txt: `Funktionen: ${funktionen.map((f) => f.planname).join(", ")}` };
        if (this.is_public) {
          title.push({ txt: "Öffentliche Vorlage" });
          if (this.publishable) {
            title.push({ txt: `Veröffentlichen: ${this.publish.join(", ")}` });
            title.push({ txt: `Datei-Struktur: ${this.filepattern}` });
          }
        }
      }
    }

    this._set("title", title);
  }

  /**
   * Setzt die Id des Team
   * @param {String|Number} teamId
   */
  setTeamId(teamId) {
    this._setInteger("team_id", teamId);
  }

  /**
   * Setzt die Id der Ansciht
   * @param {String|Number} teamId
   */
  setAnsichtId(ansicht) {
    this._setInteger("ansicht_id", ansicht);
  }

  /**
   * Testet, ob die Vorlage einen bestimmten Dienst enthält
   * @param {*} dienst
   * @returns
   */
  includesDienst(dienst) {
    const dienstId = this._isObject(dienst) ? dienst.id : parseInt(dienst, 10);

    return this.dienste.includes(dienstId);
  }
}

export default Vorlage;
