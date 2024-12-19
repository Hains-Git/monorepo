import { getRGB } from "../../tools/helper";
import Dienst from "../apimodels/dienst";

/**
 * Erstellt ein neues Dienstplaner-Data-Objekt
 * @class
 */
class DienstplanerDataDienst extends Dienst {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
    this._preventExtension();
  }

  /**
   * Dienstplaner Berechtigung überprüfen
   */
  get writable() {
    const team_ids = this?._user?.team_ids || [];
    const isDienstplaner = this?._user?.isDienstplaner;
    const showDienstplaner = this?._user?.showDienstplaner;
    // Urlaubsplan-Dienste können von Urlaubs- und Dienstplaner eingetragen werden
    // Dienstplan-Dienste können nur von Dienstplanern mit entsprechendem Team eingetragen werden
    return this.isFreiEintragbar
      ? showDienstplaner
      : isDienstplaner && (this.dpl_all_teams || team_ids.includes(this.team_id));
  }

  /**
   * Liefert Informationen zum Dienst
   */
  get mainInfos() {
    return {
      ...super.mainInfos,
      writable: { value: this.writable ? "Ja" : "Nein", label: "Einteilungen Bearbeitbar" }
    };
  }

  /**
   * Liefert weitere Informationen zur Dienst
   */
  get popupInfos() {
    return {
      ...super.popupInfos
      // gesamtBedarf: {},
      // Einteilungen: {}
    };
  }

  /**
  * True, wenn Dienst in Vorlage vorhanden
  */
  get isInVorlage() {
    const ids = this._vorlageDiensteIds;
    return ids.includes(this.id) || this?._vorlageId === -3;
  }

  /**
   * True, wenn Dienst im Vorlage-Team ist oder kein Vorlage-Team gewählt wurde
   */
  get isInVorlageTeam() {
    let result = true;
    if (this?._team) {
      result = this._team.hasDienst(this.id);
    }

    return result;
  }

  /**
   * Liefert den Plannamen ggf. mit Farbe
   * @param {Boolean} withColor
   * @returns Array
   */
  exportLabel(withColor = false) {
    return withColor
      ? [this.planname, getRGB(this.getColor())]
      : this.planname;
  }

  /**
   * Testet, ob der Dienst zum gegebenen Tag einen Bedarf hat
   * @param {String} dateId
   * @returns True, wenn ein Bedarf existiert
   */
  hasBedarfAm(dateId) {
    const bedarfe = this?._dienstBedarfeintraege?.[this.id];
    const l = bedarfe?.[dateId]?.length || 0;
    return l > 0;
  }

  /**
   * liefert alle Bedarfseinträge zu einem gegebenen Tag
   * @param {String} dateId
   * @returns Array mit Bedarfseinträgen
   */
  getBedarfAm(dateId) {
    const bedarfe = this?._dienstBedarfeintraege?.[this.id];
    const bedarfseintraege = this?._bedarfseintraege;
    return bedarfe[dateId]
      ? bedarfe[dateId].map((b) => bedarfseintraege?.[b])
      : [];
  }

  /**
   * Holt für ein Datum das by_mitarbeiter Objekt
   * @param {String} dateId
   * @returns by_dienst
   */
  getMeFromDate(dateId) {
    const date = this._dates[dateId];
    return date?.getDienstEl
      ? date.getDienstEl(this.id)
      : false;
  }

  /**
   * Gibt für die Führung die Mitarbeiter nach Status sortiert zurück
   * @param {String} dateId
   * @returns Statistik
   */
  checkMitarbeiterStatuse(dateId) {
    const statistic = {
      nichtEingeteilteQualifizierteMitarbeiter: 0,
      nichtEingeteilteTeilQualifizierteMitarbeiter: 0,
      nichtEingeteilteNichtQualifizierteMitarbeiter: 0,
      eingeteilt: true
    };

    // this._mitarbeiter._each((mitarbeiter) => {
    //   const {
    //     qualifikatioKey,
    //     nichteingeteilt
    //   } = mitarbeiter.status(dateId, this.id);
    //   if (nichteingeteilt) statistic[qualifikatioKey] += 1;
    // });

    const date = this._dates[dateId];
    if (date) {
      const bedarf = date.countUnbesetzt(this.id);
      statistic.eingeteilt = bedarf < 1;
    }

    return statistic;
  }

  /**
   * Checkt, ob Dienst dem Team ist.
   * @param {Number} id
   * @returns True, wenn Dienst zu dem Team gehört
   */
  isInTeam(id = false) {
    let result = true;
    const team = id ? this._teams[id] : this._team;
    if (team) {
      result = team.hasDienst(this.id);
    }

    return result;
  }

  /**
   * Gibt den Bedarf des Hauptmonats zurück
   * @returns Bedarf
   */
  getCurrentBedarf() {
    let result = 0;
    this._dates?._each?.((date) => {
      if (date?.isInMainZeitraum && date?.countUnbesetzt) {
        result += date.countUnbesetzt(this.id);
      }
    });

    return result;
  }
}

export default DienstplanerDataDienst;
