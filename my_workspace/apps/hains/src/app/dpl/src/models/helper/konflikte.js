import { seriousConflict, possibleConflict } from "../../styles/basic";
import { toDate, today, beforeInMS } from "../../tools/dates";
import { isSeriousConflict } from "../../tools/helper";
import { isArray, isNumber } from "../../tools/types";
/**
 * Schnittstelle, um Konflikte zu ermitteln
 */
class Konflikte {
  /**
   * Eine Methode um eine Objekt zu erstellen, dass der Struktur von
   * mitarbeiter.einteilungen.schichten entspricht.
   * @param {Array} schichten Schichten zur Sortierung
   * @param {Object} feld Feld, für das die Schichten sortiert werden sollen
   * @returns {Object} Object
   */
  createKonfliktSchichtenNachTage(schichten, feld) {
    const konfliktSchichten = {};
    schichten?.forEach?.((schicht) => {
      const tage = schicht?.getTage?.();
      tage?.forEach?.((tag) => {
        if (!konfliktSchichten[tag]) konfliktSchichten[tag] = [];
        konfliktSchichten[tag].push({ schicht, feld });
      });
    });
    return konfliktSchichten;
  }

  /**
   * Ermittelt ob die Einteilungen die maximale Anzahl an Wochenenden überschreiten.
   * Wochenenden überschreiten max-wochenende -> starker Konflikt.
   * Hierbei sollten nur die Wochenenden von Einteilungen mit Bedarf betrachtet werden.
   * @param {Array} wochenenden, Array mit Arrays von Feldern
   * @returns {Object} object
   */
  wochenendenKonflikt(wochenenden = [], max = 4) {
    const result = {
      className: "",
      msg: "",
      check: false,
      filterKey: "wochenenden"
    };

    const l = wochenenden?.length || 0;
    if (max > 0 && l > max) {
      result.check = true;
      result.className = seriousConflict;
      const felder = [];
      wochenenden?.forEach?.((arr) => {
        arr?.forEach?.((feld) => {
          const fl = felder.length;
          // Bei jeder fünften Einteilung eine neue Zeile beginnen
          felder.push(`${fl > 0 && fl % 5 === 0 ? "\n" : ""}${feld?.dateDienstLabel || "Unbekannt"}`);
        });
      });
      result.msg = `Überschreiten der maximalen Wochenenden (${max})!\n${felder.join("; ")}`;
    }

    return result;
  }

  /**
   * @param {Object} feld1 Feld 1
   * @param {Object} feld2 Feld 2
   * @param {Object} wunsch Wunsch des Mitarbeiters
   * @returns {Boolean} False, wenn der Wunsch priorisiert und erfüllt wird
   */
  checkWunschPrioAbwesend(feld1, feld2, wunsch) {
    if (wunsch?.hasDienst) {
      const prioWunsch1 = feld1?.priorisiereWunsch;
      const prioWunsch2 = feld2?.priorisiereWunsch;
      const wunsch1Erfuellt = wunsch.hasDienst(feld1?.dienstId);
      const wunsch2Erfuellt = wunsch.hasDienst(feld2?.dienstId);
      // Gilt nicht als abwesend, wenn einer der Dienste die Eigenschaft priorisiere Wunsch hat
      // und der andere Dienst den Wunsch erfüllt
      if ((prioWunsch1 && wunsch2Erfuellt)
        || (prioWunsch2 && wunsch1Erfuellt)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Erzeugt ein Array mit Tagen von anfang bis ende.
   * @param {String} anfang Anfangsdatum
   * @param {String} ende Enddatum
   * @returns {Array} array
   */
  createTageArray(anfang, ende) {
    const anfangDate = toDate(anfang);
    const endeDate = toDate(ende);
    const tage = [];
    while (anfangDate <= endeDate) {
      tage.push(anfangDate.toISOString().split("T")[0]);
      anfangDate.setDate(anfangDate.getDate() + 1);
    }
    return tage;
  }

  /**
   * Felder die eine Dienstgruppe vorher fordern, können Konflikte haben,
   * wenn keine passende Einteilung aus der geforderten Dienstgruppe existiert.
   * Schwacher Konflikt
   * @param {Object} feld Feld, für das die Konflikte getestet werden sollen
   * @param {Object} eingeteilteSchichtenNachTage Schichten die Konflikte verursachen können
   * @param {Object} checkBefore Nur für die letzten zwei Wochen vor dem aktuellen Tag testen
   * @returns {Object} object
   */
  preDienstgruppeKonflikt(feld, eingeteilteSchichtenNachTage, checkBefore = true) {
    const result = {
      className: "",
      msg: "",
      check: false,
      filterKey: "predienstgruppe",
      felder: [feld],
      acceptedUeberschneidung: false
    };
    const {
      preDienstgruppeZeitraum,
      preDienstgruppe
    } = feld;
    // Konflikt existiert nur, wenn der Einteilungstag innerhalb von 2 Wochen liegt
    const now = today().getTime();
    const einteilungsTag = toDate(feld.tag).getTime();
    const diff = einteilungsTag - now;
    if (
      preDienstgruppeZeitraum
      && preDienstgruppe?.includesDienst
      && (diff <= beforeInMS || !checkBefore)
    ) {
      const tage = this.createTageArray(preDienstgruppeZeitraum._anfang.date, preDienstgruppeZeitraum._ende.date);
      result.className = possibleConflict;
      result.check = true;
      result.msg = `${feld?.label || feld.id}: Keine Einteilung aus der Dienstgruppe ${preDienstgruppe?.name || "Unbekannt"} `;
      result.msg += `zwischen ${preDienstgruppeZeitraum._anfang.fullLocal} - ${preDienstgruppeZeitraum._ende.fullLocal}`;
      result.acceptedUeberschneidung = preDienstgruppeZeitraum.acceptedUeberschneidung;
      tage.find((tag) => {
        const eingeteilteSchichten = eingeteilteSchichtenNachTage?.[tag];
        let shouldBreak = false;
        eingeteilteSchichten?.find?.((obj) => {
          const schicht = obj.schicht;
          const konfliktFeld = obj.feld;
          const add = !schicht.isFrei
            && konfliktFeld !== feld
            && preDienstgruppe.includesDienst(konfliktFeld.dienstId)
            && schicht.checkUeberschneidung(preDienstgruppeZeitraum);
          if (add) {
            result.className = "";
            result.check = false;
            result.felder.push(konfliktFeld);
            result.msg = "";
            shouldBreak = true;
          }
          return shouldBreak;
        });
        return shouldBreak;
      });
    }

    return result;
  }

  /**
   * Testet, ob alle Einteilungen die Forderung nach einer Dienstgruppe der nächsten Einteilung erfüllen.
   * @param {object} feld 
   * @param {array} felder 
   * @returns {Object} object
   */
  multiPreDienstgruppeKonflikt(feld, felder) {
    const result = {
      preDienstgruppeErfuellt: false,
      predienstgruppeFelder: [],
      konfliktSchichten: [],
      preDienstgruppeKonflikte: []
    };

    if(isArray(felder) && felder?.length) {
      let doNotAddFeld = false;
      const checkFelder = felder.map((f) => {
        if(!doNotAddFeld) doNotAddFeld = f === feld;
        return {
          feld: f,
          schichten: f?.schichten
        };
      });
      if(!doNotAddFeld) checkFelder.push({
        feld,
        schichten: feld?.schichten
      });
      if(checkFelder.length < 2) return result;
      checkFelder.sort((a, b) => {
        const schichtenA = a?.schichten;
        const schichtenB = b?.schichten;
        const anfangA = schichtenA?.[0]?._anfang?.fullnr || 0;
        const anfangB = schichtenB?.[0]?._anfang?.fullnr || 0;
        const diff = anfangA - anfangB;
        if(diff !== 0) return diff;
        const aL = (schichtenA?.length || 1)-1;
        const bL = (schichtenB?.length || 1)-1;
        const endeA = schichtenA?.[aL]?._ende?.fullnr || 0;
        const endeB = schichtenB?.[bL]?._ende?.fullnr || 0;
        return endeA - endeB;
      });
      
      const l = checkFelder?.length;
      result.preDienstgruppeErfuellt = true;
      for(let i = 1; i < l && result.preDienstgruppeErfuellt; i++) {
        const obj1 = checkFelder[i - 1];
        const obj2 = checkFelder[i];
        if(!obj2.feld?.fordertPreDienstgruppe) {
          result.preDienstgruppeErfuellt = false;
          break;
        }
        const schichten = this.createKonfliktSchichtenNachTage(obj1.schichten, obj1.feld);
        const res = this.preDienstgruppeKonflikt(
          obj2.feld,
          schichten,
          false
        );
        result.predienstgruppeFelder.push(obj2.feld);
        result.konfliktSchichten.push(schichten);
        result.preDienstgruppeKonflikte.push(res);
        result.preDienstgruppeErfuellt = !res.check && res.felder.length === 2
      }
    }

    return result;
  }

  /**
   * Merfache Einteilungen an einem Tag.
   * Zwei Einteilungen mit Bedarf -> schwacher Konflikt
   * Eine der Einteilungen ist ohne Bedarf und die andere mit Bedarf -> starker Konflikt
   * @param {Object} feld Feld, für das die Konflikte getestet werden sollen
   * @param {Array} einteilungen Einteilungen (Felder) eines Tages
   * @param {Object} wunsch Wunsch des Mitarbeiters
   * @param {Object} eingeteilteSchichtenNachTage Schichten die Konflikte verursachen können bzw. zum Testen der Dienstgruppe
   * @returns {Object} object
   */
  mehrfacheinteilungenKonflikt(
    feld = false,
    einteilungen = [],
    wunsch = false
  ) {
    const result = {
      className: "",
      msg: "",
      abwesend: false,
      check: false,
      anzahl: einteilungen?.length || 0,
      filterKey: "mehrfacheinteilung"
    };

    if (feld && result.anzahl > 1) {
      result.check = true;
      result.className = seriousConflict;
      result.abwesend = true;
      result.msg = "Mehrere Einteilungen am selben Tag!\n";
      result.msg += einteilungen.map((f) => {
        return f?.dienst?.planname || f?.dienstId;
      }).join(", ");
      // Falls es sich um zwei Einteilungen handelt gelten weitere Bedingungen
      
      if (result.anzahl === 2) {
        const feld2 = einteilungen.find((f) => f !== feld);
        result.abwesend = this.checkWunschPrioAbwesend(feld, feld2, wunsch);
        // Wenn beide dienste die Eigenschaft haben weak_parallel_conflict, dann handelt es sich um einen schwachen Konflikt
        if(feld?.dienst?.weak_parallel_conflict && feld2?.dienst?.weak_parallel_conflict) {
          result.className = possibleConflict;
        }
      }
      const check = this.multiPreDienstgruppeKonflikt(feld, einteilungen);
      if(check.preDienstgruppeErfuellt) {
        result.className = "";
        result.msg = "";
        result.abwesend = false;
        result.check = false;
      }
    }

    return result;
  }

  /**
   * Testet, ob Mitarbeiter zu einem bestimmten Arbeitszeittyp zu oft eingeteilt wurden.
   * Dieser Konflikt sollte nur für die entsprechenden Arbeitszeittypen getestet werden.
   * anzahlEinteilungen > min und <= max -> schwach
   * anzahlEinteilungen > max -> stark
   * @param {Array} einteilungen Einteilungen (Felder) eines Tages
   * @param {Object} arbeitszeittyp Arbeitszeittyp, für den die Konflikte getestet werden sollen
   * @returns {Object} object
   */
  arbeitszeittypenKonflikt(einteilungen, arbeitszeittyp = false) {
    const result = {
      className: "",
      msg: "",
      check: false,
      anzahl: 0,
      filterKey: "arbeitszeittyp"
    };
    if (arbeitszeittyp && einteilungen?.reduce) {
      const {
        min,
        max,
        name
      } = arbeitszeittyp;
      result.anzahl = einteilungen.reduce((sum, feld) => sum + (
        feld?.arbeitszeittypValue?.(arbeitszeittyp) || 0.0
      ), 0.0);
      if ((isNumber(min) && min > 0) || (isNumber(max) && max > 0)) {
        if (result.anzahl > max) {
          result.className = seriousConflict;
          result.msg = `Überschreiten der maximalen Anzahl für ${name} (${max})!`;
          result.check = true;
        } else if (result.anzahl > min) {
          result.className = possibleConflict;
          result.msg = `Überschreiten der minimalen Anzahl für ${name} (${min})!`;
          result.check = true;
        }
      }
    }

    return result;
  }

  /**
   * Sollte nur für Tage mit Bedarf getestet werden,
   * da es kein Konflikt ist an freien Tagen abwesend zu sein.s
   * Mitarbeiter ist inaktiv -> stark
   * Mitarbeiter ist als abwesend eingetragen -> schwach
   * @param {Object} mitarbeiter Mitarbeiter, für den die Konflikte getestet werden sollen
   * @param {string} tag
   * @returns {Object} object
   */
  abwesenheitKonflikt(mitarbeiter = false, tag = '') {
    const result = {
      className: "",
      msg: [],
      check: false,
      filterKey: "abwesend"
    };

    if (mitarbeiter?.abwesend) {
      result.msg.push("Mitarbeiter hat den Sonderstatus (Abwesend)!");
      result.className = possibleConflict;
      result.check = true;
    }
    const checkAktiv = tag ? mitarbeiter?.aktivAm?.(tag) : mitarbeiter?.aktiv;
    if (!checkAktiv) {
      result.className = seriousConflict;
      result.msg.push("Mitarbeiter ist inaktiv!");
      result.check = true;
    }
    result.msg = result.msg.join("\n");
    return result;
  }

  /**
   * Wenn Mitarbeiter nicht im Dienst-Team ist -> schwacher Konflikt
   * @param {Boolean} isInDienstTeam Ist Mitarbeiter im Dienst-Team
   * @param {String} dienstTeam Team des Dienstes
   * @param {String} mitarbeiterTeam Team des Mitarbeiters
   * @returns {Object} object
   */
  teamKonflikt(isInDienstTeam = false, dienstTeam = "Keine Angabe", mitarbeiterTeam = "Keine Angabe") {
    const result = {
      className: "",
      msg: "",
      isInDienstTeam,
      check: false,
      filterKey: "team"
    };

    if (!isInDienstTeam) {
      result.className = possibleConflict;
      result.msg = `Mitarbeiter-Team (${mitarbeiterTeam}) unterscheidet sich von Team des Dienstes (${dienstTeam})`;
      result.check = true;
    }
    return result;
  }

  /**
   * Keine Freigaben -> stark
   * Einige Freigaben -> schwach
   * @param {Number} anteilFreigaben Anteil der Freigaben zwischen 0 und 1 (0 und 100%)
   * @returns {Object} object
   */
  freigabeKonflikt(anteilFreigaben = 0) {
    const result = {
      className: "",
      msg: "",
      anteil: anteilFreigaben,
      check: false,
      filterKey: "freigaben"
    };

    if (anteilFreigaben < 1) {
      result.className = anteilFreigaben === 0
        ? seriousConflict
        : possibleConflict;
      result.msg = anteilFreigaben === 0
        ? "Mitarbeiter hat keine Freigabe für diesen Dienst."
        : "Mitarbeiter hat für diesen Dienst Sonderfreigaben oder es fehlen Freigaben.";
      result.check = true;
    }

    return result;
  }

  /**
   * Testet, ob es für ein Feld Überschneidungen gibt.
   * @param {Object} feld Feld, für das die Überschneidungen getestet werden sollen
   * @param {Array} schichten Schichten des zu testended Feldes
   * @param {Object} eingeteilteSchichtenNachTage Schichten die Konflikte verursachen können
   * @param {Object} wunsch Wunsch des Mitarbeiters
   * @returns {Object} object
   */
  ueberschneidungenKonflikt(
    feld,
    schichten,
    eingeteilteSchichtenNachTage,
    wunsch = false
  ) {
    const result = {
      className: "",
      msg: "",
      abwesend: false,
      check: false,
      maxMsgLength: 400,
      filterKey: "ueberschneidung",
      felder: [feld]
    };
    const tagZahl = feld?.tagZahl;
    const ignoreBefore = feld?.dienst?.ignore_before;
    schichten?.forEach?.((schicht) => {
      // Ausgleich-Schichten eines Blockes nicht testen, wenn der Block inaktiv ist
      if (schicht?.ausgleich && feld?.isBlock && !feld?.blockChecked) return false;
      const tage = schicht.getTage();
      tage?.forEach?.((tag) => {
        eingeteilteSchichtenNachTage?.[tag]?.forEach?.((obj) => {
          const konfliktSchicht = obj.schicht;
          const konfliktFeld = obj.feld;
          const konfliktTagZahl = konfliktFeld?.tagZahl;
          const konfliktIgnoreBefore = konfliktFeld?.dienst?.ignore_before;
          const shouldCheck = feld !== konfliktFeld
          && !(konfliktSchicht?.isFrei && schicht?.isFrei)
          && (
            !konfliktSchicht.ausgleich || (
              // Ausgleich nur für das letzte Feld eines Blockes betrachten
              konfliktFeld?.lastBedarfTag === konfliktFeld.tag
              && (
                !konfliktFeld?.isBlock || konfliktFeld?.blockChecked
              )
            )
          );
          // Nicht testen, wenn eines der beiden Felder vorhegehende Tage ignoriert
          // und das andere sich entsprechend auf diese bezieht
          if((ignoreBefore && konfliktTagZahl < tagZahl)
            || (konfliktIgnoreBefore && tagZahl < konfliktTagZahl)) {
            return false;
          }
          // Schichten, die Frei sind, haben bei Überschneidung keinen Konflikt
          if (!(shouldCheck && schicht.checkUeberschneidung(konfliktSchicht))) return false;
          if (!isSeriousConflict(result.className)) {
            // Konflikte zwischen isFrei und Dienst gelten als starke Konflikte
            result.className = konfliktSchicht?.isFrei || schicht?.isFrei
              ? seriousConflict : possibleConflict;
          }
          result.abwesend = true;
          result.check = true;
          if (!result.msg) {
            result.msg = `${feld?.dateDienstLabel || "Unbekannt"} mit:`;
          }
          if (!result.felder.includes(konfliktFeld)) {
            result.msg += `\n${konfliktFeld?.dateDienstLabel || "Unbekannt"}`;
            result.felder.push(konfliktFeld);
          }
          result.msg += `\n${schicht?.typLabel} vs ${konfliktSchicht?.typLabel}`;
        });
      });
    });

    // Gilt nicht als abwesend, wenn eine Einteilung den Wunsch priorisiert
    // und die andere ihn erfüllt
    const l = result.felder.length;
    if (l > 1) {
      const check = this.multiPreDienstgruppeKonflikt(feld, result.felder);
      if(l === 2) {
        const feld2 = result.felder.find((f) => f !== feld);
        result.abwesend = this.checkWunschPrioAbwesend(feld, feld2, wunsch);
      }
      if(check.preDienstgruppeErfuellt) {
        const kl = check.preDienstgruppeKonflikte.length;
        let isValid = true;
        for(let i = 0; i < kl && isValid; i++) {
          const konflikt = check.preDienstgruppeKonflikte[i];
          const acceptedUeberschneidung = konflikt.acceptedUeberschneidung;
          const konfliktSchichten = check.konfliktSchichten[i];
          const predienstgruppeFeld = check.predienstgruppeFelder[i];
          if(acceptedUeberschneidung.minuten > 0) {
            const tage = this.createTageArray(acceptedUeberschneidung._anfang.date, acceptedUeberschneidung._ende.date);
            const minuten = tage.reduce((total, tag) => (
              konfliktSchichten?.[tag]?.reduce
                ? total + konfliktSchichten[tag].reduce((totalSchichten, obj) => {
                  if (obj.feld === predienstgruppeFeld || obj.schicht?.isFrei) return totalSchichten;
                  // Kann keine Überschneidung > als acceptedUeberschneidung.minuten haben,
                  // da die Überschneidung maximal der Länge der getesteten Schichten entspricht
                  // und acceptedUeberschneidung einer Fake-Schicht mit
                  // der Lände in Minuten entspricht
                  return totalSchichten + obj.schicht.checkUeberschneidung(acceptedUeberschneidung);
                }, 0)
                : total
            ), 0);
            isValid = minuten < acceptedUeberschneidung.minuten;
          }
        }
        if(isValid) {
          result.className = "";
          result.msg = "";
          result.abwesend = false;
          result.check = false;
        }
      }
    }

    return result;
  }

  /**
   * Wenn dienstrguppeFeld im Anschluss einen Dienst einer bestimmten Dienstgruppe fordert,
   * dann ist es ein Konflikt, wenn das Konfliktfeld nicht zu dieser Dienstgruppe gehört.
   * @param {Object} feld Feld, für das die Konflikte getestet werden sollen
   * @param {Array} dienstgruppen Dienstgruppen, die Konflikte verursachen können
   * @returns {Object} object
   */
  dienstgruppeKonflikt(feld, dienstgruppen) {
    const result = {
      className: "",
      msg: "",
      abwesend: false,
      check: false,
      filterKey: "dienstgruppe"
    };
    dienstgruppen?.forEach?.((dienstgruppeFeld) => {
      // Feld kann nicht mit sich selbst in Konflikt stehen
      if (dienstgruppeFeld === feld) return false;
      const dienstgruppeFeldTagZahl = dienstgruppeFeld?.tagZahl || 0;
      const feldToCheckTagZahl = feld?.tagZahl || 0;
      const {
        dienstgruppe,
        dienstgruppeZeitraum
      } = dienstgruppeFeld;
      // feld kann nur den Dienstgruppen-Konflikt haben, wenn der
      // Einteilungstag >= dem Einteilungstag des Dienstgruppe-Feldes ist
      const checkTag = feldToCheckTagZahl >= dienstgruppeFeldTagZahl;
      if (!(
        checkTag
        && dienstgruppeZeitraum
        && dienstgruppe
        && dienstgruppe?.includesDienst
      )) return false;
      const schichten = feld?.schichtenWithoutAusgleich;
      const l = schichten?.length;
      if (!(l && !dienstgruppe.includesDienst(feld.dienstId))) return false;
      for (let i = 0; i < l; i++) {
        const schicht = schichten[i];
        // Kein Konflikt, wenn es sich um eine Freischicht handelt 
        // oder keine Überschneidung mit dem Zeitraum der Dienstgruppe besteht
        if (schicht.isFrei || !schicht.checkUeberschneidung(dienstgruppeZeitraum)) continue;
        result.check = true;
        result.abwesend = true;
        result.className = seriousConflict;
        if (!result.msg) result.msg = `${feld?.dateDienstLabel || "Unbekannt"} ist nicht in der Dienstgruppe:`;
        result.msg += `\n${dienstgruppe?.name || "Unbekannt"} von ${dienstgruppeFeld?.dateDienstLabel || "Unbekannt"}`;
        break;
      }
    });
    return result;
  }

  /**
   * Felder die eine Dienstgruppe fordern, können Konflikte haben,
   * wenn in dem geforderten Zeitraum eine überschneidende Einteilung existiert,
   * die nicht in die Dienstgruppe gehört.
   * Starker Konflikt
   * @param {Object} feld Feld, für das die Konflikte getestet werden sollen
   * @param {Object} eingeteilteSchichtenNachTage Schichten die Konflikte verursachen können
   * @returns {Object} object
   */
  fordertDienstgruppeKonflikt(feld, eingeteilteSchichtenNachTage) {
    const result = {
      className: "",
      msg: "",
      abwesend: false,
      check: false,
      filterKey: "fordertdienstgruppe"
    };
    const dienstgruppeZeitraum = feld?.dienstgruppeZeitraum;
    const dienstgruppe = feld?.dienstgruppe;
    if (dienstgruppeZeitraum && dienstgruppe?.includesDienst) {
      const tage = this.createTageArray(dienstgruppeZeitraum._anfang.date, dienstgruppeZeitraum._ende.date);
      const felder = [];
      tage.forEach((tag) => {
        const eingeteilteSchichten = eingeteilteSchichtenNachTage?.[tag];
        eingeteilteSchichten?.forEach?.((obj) => {
          const schicht = obj.schicht;
          const konfliktFeld = obj.feld;
          if (
            !schicht.isFrei
            && konfliktFeld !== feld
            && !felder.includes(konfliktFeld)
            && schicht.checkUeberschneidung(dienstgruppeZeitraum)
            && !dienstgruppe.includesDienst(konfliktFeld.dienstId)
          ) {
            result.className = seriousConflict;
            result.abwesend = true;
            result.check = true;
            felder.push(konfliktFeld);
            if (!result.msg) {
              result.msg = `${feld?.dienstgruppe?.name || "Unbekannt"}:`;
            }
            result.msg += `\n${konfliktFeld?.dateDienstLabel || "Unbekannt"}`;
          }
        });
      });
    }

    return result;
  }
}

export default Konflikte;
