import { showConsole } from "../../tools/flags";
import { isPossibleConflict, isSeriousConflict } from "../../tools/helper";

/**
 * Schnittstelle, um Scores für Einteilungen zu ermitteln
 */
class Scores {
  constructor() {
    // Faktor mit dem gewichtet werden soll -> erhöht den Zahlenbereich
    this.faktor = 10;
    this.lowest = 1;
    this.low = 2;
    this.middle = 3;
    this.high = 4;
    this.highest = 5;

    // Gewichtungen und defaultWerte
    // Einmalige Attribute
    this.g_freigegebeneDienste = this.lowest ;
    this.d_freigegebeneDienste = 0;

    this.g_gesamtFreigaben = this.lowest ;
    this.d_gesamtFreigaben = 0;

    this.g_aktiv = this.highest;
    this.d_aktiv = 100;

    this.g_sonderstatus = this.lowest ;
    this.d_sonderstatus = 100;

    // Attribute nach Diensten
    this.g_rating = this.middle;
    this.d_rating = 50;

    this.g_freigaben = this.high;
    this.d_freigaben = 0;

    // Attribute nach Tagen
    this.g_wunsch = this.middle;
    this.d_wunsch = 50;

    this.g_rotation = this.middle;
    this.d_rotation = 50;

    this.g_parallelEinteilungen = this.highest;
    this.d_parallelEinteilungen = 100;

    this.g_eingeteilt = this.lowest ;
    this.d_eingeteilt = 100;

    this.g_anwesend = this.lowest ;
    this.d_anwesend = 100;

    this.g_team = this.high;
    this.d_team = 0;
    
    // feld
    this.g_verteilungstyp_prio = this.lowest ;
    this.d_verteilungstyp_prio = 0;

    this.g_verteilungstyp_uni = this.lowest ;
    this.d_verteilungstyp_uni = 100;

    this.g_ueberschneidungen = this.highest;
    this.d_ueberschneidungen = 100;

    // monat
    this.g_wochenenden = this.middle;
    this.d_wochenenden = 100;

    this.g_anzahlEinteilungen = this.high;
    this.d_anzahlEinteilungen = 100;

    this.g_arbeitszeit = this.high;
    this.d_arbeitszeit = 100;

    this.g_bereitschaftzeit = this.low;
    this.d_bereitschaftzeit = 100;

    this.g_rufbereitschaftzeit = this.low;
    this.d_rufbereitschaftzeit = 100;

    // Es wäre denkbar, dass unterschiedliche arbeitszeittypen gezählt werden sollen
    // Aktuell werden die Gewichtung und die Default_Werte für diese zusammengefasst
    this.g_arbeitszeittypen = this.low;
    this.d_arbeitszeittypen = 100;

    // Helfer, der in einem Score-Objekt aufgerufen wird
    // und alle relevanten Scores für das Objekt ermittelt
    this.helper = {
      freigegebeneDienste: (props) => this.freigegebeneDienste(props),
      gesamtFreigaben: (props) => this.gesamtFreigaben(props),
      aktiv: (props) => this.aktiv(props),
      sonderstatus: (props) => this.sonderstatus(props),
      rating: (props) => this.rating(props),
      freigaben: (props) => this.freigaben(props),
      wunsch: (props) => this.wunsch(props),
      rotation: (props) => this.rotation(props),
      eingeteilt: (props) => this.eingeteilt(props),
      parallelEinteilungen: (props) => this.parallelEinteilungen(props),
      anwesend: (props) => this.anwesend(props),
      team: (props) => this.team(props),
      wochenenden: (props) => this.wochenenden(props),
      arbeitszeittypen: (props) => this.arbeitszeittypen(props),
      anzahlEinteilungen: (props) => this.anzahlEinteilungen(props),
      arbeitszeit: (props) => this.arbeitszeit(props),
      bereitschaftzeit: (props) => this.bereitschaftzeit(props),
      rufbereitschaftzeit: (props) => this.rufbereitschaftzeit(props),
      ueberschneidungen: (props) => this.ueberschneidungen(props),
      verteilungstyp_prio: (props) => this.verteilungstyp_prio(props),
      verteilungstyp_uni: (props) => this.verteilungstyp_uni(props)
    };

    this.setGewSum();
    if (showConsole) console.log(this);
  }

  get weights() {
    const result = {};
    for (const key in this.helper) {
      const gewKey = `g_${key}`;
      result[gewKey] = this.gewicht(key) || 1;
    }
    return result;
  }

  /**
   * Gibt das Gewicht eines Scores zurück
   * @param {String} key
   * @returns Gewicht
   */
  gewicht(key) {
    const gewKey = `g_${key}`;
    return this[gewKey];
  }

  /**
   * Speichert die Summe der Gewichte
   */
  setGewSum() {
    let sum = 0;
    for (const key in this.helper) {
      sum += this.gewicht(key);
    }
    this.gewSum = sum;
  }

  /**
   * Gewichtet den Score
   * @param {Number} gew
   * @param {Number} score
   * @returns Score
   */
  gewichteScore(gew, score) {
    const result = Math.round(((gew * this.faktor) / this.gewSum) * score);
    return result;
  }

  /**
   * Erstellt einen String aus den überreichten Parametern und den gewichteten scores
   * @param {String} msg
   * @param {score} score
   * @returns string
   */
  createMsg(msg, score = false) {
    return `${msg} (${score})`;
  }

  // Score-Funktionen ------------------------------------------------------------
  /**
  * Je mehr freigegebene Dienste Mitarbeiter haben, umso wniger kommen sie für einen
  * ganz bestimmten Dienst in Frage und eignen sich eher als Springer,
  * welche die übrigen Dienste ausfüllen
  * @param {Object} param1
  */
  freigegebeneDienste({ freigegebeneDienste, anzahlDiensteGesamt }) {
    let score = this.d_freigegebeneDienste;
    if (!Number.isNaN(freigegebeneDienste) && !Number.isNaN(anzahlDiensteGesamt)
      && anzahlDiensteGesamt > 0) {
      score = Math.round((freigegebeneDienste / anzahlDiensteGesamt) * 100);
      score = score > 0 ? 101 - score : score;
    }
    const gewScore = this.gewichteScore(this.g_freigegebeneDienste, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(freigegebeneDienste, gewScore),
      label: "Freigegebene Dienste"
    };
  }

  /**
  * Je mehr Freigaben Mitarbeiter habne, umso eher lassen sie sich
  * für Dienste einteilen, bei denen niemand alle Freigaben hat.
  * Da diese Mitarbeiter jedoch viele Freigaben habe, liegt die Vermutung nahe,
  * dass sie genug Erfahrung haben, um auch andere Dienste zu übernehmen
  * @param {Object} param1
  */
  gesamtFreigaben({ freigabenanzahl, anzahlFreigabenGesamt }) {
    let score = this.d_gesamtFreigaben;
    if (!Number.isNaN(freigabenanzahl) && !Number.isNaN(anzahlFreigabenGesamt)
    && anzahlFreigabenGesamt > 0) {
      score = Math.round((freigabenanzahl / anzahlFreigabenGesamt) * 100);
      score = score > 0 ? 101 - score : score;
    }
    const gewScore = this.gewichteScore(this.g_gesamtFreigaben, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(freigabenanzahl, gewScore),
      label: "Gesamte Freigaben"
    };
  }

  /**
   * Checkt die Anwesenheit und ob die Mitarbiter aktiv sind
   * oder bereits nicht mehr zur Verfügung stehen
   * @param {Object} param1
   */
  aktiv({ notActive }) {
    const score = notActive ? 0 : 100;
    const gewScore = this.gewichteScore(this.g_aktiv, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(notActive ? "Nein" : "Ja", gewScore),
      label: "Aktiv"
    };
  }

  /**
   * Mitarbeiter mit Sonderstatus haben besondere Absprachen für den Monatsplan
   * @param {Object} param1
   */
  sonderstatus({ sonderstatus }) {
    const score = sonderstatus ? 0 : 100;
    const gewScore = this.gewichteScore(this.g_sonderstatus, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(sonderstatus ? "Ja" : "Nein", gewScore),
      label: "Sonderstatus (abwesend)"
    };
  }

  /**
   * Wertung einen Dienstes durch den Mitarbeiter
   * @param {Object} param1
   */
  rating({ rating, MAX_RATING }) {
    let score = this.d_rating;
    // Es werden nur Rating zwischen 1 und MAX_Rating bewertet
    let msg = "Keins";
    if (!Number.isNaN(rating) && !Number.isNaN(MAX_RATING)
      && MAX_RATING > 0 && rating > 0 && rating <= MAX_RATING) {
      score = Math.round((rating * 100) / MAX_RATING);
      msg = `${rating} von ${MAX_RATING}`;
    }
    const gewScore = this.gewichteScore(this.g_rating, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Rating"
    };
  }

  /**
   * Freigaben der Mitarbeiter zu einem bestimmten Dienst
   * @param {*} param1
   */
  freigaben({ prozentFreigaben }) {
    let score = this.d_freigaben;
    if (!Number.isNaN(prozentFreigaben)) {
      score = Math.round(prozentFreigaben * 100);
    }
    const gewScore = this.gewichteScore(this.g_freigaben, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(`${score}%`, gewScore),
      label: "Freigaben"
    };
  }

  /**
   * Gilt der Mitarbeiter an diesem Tag als anwesend
   * @param {Object} param1
   */
  anwesend({ anwesend }) {
    const score = anwesend ? 100 : 0;
    const gewScore = this.gewichteScore(this.g_anwesend, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(score === 0 ? "Nein" : "Ja", gewScore),
      label: "Anwesend"
    };
  }

  /**
   * Werden die Wünsche der Mitarbeiter durch einen gegeneben Dienst erfüllt?
   * @param {Object} param1
   */
  wunsch({ wunsch }) {
    let score = this.d_wunsch;
    let msg = "Kein Wunsch";
    if (wunsch?.wuensche?.length && Number.isNaN(wunsch?.score)) {
      score = wunsch.score * 100;
      if (wunsch?.wuensche?.map) {
        msg = wunsch.wuensche.map(
          ((w) => w?.getInitialien && w.getInitialien()) || "?"
        ).join("|");
      }
    }
    const gewScore = this.gewichteScore(this.g_wunsch, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Wunsch"
    };
  }

  /**
   * Es wird ein Mittelwert aus den Rotationen für diesen Tag gebildet.
   * Sind die Mitarbeiter in der passenden Rotation?
   * @param {Object} param1
   */
  rotation({
    rotationen
  }) {
    const fit = rotationen?.fit?.length || 0;
    const n = fit + (rotationen?.noFit?.length || 0);
    const score = n ? Math.round((fit * 100) / n) : this.d_rotation;
    const fitMsg = rotationen?.fit?.map ? rotationen.fit.map((r) => r.name || "?") : [];
    const noFitMsg = rotationen?.noFit?.map ? rotationen.noFit.map((r) => r.name || "?") : [];
    const msg = n
      ? fitMsg.concat(noFitMsg)
      : ["Keine"];
    const gewScore = this.gewichteScore(this.g_rotation, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg.join("|"), gewScore),
      label: "Rotationen"
    };
  }

  /**
   * Wurden die Mitarbeiter bereits an diesem Tag und Dienst eingeteilt
   * @param {Object} param1
   */
  eingeteilt({ einteilungen }) {
    const l = einteilungen?.length || 0;
    const score = l ? 0 : 100;
    const gewScore = this.gewichteScore(this.g_eingeteilt, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(l ? "Ja" : "Nein", gewScore),
      label: "Eingeteilt"
    };
  }

  /**
   * Checkt, ob es mehrfache Einteilungen an diesem Tag gibt
   * @param {Object} param1
   */
  parallelEinteilungen({
    mehrfacheinteilungen
  }) {
    let score = 100;
    let msg = "Keine";
    if (mehrfacheinteilungen?.abwesend && mehrfacheinteilungen?.className) {
      if (isSeriousConflict(mehrfacheinteilungen.className)) score = 0;
      if (isPossibleConflict(mehrfacheinteilungen.className)) score = 50;
      if (score === 0) {
        msg = "Mit Frei";
      } else if (score === 50) {
        msg = "Mit Diensten";
      }
    }
    const gewScore = this.gewichteScore(this.g_parallelEinteilungen, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Parallele Einteilungen"
    };
  }

  /**
   * Gibt zurück, ob Mitarbeiter im zum Dienste-Team gehört
   * @param {Object} param1
   */
  team({ inTeam }) {
    const score = inTeam ? 100 : 0;
    const msg = inTeam ? "Ja" : "Nein";
    const gewScore = this.gewichteScore(this.g_team, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Team"
    };
  }

  verteilungstyp_prio({ verteilungstyp_priocode }) {
    let score = this.d_verteilungstyp_prio;
    let msg = "Default Wert";
    const verteilungscode = Number(verteilungstyp_priocode);
    if(verteilungscode >= 0) {
      msg = `Priorität (${verteilungscode})`;
      score = Math.round(100 / (verteilungscode + 1));
    }
    
    const gewScore = this.gewichteScore(this.g_verteilungstyp_prio, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Verteilungstyp Prio"
    };
  }

  verteilungstyp_uni({ einteilungenInDienst, verteilungstyp_unicode, tag }) {
    let score = this.d_verteilungstyp_prio;
    let msg = "Default Wert";
    const verteilungscode = Number(verteilungstyp_unicode);
    if(verteilungscode > 0) {
      msg = `Uniform (${verteilungscode})`;
      const currentDayTime = new Date(tag?.toString?.() || "").getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      if(currentDayTime && !einteilungenInDienst?.find?.((e) => {
        const dayTime = new Date(e?.tag || "").getTime();
        if(!dayTime) return false;
        return Math.round(Math.abs(dayTime - currentDayTime) / oneDay) < verteilungscode;
      })) {
        score = 100;
      }
    }
    const gewScore = this.gewichteScore(this.g_verteilungstyp_uni, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Verteilungstyp Prio"
    };
  }

  /**
   * Prüft die Überschneidungen
   * @param {Object} param1
   */
  ueberschneidungen({
    ueberschneidungen
  }) {
    let score = 100;
    let msg = "Keine";
    if (ueberschneidungen?.abwesend && ueberschneidungen?.className) {
      if (isSeriousConflict(ueberschneidungen?.className)) score = 0;
      else if (isPossibleConflict(ueberschneidungen?.className)) score = 50;
      if (score === 0) {
        msg = "Mit Frei";
      } else if (score === 50) {
        msg = "Mit Diensten";
      }
    }
    const gewScore = this.gewichteScore(this.g_ueberschneidungen, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Überschneidungen"
    };
  }

  /**
   * Überschreiten Mitarbeiter ihr Saldo
   * @param {Object} param1
   */
  arbeitszeit({
    arbeitszeitIst, arbeitszeitSoll, arbeitszeitSaldo
  }) {
    let score = this.d_arbeitszeit;
    let msg = "";
    if (!Number.isNaN(arbeitszeitSoll) && !Number.isNaN(arbeitszeitIst)
      && !Number.isNaN(arbeitszeitSaldo)) {
      msg = `Saldo ${parseFloat(arbeitszeitSaldo).toFixed(1)} Std.`;
      if (arbeitszeitIst > arbeitszeitSoll || arbeitszeitSoll <= 0) score = 0;
      else {
        score = Math.round((100 - ((arbeitszeitIst * 100) / arbeitszeitSoll)));
      }
    }
    const gewScore = this.gewichteScore(this.g_arbeitszeit, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Arbeitszeit"
    };
  }

  /**
   * Verhältnins zwischen Bereitschaft und Soll
   * @param {Object} param1
   */
  bereitschaftzeit({
    arbeitszeitSoll, arbeitszeitBD
  }) {
    let score = this.d_bereitschaftzeit;
    let msg = "";
    if (!Number.isNaN(arbeitszeitSoll)
      && !Number.isNaN(arbeitszeitBD)) {
      msg = `BD ${parseFloat(arbeitszeitBD).toFixed(1)} Std.`;
      if (arbeitszeitBD > arbeitszeitSoll || arbeitszeitSoll <= 0) score = 0;
      else {
        score = Math.round((100 - ((arbeitszeitBD * 100) / arbeitszeitSoll)));
      }
    }
    const gewScore = this.gewichteScore(this.g_bereitschaftzeit, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Bereitschaftszeit"
    };
  }

  /**
   * Verhältnis zwischen Rufbereitschaft und Soll
   * @param {Object} param1
   */
  rufbereitschaftzeit({
    arbeitszeitSoll, arbeitszeitRD
  }) {
    let score = this.d_rufbereitschaftzeit;
    let msg = "";
    if (!Number.isNaN(arbeitszeitSoll)
      && !Number.isNaN(arbeitszeitRD)) {
      msg = `RD ${parseFloat(arbeitszeitRD).toFixed(1)} Std.`;
      if (arbeitszeitRD > arbeitszeitSoll || arbeitszeitSoll <= 0) score = 0;
      else {
        score = Math.round((100 - ((arbeitszeitRD * 100) / arbeitszeitSoll)));
      }
    }
    const gewScore = this.gewichteScore(this.g_rufbereitschaftzeit, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(msg, gewScore),
      label: "Rufbereitschaftszeit"
    };
  }

  /**
   * Überschreiten Mitarbeiter eine festgelegte Anzahl an Wochenenden
   * @param {Object} param1
   */
  wochenenden({ wochenenden, MAX_WOCHENENDEN }) {
    let score = this.d_wochenenden;
    if (!Number.isNaN(wochenenden) && !Number.isNaN(MAX_WOCHENENDEN)
      && MAX_WOCHENENDEN > 0) {
      score = Math.round(100 - ((wochenenden * 100) / MAX_WOCHENENDEN));
      if (score < 0) score = 0;
    }
    const gewScore = this.gewichteScore(this.g_wochenenden, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(wochenenden, gewScore),
      label: "Wochenenden"
    };
  }

  /**
   * Überschreiten Mitarbeiter eine festgelegt Anzahl an Arbeitszeittypen
   * @param {Object} param1
   */
  arbeitszeittypen({ arbeitszeittypen, arbeitszeittypenEnteilungen }) {
    const result = {};
    arbeitszeittypen?.forEach?.((arbeitszeittyp) => {
      let score = 100;
      const {
        id,
        min,
        max,
        name
      } = arbeitszeittyp;
      const key = `arbeitszeittyp_${id}`;
      const einteilungen = arbeitszeittypenEnteilungen?.[id]?.reduce
        ? arbeitszeittypenEnteilungen?.[id]
        : [];
      const ist = einteilungen.reduce((sum, feld) => {
        if (feld?.arbeitszeittypValue) {
          return sum + feld.arbeitszeittypValue(arbeitszeittyp) || 0;
        }
        return sum;
      }, 0);
      if (!Number.isNaN(min) && !Number.isNaN(max) && !Number.isNaN(ist)) {
        if (min > 0 && ist >= min) score = 50;
        // Annahme: Max sollte größer als min sein
        if (max > 0 && ist >= max) score = 0;
      }
      const gewScore = this.gewichteScore(this.g_arbeitszeittypen, score);
      result[key] = {
        score,
        gewScore,
        msg: this.createMsg(ist, gewScore),
        label: name || ""
      };
    });
    return result;
  }

  /**
  * Mitarbieter sollen möglichst gleichmäßig eingeteilt werden
  * Damit rutschen Mitarbeiter mit vielen Einteilungen im Score weiter nach unten
  * @param {Object} param1
  */
  anzahlEinteilungen({ anzahlEinteilungen }) {
    let score = this.d_anzahlEinteilungen;
    if (!Number.isNaN(anzahlEinteilungen)) {
      score = 100;
      // Gerade durch 31
      // 31 -> In einem Monat wurden 31 Einteilungen getätigt
      const nullAnzahl = 31;
      score = nullAnzahl - anzahlEinteilungen * 3;
      if (score < 0) score = 0;
    }
    const gewScore = this.gewichteScore(this.g_anzahlEinteilungen, score);
    return {
      score,
      gewScore,
      msg: this.createMsg(anzahlEinteilungen, gewScore),
      label: "Anzahl Einteilungen"
    };
  }

  // #########################################################################################
  /**
   * Gibt den berechneten Score für bestimmte Properties zurück
   * @param {Object} props
   * @returns score
   */
  getScore(props) {
    const scores = {
      evaluatedScore: 0,
      title: ""
    };
    const helper = this.helper;
    for (const key in helper) {
      const scoreObj = helper[key](props);
      if (key === "arbeitszeittypen") {
        for (const key2 in scoreObj) {
          scores[key2] = scoreObj[key2];
          scores.evaluatedScore += scoreObj[key2].gewScore;
          scores.title += `${scoreObj[key2].label}: ${scoreObj[key2].msg}\n`;
        }
      } else {
        scores[key] = scoreObj;
        scores.evaluatedScore += scoreObj.gewScore;
        scores.title += `${scoreObj.label}: ${scoreObj.msg}\n`;
      }
    }
    return scores;
  }

  set(key, value) {
    if (this[key] === undefined) return;
    let nr = parseInt(value, 10);
    if(key === "faktor") {
      if(nr < 1) nr = this.lowest;
      if(nr > 100) nr = this.highest;
    } else {
      if(nr < this.lowest) nr = this.lowest;
      if(nr > this.highest) nr = this.highest;
    }
    this[key] = nr
  }
}

export default Scores;
