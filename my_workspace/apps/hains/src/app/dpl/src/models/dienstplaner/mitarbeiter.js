import { deepClone } from '../../tools/helper';
import Mitarbeiter from '../apimodels/mitarbeiter';

/**
 * Klasse um ein DienstplanerDataMitarbeiter-Objekt zu erstellen.
 * @class
 */
class DienstplanerDataMitarbeiter extends Mitarbeiter {
  constructor(obj, appModel = false) {
    super(obj, appModel, false);
    this._preventExtension();
  }

  /**
   * Liefert Informationen zum Mitarbeiter
   */
  get mainInfos() {
    return {
      ...super.mainInfos,
      writable: {
        value: this.writable(false, false) ? 'Ja' : 'Nein',
        label: 'Einteilungen Bearbeitbar'
      }
    };
  }

  /**
   * Liefert weitere Informationen zur Mitarbeiterin
   */
  get popupInfos() {
    const info = {
      ...super.popupInfos,
      ...this.popupInfosExtras
    };
    return info;
  }

  /**
   * Liefert die Popup-Informationen für weitere Informationen
   */
  get popupInfosExtras() {
    const info = {
      Einteilungen: {
        value: {
          wochenenden: { value: {}, label: 'Wochenenden', sorting: 'alph-asc' },
          nachTag: {
            value: {
              anzahl: { value: 0, label: 'Anzahl', sort: -1 }
            },
            label: 'Nach Tagen',
            sorting: 'alph-asc'
          },
          nachDienst: {
            value: {
              anzahl: { value: 0, label: 'Anzahl', sort: -1 }
            },
            label: 'Nach Diensten',
            sorting: 'alph-asc'
          }
        },
        label: 'Einteilungen',
        ignore: true
      },
      Arbeitzeiten: {
        value: {},
        label: 'Arbeitzeiten',
        sorting: 'asc'
      },
      Wuensche: {
        value: {},
        label: 'Wünsche',
        sorting: 'asc',
        ignore: true
      },
      Arbeitszeittypen: { value: {}, label: 'Arbeitszeittypen', ignore: true }
    };
    const arbeitszeitVormonat = this?._statistiken?.countArbeitszeitVormonat?.(
      this?._wochenbilanzen,
      this,
      [
        'plusstunden',
        'geplante_bereitschaftszeit',
        'geplante_rufbereitschaftszeit'
      ]
    ) || false;
    this?._dates?._each?.((date) => {
        const monat = date?.month || 'Unbekannt';
        const arbeitzeitInfo = this.initArbeitszeitenInfo(
          info,
          monat,
          date,
          arbeitszeitVormonat
        );
        this.addArbeitszeittypenInfo(info, monat, date);
        const einteilungen = this.getEinteilungenNachTag(date.id);
        const wunsch = this.getWunschAm(date.id);
        this.addEinteilungenInfo(info, einteilungen, arbeitzeitInfo);
        arbeitzeitInfo.Saldo_aktuell.value =
          arbeitzeitInfo.Ist.value - arbeitzeitInfo.Soll.value;
        if (date?.isInMainZeitraum) {
          arbeitzeitInfo.Saldo_verrechnet.value =
            arbeitzeitInfo.Saldo_aktuell.value +
            arbeitzeitInfo.Saldo_vormonat.value;
        }
        const wunschInfo = wunsch?._popupInfo;
        if (wunschInfo) {
          info.Wuensche.ignore = false;
          info.Wuensche.value[wunsch.id] = wunschInfo;
        }
      });
    // Arbeitszeiten auf 1 Nachkommastellen fixen
    for (const key in info.Arbeitzeiten.value) {
      const arbeitzeitInfo = info.Arbeitzeiten.value[key].value;
      for (const key2 in arbeitzeitInfo) {
        arbeitzeitInfo[key2].value = arbeitzeitInfo[key2].value.toFixed(1);
      }
    }
    // Score in das Label der Arbeitszeittypen für den jeweiligen Monat einfügen
    for (const key in info.Arbeitszeittypen.value) {
      const arbeitszeittypMonat = info.Arbeitszeittypen.value[key];
      for (const key2 in arbeitszeittypMonat.value) {
        const arbeitszeittyp = arbeitszeittypMonat.value[key2];
        arbeitszeittyp.label += ` (${arbeitszeittyp.value.Score.value})`;
      }
    }
    return info;
  }

  /**
   * Initialisiert die Informationen zu den ARbeitszeiten
   * @param {Object} info
   * @param {String} monat
   * @param {Object} date
   * @param {Object} arbeitszeitVormonat
   * @returns Object
   */
  initArbeitszeitenInfo(info, monat, date, arbeitszeitVormonat) {
    if (!info.Arbeitzeiten.value[monat]) {
      info.Arbeitzeiten.value[monat] = {
        value: {
          Soll: { value: 0.0, label: 'Soll (Std.)' },
          Ist: { value: 0.0, label: 'Ist (Std.)' },
          BD: { value: 0.0, label: 'Bereitschaftsdienst BD (Std.)' },
          RD: { value: 0.0, label: 'Rufdienst RD (Std.)' },
          Saldo_aktuell: { value: 0.0, label: 'Saldo (Std.)' }
        },
        label: monat,
        sort: date?._zahl || 0
      };
      if (date?.isInMainZeitraum && this._isObject(arbeitszeitVormonat)) {
        const {
          plusstunden,
          geplante_bereitschaftszeit,
          geplante_rufbereitschaftszeit
        } = arbeitszeitVormonat;
        info.Arbeitzeiten.value[monat].value.BD_vormonat = {
          value: geplante_bereitschaftszeit || 0.0,
          label: 'BD vormonat (Std.)'
        };
        info.Arbeitzeiten.value[monat].value.RD_vormonat = {
          value: geplante_rufbereitschaftszeit || 0.0,
          label: 'RD vormonat (Std.)'
        };
        info.Arbeitzeiten.value[monat].value.Saldo_vormonat = {
          value: plusstunden || 0.0,
          label: 'Saldo vormonat (Std.)'
        };
        info.Arbeitzeiten.value[monat].value.Saldo_verrechnet = {
          value: 0.0,
          label: 'Saldo verrechnet (Std.)'
        };
      }
    }
    info.Arbeitzeiten.value[monat].value.Soll.value += this.getSollStunden(
      date.id,
      true
    );
    return info.Arbeitzeiten.value[monat].value;
  }

  /**
   * Fügt die Informationen der Einteilungen und iherer Arbeitszeiten hinzu
   * @param {Object} info
   * @param {Array} einteilungen
   * @param {Object} arbeitzeitInfo
   */
  addEinteilungenInfo(info, einteilungen, arbeitzeitInfo) {
    einteilungen?.forEach?.((feld) => {
        // Informationen zu der Arbeitszeit einfügen
        const arbeitszeit = feld?.arbeitszeit;
        if (this._isObject(arbeitszeit)) {
          arbeitzeitInfo.Ist.value += arbeitszeit?.ist || 0.0;
          arbeitzeitInfo.BD.value += arbeitszeit?.Bereitschaft || 0.0;
          arbeitzeitInfo.RD.value += arbeitszeit?.Rufbereitschaft || 0.0;
        }
        // Informationen zu den Einteilungen einfügen
        info.Einteilungen.ignore = false;
        const sortTag = `${feld.date?._zahl || 0}${feld?.dienst?.planname || ''}`;
        const sortDienst = `${feld?.dienst?.planname || ''}${feld.date?._zahl || 0}`;
        const feldInfo = feld._infoBasis;
        const value = {
          ...feldInfo.mainInfos,
          ...feldInfo.popupInfos
        };
        if (feld.isWeekend) {
          info.Einteilungen.value.wochenenden.value[feld.id] = {
            value,
            label: feld?.tagDienstLabel || '',
            sort: sortTag
          };
        }
        info.Einteilungen.value.nachTag.value.anzahl.value += 1;
        info.Einteilungen.value.nachTag.value[feld.id] = {
          value,
          label: feld?.tagDienstLabel,
          sort: sortTag
        };
        info.Einteilungen.value.nachDienst.value.anzahl.value += 1;
        info.Einteilungen.value.nachDienst.value[feld.id] = {
          value,
          label: feld?.dienstTagLabel || '',
          sort: sortDienst
        };
      });
  }

  /**
   * Fügt die Informationen für die Arbeitszeittypen hinzu
   * @param {Object} info
   * @param {String} monat
   * @param {Object} date
   */
  addArbeitszeittypenInfo(info, monat, date) {
    if (info.Arbeitszeittypen.value[monat]) return false;
    const arbeitszeittypen =
      this?.einteilungen?.monate?.[monat]?.arbeitszeittypen;
    if (!arbeitszeittypen) return false;
    info.Arbeitszeittypen.value[monat] = {
      value: {},
      label: monat,
      sort: date?._zahl || 0,
      sorting: 'alph-asc'
    };
    const arbeitszeittypenInfo = info.Arbeitszeittypen.value[monat].value;
    for (const aId in arbeitszeittypen) {
      const typ = this?._arbeitszeittypen?.[aId];
      const felder = arbeitszeittypen[aId];
      if (typ) {
        info.Arbeitszeittypen.ignore = false;
        arbeitszeittypenInfo[aId] = typ._infoMitarbeiter;
      }
      if (!(felder?.length && felder?.forEach && typ)) continue;
      felder.forEach((feld) => {
        const feldInfo = feld._infoBasis;
        const score = feld.arbeitszeittypValue(typ) || 0;
        const value = {
          ...feldInfo.mainInfos,
          ...feldInfo.popupInfos
        };
        arbeitszeittypenInfo[aId].value.Score.value += score;
        arbeitszeittypenInfo[aId].value.Felder.ignore = false;
        arbeitszeittypenInfo[aId].value.Felder.value[feld.id] = {
          value,
          label: `${feld?.date?.label || feld.tag} (${score})`,
          sort: feld.date?._zahl || 0
        };
      });
    }
  }

  /**
   * Testet, ob User die Mitarbeiterin planen dürfen
   * @param {String} dateId
   * @param {Number} dienstId
   * @returns True, wenn writable
   */
  writable(dateId = '', dienstId = 0) {
    const isDienstplaner = this?._user?.isDienstplaner;
    const isUrlaubsplaner = this?._user?.isUrlaubsplaner;
    const teams = this?._user?.teams;
    const dienst = this?._dienste?.[dienstId] || false;
    const date = this?.dates?.[dateId] || false;
    const isFreiEintragbar = dienst ? dienst.isFreiEintragbar : true;
    // Bei Urlaubsplan-Diensten können Urlaubsplaner alle Mitarbeiter eintragen
    if (isUrlaubsplaner && isFreiEintragbar) return true;
    if (isDienstplaner) {
      // bei Urlaubsplan-Diensten können Dienstplaner nur Mitarbeiter ihres Teams eintragen
      if (isFreiEintragbar) {
        return !!(
          teams?.find?.((team) =>
            date
              ? team.hasMitarbeiterTag(this.id, dateId)
              : team.hasMitarbeiter(this.id)
          )
        );
      }
      // Bei Dienstplan-Diensten können Dienstplaner alle Mitarbeiter eintragen
      return dienst.writable;
    }

    return false;
  }

  /**
   * Erstellt eine kleine Statistik für die Einteilung-Auswahl.
   * Es wird gezählt wieviele Einteilungen die Mitarbeiterin nach
   * Dienstplan, Urlaubsplan, Bereitschaftsdienst und Wochenende hat.
   * Der callback wird einmal für jedes Feld und einmal zum Schluss ausgeführt.
   * @param {Function} callback
   * @param {Object} onlyMain
   */
  getEinteilungenInfo(callback = false, onlyMain = false) {
    return super.getEinteilungenInfo(callback, (feld) => {
      // Nur Hauptmonat zählen
      if (onlyMain || this?._dienstplanTable?.auswahl?.countOnlyMain) {
        return feld?.date?.isInMainZeitraum;
      }
      // Einteilungen ab dem ersten Planungstag zählen
      return feld?.date?.isPlanDatum;
    });
  }

  /**
   * Ermittelt den Status des Mitarbeiters für die Führung in der Dienstplan-Tabelle
   * @param {String} dateId
   * @param {Number} dienstId
   * @returns object
   */
  status(dateId, dienstId) {
    // // const abwesend = this.isAbwesend(`${dateId}_${dienstId}`, true);
    // const abwesend = false;
    // // Als abwesend gelten Mitarbeiter, die nicht aktiv oder bereits in einem Dienst sind
    // let nichteingeteilt = this.aktiv && !abwesend && this.writable(dateId, dienstId);
    // const einteilungen = this.einteilungen[dateId];
    // if (einteilungen && nichteingeteilt) {
    //   nichteingeteilt = einteilungen.length === 0;
    // }
    // const freigaben = this.anteilFreigaben(dienstId);
    // let qualifikatioKey = "nichtEingeteilteTeilQualifizierteMitarbeiter";
    // if (freigaben === 1) qualifikatioKey = "nichtEingeteilteQualifizierteMitarbeiter";
    // if (freigaben === 0) qualifikatioKey = "nichtEingeteilteNichtQualifizierteMitarbeiter";
    // return {
    //   qualifikatioKey,
    //   nichteingeteilt
    // };
  }

  /**
   * Liefert den Wunsch eines bestimmten Tages
   * @param {String} dateId
   * @returns Wunsch
   */
  getWunschAm(dateId = '') {
    const date = this?._dates?.[dateId];
    const el = date?.getMitarbeiterEl?.(this.id);
    return el?.wunsch || false;
  }

  /**
   * Liefert eine Zahl, die angibt, ob ein Wunsch erfüllt wird.
   * 0 -> Wunsch nicht erfüllt
   * 1 -> Wunsch erfüllt
   * 0.5 -> Kein Wunsch
   * @param {String} dateId
   * @param {Number} dienstId
   * @returns Zahl
   */
  hasFittingDienstWunsch(dateId = '', dienstId = 0) {
    const dienstkategorie = this.getWunschAm(dateId)?.dienstkategorie;
    if (dienstkategorie?.hasDienst) {
      return dienstkategorie.hasDienst(dienstId) ? 1 : 0;
    }
    return 0.5;
  }

  addToInfoScore(info, key, floatValue, label) {
    if(!info[key]) {
      const value = Math.round(floatValue * 10) / 10;
      info[key] = {
        title: [
          { txt: `${label}: ${value}` }
        ],
        anzahl: value
      }
    }
    return info;
  }

  getArbeitszeitSoll(callback = false) {
    let soll = 0.0;
    let ist = 0.0;
    const emptyAsRegeldienst = !!this?._user?.dienstplanTableSettings?.empty_as_regeldienst;
    this?._dates?._each?.((date) => {
      if (this?._isFunction(callback) && !callback(date)) 
        return false;
      const time = this.getSollStunden(date.id, true);
      soll += time;
      if(emptyAsRegeldienst 
        && !this.hasEinteilungenAm(date.id) 
        && !this.hasAusgleichsFreiAm(date.id)) {
        ist += time;
      }
    });
    return {
      soll,
      ist
    }
  }

  /**
   * Liefert Informationen zu den Einteilungen der Mitarbeiterin
   * und ergänzt diese ggf. um das übergebene Feld.
   * @param {Object} feld
   * @returns Object
   */
  getEinteilungenInfoScore(feld) {
    const isInMainZeitraum = feld?.date?.isInMainZeitraum;
    const statistiken = this?._statistiken?.countArbeitszeit && this._statistiken;
    const {
      soll,
      ist
    } = this.getArbeitszeitSoll((date) => date.isInMainZeitraum);
    const bedarf = feld?.bedarf;
    const addWeekend = feld?.isWeekend && bedarf && isInMainZeitraum;
    const weekCounter = feld?.weekCounter || 0;
    const emptyAsRegeldienst = !!this?._user?.dienstplanTableSettings?.empty_as_regeldienst;
    // Einteilungen zählen
    return this.getEinteilungenInfo((einteilungFeld, info) => {
      if (!info?.Arbeitzzeit) {
        info.Arbeitzzeit = {
          Ist: ist,
          DefaultIst: ist,
          BD: 0.0,
          RD: 0.0,
          Soll: soll,
          Saldo: emptyAsRegeldienst ? ist-soll : -soll,
          ignoreInCounter: true
        };
      }
      if (!info.EinteilungenGesamt) {
        info.EinteilungenGesamt = {
          felder: [],
          azahl: 0,
          feldIncluded: false,
          ignoreInCounter: true
        };
      }

      let arbeitszeitFeld = einteilungFeld;
      if (einteilungFeld) {
        info.EinteilungenGesamt.anzahl += 1;
        info.EinteilungenGesamt.felder.push(einteilungFeld);
        if(!info.EinteilungenGesamt.feldIncluded) {
          info.EinteilungenGesamt.feldIncluded = einteilungFeld === feld;
        }
      } else {
        // Letzter Aufruf
        // Feld zum Wochenende hinzufügen, falls es nicht schon vorhanden war
        // und ein Bedarf ist
        info.Wochenenden.currentAnzahl = info.Wochenenden.anzahl
        // Feld hinzufügen, wenn es nicht bereits gezählt wurde
        if (!info.EinteilungenGesamt.feldIncluded) {
          info.EinteilungenGesamt.anzahl += 1;
          info.EinteilungenGesamt.felder.push(feld);
          if (
            addWeekend && 
            !info.Wochenenden.info[weekCounter]
          ) {
            info.Wochenenden.currentAnzahl += 1;
          }
          arbeitszeitFeld = feld;
        }
        this.addToInfoScore(info, 'ArbeitszeitSaldo', info.Arbeitzzeit.Saldo, 'Arbeitszeit Saldo');
        this.addToInfoScore(info, 'ArbeitszeitBD', info.Arbeitzzeit.BD, 'Arbeitszeit BD');
        this.addToInfoScore(info, 'ArbeitszeitRD', info.Arbeitzzeit.RD, 'Arbeitszeit RD');
      }

      // Für jedes Feld im Hauptmonat die Arbeitszeit berechnen
      if (arbeitszeitFeld?.date?.isInMainZeitraum && statistiken) {
        const result = statistiken.countArbeitszeit(
          false,
          false,
          arbeitszeitFeld,
          false
        );
        if (result?.Ist) {
          info.Arbeitzzeit.Ist += result.Ist;
          info.Arbeitzzeit.Saldo += result.Ist;
        }
        if (result?.Bereitschaft) info.Arbeitzzeit.BD += result.Bereitschaft;
        if (result?.Rufbereitschaft)
          info.Arbeitzzeit.RD += result.Rufbereitschaft;
      }
    }, true);
  }

  /**
   * Liefert die Einteilungen nach Arbeitszeittypen
   * und ergänzt diese ggf. um das aktuelle Feld.
   * @param {Object} feld
   * @returns Object
   */
  getArbeitszeittypenEinteilungen(feld) {
    const einteilungsMonat = this.getEinteilungsMonat(feld);
    let arbeitszeittypenEnteilungen = {};
    const schichten =
      feld?.date?.isInMainZeitraum &&
      this._isObject(einteilungsMonat?.arbeitszeittypen) &&
      feld?.schichtenWithAusgleich;
    if (schichten?.forEach) {
      arbeitszeittypenEnteilungen = deepClone(
        einteilungsMonat.arbeitszeittypen
      );
      schichten.forEach((schicht) => {
        const arbeitszeittyp =
          arbeitszeittypenEnteilungen?.[schicht.arbeitszeittyp_id];
        if (arbeitszeittyp?.includes && !arbeitszeittyp.includes(feld)) {
          arbeitszeittyp.push(feld);
        }
      });
    }
    return arbeitszeittypenEnteilungen;
  }

  /**
   * Testet, ob die Rotationen für den Einteilungstag
   * zum Dienst passen.
   * @param {Object} feld
   * @returns Object
   */
  checkRotationen(feld) {
    const el = feld?.date?.getMitarbeiterEl?.(this.id);
    return el?.checkRotationen?.(feld?.dienst) || {};
  }

  /**
   * Liefert die Eigenschaften zur Berechnung des Scores für ein Feld
   * @param {Object} feld
   * @returns Object
   */
  getScoreProps(feld) {
    const einteilungInfo = this.getEinteilungenInfoScore(feld);
    return {
      ...super.getScoreProps(feld),
      arbeitszeittypenEnteilungen: this.getArbeitszeittypenEinteilungen(feld),
      arbeitszeitIst: einteilungInfo?.Arbeitzzeit?.Ist || 0,
      arbeitszeitSoll: einteilungInfo?.Arbeitzzeit?.Soll || 0,
      arbeitszeitSaldo: einteilungInfo?.Arbeitzzeit?.Saldo || 0,
      arbeitszeitBD: einteilungInfo?.Arbeitzzeit?.BD || 0,
      arbeitszeitRD: einteilungInfo?.Arbeitzzeit?.RD || 0,
      wochenenden: einteilungInfo?.Wochenenden?.currentAnzahl || 0,
      anzahlEinteilungen: einteilungInfo?.EinteilungenGesamt?.anzahl || 0,
      einteilungenInfoScore: einteilungInfo
    };
  }

  /**
   * @param {String} date 
   * @returns True, wenn es min. eine Rotation für den Tag gibt.
   */
  hasRotationenAm(tag = false) {
    const date = this?._dates?.[tag];
    const el = date?.getMitarbeiterEl?.(this.id);
    return el?.rotation_ids?.length > 0;
  }

  isInKontingentAm(tag, kId) {
    const date = this?._dates?.[tag];
    const el = date?.getMitarbeiterEl?.(this.id);
    return !!el?.isMitarbeiterInKontingent?.(kId);
  }

  getPrioRotationAm(tag) {
    const date = this?._dates?.[tag];
    const el = date?.getMitarbeiterEl?.(this.id);
    return el?.prioRotation || false;
  }
}

export default DienstplanerDataMitarbeiter;
