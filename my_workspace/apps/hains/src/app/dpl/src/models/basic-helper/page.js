import DataGetter from "./datagetter";

/**
 * Enthält die Methoden und Getter bzw. Setter für bestimmte Seiten.
 * Z.B. Dienstplaner
 * @class
 */
class Page extends DataGetter {
  constructor() {
    super();
  }

  /**
   * Gibt aus Page die Propertie Table zurück.
   * Im Dienstplan bezieht sich das auf die Dienstplan-Tabelle, in der die Planung stattfindet.
   * @returns {object} Tabelle für die Dienstplanung
   */
  get _dienstplanTable() {
    return this?._page?.table || false;
  }

  /**
   * Gibt den KonfliktFilter aus der Seite (Dienstplaner) zurück.
   * Über den Konflikt-Filter lässt sich Filtern, welche Konflikte farblich markiert werden.
   * @returns {object} Konflikt-Filter-Objekt
   */
  get _konflikteFilter() {
    return this?._page?.konflikteFilter || false;
  }

  /**
   * Liefert ein Farbgruppen-Objekt mit dem sich auf der Seite (Dienstplaner)
   * Dienste und Dienstkategorien farblich gruppieren lassen.
   * @returns {object} Farbgruppen-Objekt
   */
  get _farbgruppen() {
    return this?._page?.farbgruppen || false;
  }

  /**
   * Liefert die einteilungsstatusAuswahl Schnittstelle aus der Page
   */
  get _einteilungsstatusAuswahl() {
    return this?._page?.einteilungsstatusAuswahl || false;
  }

  /**
   * Liefert die einteilungsstatus_id aus einteilungsstatusAuswahl
   */
  get _einteilungsstatusId() {
    return this._einteilungsstatusAuswahl?.einteilungsstatus_id || 0;;
  }

  /**
   * Liefert die Statstik aus dem Dienstplaner.
   * Damit lassen sich verschiedene Statitiken anzeigen.
   * @returns {object} Statistik-Objekt
   */
  get _statistic() {
    return this?._page?.statistic || false;
  }

  /**
   * Gibt das State-Objekt der entsprechenden Seite zurück.
   * Beim Dienstplaner wird dort zum Beispiel gespeichert, welcher Monat aktuelle bearbeitet wird
   * und eine Funktion zum Laden anderer Monate zur Verfügung gestellt.
   * @returns {object} Objekt mit States/SetStates aus der jeweiligen Seite
   */
  get _state() {
    return this?._page?.state || false;
  }

  /**
   * Liefert das Team aus der Vorlage für den Dienstplaner.
   * @returns {object} Team-Objekt oder False
   */
  get _team() {
    return this?._vorlage?.team || false;
  }

  /**
   * Liefert die aktuelle Vorlage für den Dienstplan.
   * Dienstplan-Ansichten können anhand von Vorlagen vorgefiltert werden und auf notwendige Dienste,
   * Teams und Mitarbeiter-Funktionen beschränkt werden.
   * @returns {object} Vorlage-Objekt oder False
   */
  get _vorlage() {
    return this?._page?.vorlage || false;
  }

  /**
   * Liefert die Id der aktuellen Vorlage
   * @returns {number} Id der Vorlage
   */
  get _vorlageId() {
    return this?._vorlage?.id || "no";
  }

  /**
   * Liefert die Dienste, aus der aktuellen Vorlage
   * @returns {array} Array mit den Ids der Dienste
   */
  get _vorlageDiensteIds() {
    return this?._vorlage?.dienste || [];
  }

  /**
   * Liefert die Dienste, aus der aktuellen Vorlage
   * @returns {array} Array mit den Diensten
   */
  get _vorlageDienste() {
    const result = [];
    this?._vorlage?.getDienste?.((dienst) => {
      if (!result.includes(dienst)) result.push(dienst);
    });

    return result;
  }

  /**
   * Liefert die Funktionen, aus der aktuellen Vorlage
   * @returns {array} Array mit den Funktionen
   */
  get _vorlageFunktionen() {
    return this?._vorlage?.funktionen || [];
  }

  /**
   * Liefert die FunktionenIds, aus der aktuellen Vorlage
   * @returns {array} Array mit den FunktionenIds
   */
  get _vorlageFunktionenIds() {
    return this?._vorlage?.funktionen_ids || [];
  }
  // ####################################################################################
  // ROTATIONSPLAN

  /**
   * Liefert die Timeline aus dem Rotationsplan
   */
  get _timeline() {
    const rotationsplan = this._page;
    const timeline = rotationsplan && rotationsplan.timeline;
    if (!timeline) throw new Error("Timeline nicht initialisiert");
    return timeline;
  }

  /**
   * Liefert die Positionen der Kontingente aus dem Rotationsplan
   */
  get _rotationPositions() {
    const rotationen = this._rotationen;
    const kontingente = this._pageData.kontingente;

    const positions = {};
    for (const kId in kontingente) {
      const kontingent_rot_pos = Object.values(rotationen)
        .reduce((acc, rotation) => {
          if (rotation.kontingent_id.toString() === kId.toString()) {
            acc.push(rotation.position);
          }
          return acc;
        }, [])
        .sort((a, b) => a - b);

      positions[kId] = [...new Set(kontingent_rot_pos)];
    }
    return positions;
  }
}

export default Page;
