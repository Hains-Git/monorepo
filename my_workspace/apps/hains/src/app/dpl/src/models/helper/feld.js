import { getFontColorByWhite } from '../../../joomla/helper/util';
import {
  otherWunschDay,
  currentWunschDay,
  possibleConflict,
  warningClass,
  wunschErfuellt
} from '../../styles/basic';
import { formatDate } from '../../tools/dates';
import { debounce, wait } from '../../tools/debounce';
import { returnError } from '../../tools/hains';
import {
  isPossibleConflict,
  isSeriousConflict
} from '../../tools/helper';
import Einteilung from '../apimodels/einteilung';
import Basic from '../basic';
import FreiSchicht from './freischicht';

let counter = 1;
/**
 * Erzeugt ein Feld-Objekt, welches bei Einteilungen die Verbindung
 * zw. Einteilung und Bedarfseintrag, Dienst, Tag, Bereich und Arbeitsplatz darstellt.
 * @class
 */
class Feld extends Basic {
  constructor(
    {
      tag = '',
      dienstId = 0,
      bedarfeintragId = 0,
      bereichId = 0,
      einteilungId = 0,
      arbeitsplatzId = 0,
      schichtnr = '0',
      value = ''
    } = {},
    appModel = false,
    preventExtension = true
  ) {
    super(appModel);
    // this._set('tag', tag);
    this._set('tag', formatDate(tag));
    this._setInteger('bedarfeintragId', bedarfeintragId);
    this._setInteger('bereichId', bereichId);
    this._set('schichtnr', schichtnr);
    this._setInteger('dienstId', dienstId);
    this._set('counter', counter);
    this.setIsDouble();
    this.setEinteilungId(einteilungId);
    this.setArbeitzplatzId(arbeitsplatzId);
    this.setValue(value);
    this.setRef(false);
    if (preventExtension) this._preventExtension();
    if (this.value) {
      this.einteilen({
        value,
        einteilungId,
        arbeitsplatzId,
        post: false
      });
    }
    counter++;
  }

  /**
   * Testet, ob der Dienst in der Vorlage vorhanden ist
   */
  get dienstIsInVorlage() {
    const diensteIds = this._vorlageDiensteIds;
    return !diensteIds.length || diensteIds.includes(this.dienstId);
  }

  /**
   * Erstellt eine ID für das Feld
   */
  get id() {
    return `${this.tag}_${this.dienstId}_${this.bereichId}_${this.counter}`;
  }

  /**
   * Liefert den zugehörigen Arbeitsplatz
   */
  get arbeitsplatz() {
    return this._getIdsObject('_arbeitsplaetze', 'arbeitsplatz_id', false);
  }

  /**
   * Liefert den Dienst
   */
  get dienst() {
    return this._getIdsObject(['_dienste', '_po_dienste'], 'dienstId', true);
  }

  /**
   * Liefert den Bereich
   */
  get bereich() {
    return this._getIdsObject('_bereiche', 'bereichId', false);
  }

  /**
   * Liefert den zugehörigen Bedarf
   */
  get bedarf() {
    return this._getIdsObject('_bedarfseintraege', 'bedarfeintragId', false);
  }

  get startTag() {
    return this?.bedarf?.startTag || this.tag;
  }

  /**
   * Liefert die Dienstgruppe aus dem Bedarf
   */
  get dienstgruppe() {
    return this?.bedarf?.dienstgruppe || false;
  }

  /**
   * Liefert die Dienstgruppe aus dem Bedarf
   */
  get preDienstgruppe() {
    return this?.bedarf?.preDienstgruppe || false;
  }

  /**
   * Liefert die Stunden, die an die letzte Schicht angehängt werden sollen,
   * an denen auf eine Dienstgruppe getestet wird.
   */
  get dienstgruppeStd() {
    return (this?.dienstgruppe && this?.bedarf?.dienstgruppeStd) || 0;
  }

  /**
   * Liefert die Stunden, die an die letzte Schicht angehängt werden sollen,
   * an denen auf eine Dienstgruppe getestet wird.
   */
  get preDienstgruppeStd() {
    return (this?.preDienstgruppe && this?.bedarf?.preDienstgruppeStd) || 0;
  }

  /**
   * Liefert die Minuten, die sich die Arbeitszeitverteilung mit der geforderten
   * Dienstruppe überschneiden darf.
   */
  get preAcceptedUeberschneidung() {
    return this?.bedarf?.preAcceptedUeberschneidung || 0;
  }

  /**
   * Liefert den Zeitraum für den DienstgruppeKonflikt oder False,
   * falls die dienstgruppeStd nicht größer 0 sind.
   */
  get dienstgruppeZeitraum() {
    const schichten = this.schichtenWithoutAusgleich;
    const lastSchicht = schichten[schichten.length - 1];
    const von = lastSchicht?._ende;
    const std = this.dienstgruppeStd;
    if (von && std > 0) {
      return {
        _anfang: von,
        _ende: this.addStunden(von.fullStr, std)
      };
    }

    return false;
  }

  /**
   * Liefert den Zeitraum für den Pre-DienstgruppeKonflikt oder False,
   * falls die dienstgruppeStd nicht größer 0 sind.
   */
  get preDienstgruppeZeitraum() {
    const von = this.schichtenWithoutAusgleich?.[0]?._anfang;
    const std = this.preDienstgruppeStd;
    const minuten = this.preAcceptedUeberschneidung;
    if (von && std > 0) {
      return {
        _anfang: this.addStunden(von.fullStr, std * -1),
        _ende: von,
        acceptedUeberschneidung: {
          _anfang: von,
          _ende: this.addMinuten(von.fullStr, minuten),
          minuten
        }
      };
    }

    return false;
  }

  /**
   * Liefert true, wenn das Feld eine Pre-Dienstgruppe fordert
   */
  get fordertPreDienstgruppe() {
    return this.preDienstgruppeZeitraum && this.preDienstgruppe;
  }

  /**
   * Liefert das Date-Objekt, für die die Einteilung gilt
   */
  get date() {
    return this._getIdsObject('_dates', 'tag', true);
  }

  /**
   * Liefert den Tag als Zahl YYYYMMDD
   */
  get tagZahl() {
    return this._dateZahl(this.tag);
  }

  /**
   * Liefert den Dienst, für den die Einteilung gilt
   */
  get einteilung() {
    return this._getIdsObject('_einteilungen', 'einteilungId', false);
  }

  /**
   * Gibt den eingeteilten Mitarbeiter zurück
   */
  get mitarbeiter() {
    return this._getIdsObject(
      ['_mitarbeiter', '_mitarbeiters'],
      'value',
      false
    );
  }

  /**
   * Liefert das Team des entsprechenden Dienstes
   */
  get team() {
    return this?.dienst?.team || false;
  }

  /**
   * Testet, ob das Feld zu einem Block-Bedarf gehört
   */
  get isBlock() {
    return !!this?.bedarf?.is_block;
  }

  /**
   * Gibt an, ob das Feld leer ist
   */
  get empty() {
    return !this?.mitarbeiter?.id;
  }

  /**
   * Liefert den nächsten Tag
   */
  get nextDay() {
    const day = 86500000;
    const date = new Date(this.tag);
    return formatDate(new Date(date.getTime() + day));
  }

  /**
   * Liefert einen String mit dem Tag und dem Dienst
   */
  get dateDienstLabel() {
    return `${this?.date?.label || this.tag}, ${this?.dienst?.planname || this.dienstId}`;
  }

  /**
   * Liefert die Schichten des Bedarfe.
   * Falls kein Bedarf existiert, wird eine Frei-Schicht
   * für den ganzen Tag geliefert.
   */
  get schichtenWithoutAusgleich() {
    const schichten = this?.bedarf?.schichten;
    if (schichten?.filter) {
      const schichtnrArr = this.schichtnr.split(',');
      return schichtnrArr.includes('0')
        ? schichten
        : schichten.filter((schicht) =>
            schichtnrArr.includes(schicht.schicht_nummer.toString())
          );
    }

    return [
      new FreiSchicht(
        {
          anfang: `${this.tag}T00:00:00.000Z`,
          ende: `${this.nextDay}T00:00:00.000Z`,
          arbeitszeit: 1440,
          dienstId: this.dienstId,
          ausgleich: false
        },
        this._appModel
      )
    ];
  }

  /**
   * Gibt an, ob das Feld überschrieben werden darf
   */
  get writable() {
    return true;
  }

  /**
   * Liefert alle Schichten und die Ausgleichsschichten
   */
  get schichtenWithAusgleich() {
    return this.getAusgleich([...this.schichtenWithoutAusgleich]);
  }

  /**
   * Liefert den Index des Feldes im Bedarf
   */
  get indexInBedarf() {
    return this?.bedarf?.felder?.indexOf
      ? this.bedarf.felder?.indexOf(this)
      : -1;
  }

  /**
   * True, wenn der Bedarf als Block betrachtet werden soll
   */
  get blockChecked() {
    return !!(
      this?.bedarf?.isBlockChecked &&
      this.bedarf.isBlockChecked(this.indexInBedarf)
    );
  }

  /**
   * Liefert alle Schichten des Bedarfes
   * und bei aktiviertem Block-Bedarf zuzüglich den Ausgleichstagen.
   */
  get schichten() {
    const schichten = this.schichtenWithoutAusgleich;
    if (!this.isBlock || this.blockChecked) {
      return this.getAusgleich([...schichten]);
    }
    return schichten;
  }

  /**
   * Liefert den Tag des letzten Bedarfes
   */
  get lastBedarfTag() {
    const tag = this?.bedarf?.lastBedarfTag;
    if (tag) return tag;
    return this.tag;
  }

  /**
   * Testet, ob der Einteilungstag oder eine der Schichten auf ein Wochenende fallen
   */
  get isWeekend() {
    const isWeekend = this?.date?.is_weekend;
    if (!isWeekend) {
      const schichten = this.schichten;
      return !!schichten.find(
        (schicht) => !schicht.isFrei && schicht.isWeekend
      );
    }
    return isWeekend;
  }

  /**
   * Label für das Auswahl-Tab
   */
  get label() {
    const date = `${this?.date?.label || this.tag}`;
    const mitarbeiter = this?.mitarbeiter?.planname;
    const planname = mitarbeiter ? `, ${mitarbeiter}` : '';
    return `${date}, ${this?.dienst?.planname || this.dienstId}${planname}`;
  }

  /**
   * Testet, wieviele Stunden Nachtdienst das Feld hat
   */
  get anteilNachDienst() {
    return this.schichtenWithoutAusgleich.reduce(
      (total, schicht) => total + schicht.anteilNachtDienst,
      0.0
    );
  }

  /**
   * Testet, ob das Feld ein NachtDienst ist.
   * Nachtdienst beinhaltet mindestens 2 Stunden Nachdienst
   */
  get isNachtDienst() {
    return this.anteilNachDienst >= 2.0;
  }

  /**
   * Die Woche, zu der die Einteilung gezählt wird
   */
  get weekCounter() {
    return this?.date?.week_counter || 0;
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _info() {
    const info = this._infoBasis;
    if (this?.date) info.popupInfos.Tag = this.date._feldInfo;
    if (this?.mitarbeiter) {
      info.popupInfos.Mitarbeiter = this.mitarbeiter._feldInfo;
      const team = this.mitarbeiter?.getPrioTeamAm?.(this.tag);
      info.popupInfos.Mitarbeiter.value.currentFeldsTeam = {
        label: 'Prio Team',
        value: team?.name || 'Kein Team'
      };
    }
    return info;
  }

  /**
   * Liefert das Info-Objekt ohne Mitarbeiter-Infos, da Mitarbeiter-Infos
   * die Infos aller Felder enthalten und dadurch eine Endlosschleife entsteht
   */
  get _infoBasis() {
    const mainInfos = {
      id: { value: this.id, label: 'ID' },
      tag: { value: this?.date?.label || this.tag, label: 'Tag' },
      dienst: {
        value: this?.dienst?.planname || this.dienstId.toString(),
        label: 'Dienst'
      },
      value: { value: this.value.toString(), label: 'Eintrag' },
      writable: { value: this.writable ? 'Ja' : 'Nein', label: 'Bearbeitbar' },
      block: { value: this.isBlock ? 'Ja' : 'Nein', label: 'Block' },
      active: {
        value: this.blockChecked ? 'Ja' : 'Nein',
        label: 'Block aktiv'
      },
      isWochenende: {
        value: this.isWeekend ? 'Ja' : 'Nein',
        label: 'Wochenende'
      },
      nachtAnteil: {
        value: this.anteilNachDienst.toString(),
        label: 'Anteil Nachtdienst (Std)'
      },
      isNachtDienst: {
        value: this.isNachtDienst ? 'Ja' : 'Nein',
        label: 'Nachtdienst'
      },
      indexInBedarf: { value: this.indexInBedarf.toString(), label: 'Index' }
    };
    const popupInfos = {};
    if (this?.bedarf) popupInfos.bedarf = this.bedarf._info;
    const schichten = this.schichtenWithAusgleich;
    if (schichten.length) {
      popupInfos.Schichten = { value: {}, label: 'Schichten' };
      schichten.forEach((schicht) => {
        popupInfos.Schichten.value[schicht.schicht_nummer] = schicht._info;
      });
    }
    if (this?.bereich) popupInfos.Bereich = this.bereich._feldInfo;
    const wunsch = this?.mitarbeiter?.getWunschAm?.(this.tag);
    if (wunsch) popupInfos.Wunsch = wunsch._feldInfo;
    if (this?.dienst) popupInfos.Dienst = this.dienst._feldInfo;
    if (this?.einteilung) popupInfos.Einteilung = this.einteilung._feldInfo;
    const konflikte = this.getKonflikt(false)?._info;
    if (konflikte) popupInfos.Konflikte = konflikte;
    return {
      mainInfos,
      popupInfos
    };
  }

  /**
   * Liefert die priorisiereWunsch-Eigenschaft aus dem Dienst
   */
  get priorisiereWunsch() {
    return this.dienst?.priorisiereWunsch;
  }

  /**
   * Liefert die Arbeitszeit dieses Feldes
   */
  get arbeitszeit() {
    const arbeitszeit = {
      Ist: 0,
      Bereitschaft: 0,
      Rufbereitschaft: 0
    };
    if (this?.bedarf) {
      const schichten = this.schichtenWithoutAusgleich;
      schichten?.forEach?.((schicht) => {
        const zeit = (schicht?.arbeitszeit || 0) / 60;
        if (schicht?.isBereitschaftsdienst) {
          arbeitszeit.Bereitschaft += zeit;
        } else if (schicht?.isRufdienst) {
          arbeitszeit.Rufbereitschaft += zeit;
        } else if (schicht?.isArbeit) {
          arbeitszeit.Ist += zeit;
        }
      });
    } else {
      /*
        Urlaub -> Tagessoll
        Krank -> Arbeitszeit aus ursprünglich geplantem Dienst
        Alternativ -> Default_Std aus Dienst (mit VK verrechnen?)
      */
      const defaultStunden = this?.dienst?.defaultStd || 0.0;
      // defaultStunden *= this?.mitarbeiter?.getVK(this?.date?.id);
      const tagesSaldo =
        this?.mitarbeiter?.getStundenTag &&
        this?.dienst?.use_tagessaldo &&
        this?.date?.id
          ? this.mitarbeiter.getStundenTag(this?.date?.id)
          : 0.0;
      arbeitszeit.Ist = tagesSaldo || defaultStunden;
    }
    return arbeitszeit;
  }

  get mitarbeiterHasRotationen() {
    if (!this.mitarbeiter) return true;
    return !!this.mitarbeiter?.hasRotationenAm?.(this.tag);
  }

  get backgroundColor() {
    return this?.dienst?.getColor?.() || '';
  }

  /**
   * Setzt das Value und die Einteilung-Id zurück
   */
  reset() {
    this.setValue('');
    this.setEinteilungId(0);
    this.setArbeitzplatzId(0);
  }

  /**
   * Setzt das Arbeitzplatz-Id Attribut
   * @param {Number} id
   */
  setArbeitzplatzId(id = 0) {
    this._setInteger('arbeitsplatzId', id);
  }

  /**
   * Setzt das isDouble-Flag
   */
  setIsDouble(double = false) {
    this._set('isDouble', double);
    this._update();
  }

  /**
   * Bereitschaftsdienste werden je nach Zeit mit 0.5 oder mit 1 gewertet.
   * @param {Object} typ
   * @returns Number
   */
  arbeitszeittypValue(typ) {
    let result = 0;
    // let isWeekend = false;
    let minuten = 0;
    const schichten = this.schichtenWithoutAusgleich;
    schichten?.forEach?.((schicht) => {
      // if (schicht.isWeekend || Schicht.isFeiertag) isWeekend = true;
      if (schicht.arbeitszeittyp_id === typ?.id) {
        result = 1;
        minuten = schicht.arbeitszeit;
      }
    });

    if (typ?.bereitschaft && result > 0) {
      // Am Wochenende bis 12 Std gilt als 0,5
      // if(isWeekend && minuten <= 720) result = 0.5;
      // An Wochentagen bis 4 Std gilt als 0.5
      // else if(!isWeekend && minuten <= 240) result = 0.5;
      // Geteilte BD Dienste sollen bis zu 12 Std. mit 0.5 gezählt werden
      if (minuten <= 240) result = 0.5;
    }

    return result;
  }

  /**
   * Liefert die Ausgleich-Schichten des Bedarfes
   */
  getAusgleich(schichten = []) {
    return this?.bedarf?.getAusgleich?.(schichten) || schichten;
  }

  /**
   * Entfernt die Einteilung von der Mitarbeiterin
   */
  removeFromMitarbeiter() {
    const e = this?.einteilung;
    return e?.removeFromMitarbeiter?.(this);
  }

  /**
   * Entfernt das Feld
   * @param {Boolean} post
   */
  remove(post = true, addParams = {}) {
    return this.einteilen({
      ...addParams,
      value: '',
      einteilungId: this.einteilungId,
      arbeitsplatzId: this.arbeitsplatzId,
      post,
      eachFeld: post
    });
  }

  /**
   * Setzt die Einteilung-Id
   * @param {Number} einteilungId
   */
  setEinteilungId(einteilungId = 0) {
    this._setInteger('einteilungId', einteilungId);
  }

  /**
   * Eintrag, der im Feld landet
   * @param {String} value
   */
  setValue(value = '') {
    this._set('value', value);
  }

  /**
   * Dom-Element des Feldes
   * @param {String} value
   */
  setRef(ref = false) {
    this._set('ref', ref, false);
  }

  /**
   * Standard-Methode beim Response einer Einteilung. Kann in den Subklassen überschrieben werden.
   * @param {Object} response
   * @param {Object} params
   * @param {Object} old_entry
   */
  defaultResponseCallback(response, params = {}, old_entry = {}) {
    if (response?.id) {
      const einteilung = new Einteilung(response, this?._appModel);
      this.setEinteilungId(einteilung.id);
      this.setArbeitzplatzId(einteilung?.arbeitsplatz_id);
      if (einteilung?.show) {
        this.setValue(einteilung?.mitarbeiter_id);
      }
      einteilung?.add?.(this);
    }
    this.setBlockChecked(true, false);
    this._update();
  }

  /**
   * Entfernt die Einteilung
   */
  removeCurrentEinteilung() {
    const e = this?.einteilung;
    return e?.remove?.();
  }

  /**
   * Iteriert über alle zusammengehörigen Felder eines Blockes.
   * @param {Function} callback
   */
  eachFeldInBlock(callback) {
    if (this?.bedarf?.eachFeldInBlock) {
      this.bedarf.eachFeldInBlock(this, callback);
    }
  }

  /**
   * Iteriert über alle zusammengehörigen Felder eines Blockes.
   * Wenn der Block aktiv ist.
   * @param {Function} callback
   * @param {Boolean} activeBlock
   */
  eachFeldInActivatedBlock(callback, activeBlock = false) {
    if (this.blockChecked || activeBlock) {
      this.eachFeldInBlock(callback);
    }
  }

  /**
   * @param {Function} callback
   * @returns True, wenn alle Felder den gleichen Eintrag haben
   */
  checkBlockFelder(callback = false) {
    let check = false;
    if (this?.bedarf?.checkFelderEintraege) {
      // Haben alle zusammengehörigen Felder eines Blockes den gleichen Eintrag?
      check = this.bedarf.checkFelderEintraege(this);
      if (this._isFunction(callback)) {
        callback(check);
      }
    }
    return check;
  }

  /**
   * Setzt alle Felder eines aktiven Blockes auf den gleichen Wert,
   * wenn sie nicht schon den gleichen Eintrag haben.
   * @param {Boolean} activeBlock
   */
  einteilenEachFeld(activeBlock = false) {
    this.checkBlockFelder((check) => {
      !check &&
        this.eachFeldInActivatedBlock((feld) => {
          feld !== this &&
            feld?.einteilen?.({
              post: true,
              value: this.value,
              eachFeld: false
            });
          return false;
        }, activeBlock);
    });
  }

  /**
   * Ändert das blockChecked-Attribut des Start-Bedarfes
   * @param {Boolean} check
   * @param {Boolean} eachFeld
   */
  setBlockChecked(check = false, eachFeld = false) {
    const checked = this?.bedarf?.setBlockChecked?.(this.indexInBedarf, check);
    if (eachFeld) {
      this.einteilenEachFeld(eachFeld);
    }
    return !!checked;
  }

  /**
   * Teilt das Feld ein
   * @param {Object} params
   */
  einteilen(params = {}) {
    const {
      value = '',
      einteilungId = 0,
      arbeitsplatzId = 0,
      vorschlaegeCallback = false,
      post = false,
      eachFeld = false
    } = params;
    const result = {
      posted: false,
      vorschlaege: []
    };
    const eId = einteilungId || this.einteilungId;
    const oldEntry = {
      value: this.value,
      mitarbeiter: this?.mitarbeiter,
      einteilung: this?.einteilung
    };
    this.setIsDouble(false);
    this.removeCurrentEinteilung();
    this.setEinteilungId(eId);
    this.setArbeitzplatzId(arbeitsplatzId || this.arbeitsplatzId);
    this.setValue(value);
    this.setArbeitzplatzId(arbeitsplatzId || this.arbeitsplatzId);
    if (!this?.mitarbeiter?.id && this._isFunction(vorschlaegeCallback)) {
      result.vorschlaege = this.getVorschlaege(
        value,
        vorschlaegeCallback,
        true
      );
    }
    if (eachFeld && post) {
      this.einteilenEachFeld();
    }
    result.posted = this.postEinteilung(params, oldEntry);
    return result;
  }

  /**
   * Sendet die Einteilung an die API.
   * Einteilung entfernen, mitarbeiterId = 0.
   * Einteilung erstellen / updated, mitarbeiterId != 0.
   * Bei gültiger Einteilung einen neuen überschreibenden Vorschlag erstellen.
   * @param {Object} params
   * @param {Object} oldEntry
   * @returns True, if posted
   */
  postEinteilung(params, oldEntry) {
    const mitarbeiterId = this?.mitarbeiter?.id || 0;
    const einteilungId = this?.einteilungId || 0;
    const send =
      mitarbeiterId || (!mitarbeiterId && oldEntry?.einteilung?.show);
    if (params?.post && this?._hains?.api && send) {
      const data = mitarbeiterId
        ? {
            mitarbeiter_id: mitarbeiterId,
            einteilung_id: einteilungId,
            po_dienst_id: this.dienstId,
            bereich_id: this.bereichId,
            arbeitsplatz_id: this.arbeitsplatzId,
            schichtnr: this.schichtnr,
            tag: this.tag,
            dienstplan_id: this._id || 0,
            einteilungsstatus_id: this._einteilungsstatusId,
            is_optional: !!this.einteilung?.isOptional,
            einteilungskontext_id:
              params?.einteilungskontext_id || this._defaultEinteilungsKontextId
          }
        : { einteilungs_id: einteilungId };
      if (mitarbeiterId) {
        if (params?.isOptional !== undefined) {
          data.is_optional = !!params?.isOptional;
        }
        if (typeof params?.comment === 'string') {
          data.info_comment = params.comment;
        }
        if (typeof params?.contextComment === 'string') {
          data.context_comment = params.contextComment;
        }
      }
      // Aufheben, wenn mitarbeiterID = 0
      const route = mitarbeiterId ? 'einteilen' : 'einteilung_aufheben';
      // if(!params?.ignoreUndo) this?._appModel?.addToUndo?.({
      //   data: deepClone(data),
      //   index: this.indexInBedarf,
      //   feld: this?._me,
      //   oldEntry: Object.entries(oldEntry).reduce((acc, [key, value]) => {
      //     const me = value?._me;
      //     acc[key] = me || deepClone(value);
      //     return acc;
      //   }, {})
      // });
      this._hains.api(route, 'post', data).then((response) => {
        if (!this?._mounted) return;
        this.defaultResponseCallback(response, params, oldEntry);
      }, returnError);
      return true;
    }
    const einteilung = this?._einteilungen?.[einteilungId];
    this.defaultResponseCallback(einteilung, params, oldEntry);
    return false;
  }

  /**
   * Liefert entsprechend dem Feldtypen einen unterschiedlichen Style
   * oder aktualisiert die class
   * @param {String} type
   * @param {Object} mitarbeiter
   * @returns style
   */
  getStyle(type = 'mitarbeiter', mitarbeiter = false) {
    const result = {
      className: '',
      style: null,
      title: [],
      wuensche: false,
      konflikte: this.getKonflikt(mitarbeiter)
    };
    result.title = result.konflikte.title;
    const einteilung = this?.einteilung;
    if (einteilung) {
      const msg = [];
      const arbeitsplatz = einteilung?.arbeitsplatz;
      if (arbeitsplatz?.name) {
        msg.push(`Arbeitsplatz: ${arbeitsplatz.name}`);
      }
      if (einteilung?.info_comment) {
        msg.push(`Kommentar: ${einteilung.info_comment}`);
      }
      if (msg.length) {
        result.title?.unshift?.({
          txt: msg.join('\n'),
          typ: 'Einteilung-Info'
        });
      }
    }

    if (this.isDouble) {
      result.title?.unshift?.({
        txt: 'Einteilung existiert mehrfach.',
        typ: 'Doppelter Eintrag'
      });
    }
    if (!this.mitarbeiterHasRotationen) {
      result.title?.unshift?.({
        txt: 'Mitarbeiter hat keine Rotation.',
        typ: 'Keine Rotation'
      });
    }
    switch (type) {
      case 'mitarbeiter': {
        const m = mitarbeiter || this.mitarbeiter;
        result.className = result.konflikte.className;
        const wuensche = this.wunschSuccess(m, !!mitarbeiter);
        result.title = [...result.title, ...wuensche.msg];
        result.className = `${result.className} ${wuensche.className}`.trim();
        result.wuensche = wuensche;
        break;
      }
      case 'dienst':{
        const bgColor = this.backgroundColor;
        if (bgColor && bgColor !== 'transparent') {
          const {color} = getFontColorByWhite(bgColor);
          result.style = {
            backgroundColor: bgColor,
            color
          };
        }
        break;
      }
      case 'tag':
        if (this?.date?._className) {
          result.className = this.date._className;
        }
        break;
    }
    return result;
  }

  /**
   * Liefert die Konflikte für dieses Feld aus dem Mitarbeiter
   * @param {Object} mitarbeiter
   * @returns object
   */
  getKonflikt(mitarbeiter = false) {
    if (mitarbeiter || this.mitarbeiter) {
      return this.getKonflikteClassTitleAndInfo(mitarbeiter);
    }
    if (this.value !== '') {
      const title = 'Es gibt keinen Mitarbeiter mit diesem Planname!';
      return {
        className: warningClass,
        title: [{ txt: title }],
        _info: {
          value: {
            notFound: { value: title, label: 'notFound' }
          },
          label: 'Konflikte'
        },
        konflikte: false
      };
    }

    return {
      className: '',
      title: [],
      _info: false,
      konflikte: false
    };
  }

  /**
   * Liefert den aktuellen Eintrag
   * @param {Boolean} mitarbeiter
   * @returns Mitarbeiter-Name, Dienst-Name, Tag oder Eintrag
   */
  getValue(type = 'mitarbeiter') {
    switch (type) {
      case 'dienst':
        return this?.mitarbeiter
          ? this?.dienst?.planname || this.dienstId
          : this.value;
      case 'tag':
        return this?.mitarbeiter ? this?.date?.label || this.tag : this.value;
      case 'mitarbeiter':
        return this.mitarbeiter?.planname || this.value;
    }

    return this.value;
  }

  /**
   * Liefert den Namen einer Auswahl
   * @param {Boolean} mitarbeiter
   * @returns Mitarbeiter-Name, Dienst-Name, Tag oder Eintrag
   */
  getAuswahlLabel(type = 'mitarbeiter') {
    switch (type) {
      case 'dienst':
        return this?.dienst?.planname || this.dienstId;
      case 'tag':
        return this?.date?.label || this.tag;
    }
    return this.mitarbeiter?.planname || this.value;
  }

  /**
   * Ermittelt die passenden Vorschlaege für die Einteilung
   * und gibt diese zurück.
   * Falls nur ein Vorschlag gefunden wird,
   * wird das Value mit den entsprechenden id besetzt
   * @param {String} value
   * @param {Function} callback
   * @param {Boolean} setValue
   * @returns array
   */
  getVorschlaege(value = '', callback = false, setValue = false) {
    const mitarbeiter = this?._mitarbeiter || this?._mitarbeiters;
    const result = [];
    let newValue = false;
    if (mitarbeiter?._each && value) {
      const isString = typeof value === 'string';
      const v = isString ? value.toLocaleLowerCase() : parseInt(value, 10);
      mitarbeiter._each((m) => {
        const planname = m.planname.toLowerCase();
        const isInValue = isString && planname.indexOf(v) === 0;
        const isValue = isString
          ? planname === value.toLocaleLowerCase()
          : v === m.id;
        if (m.aktiv && (isInValue || isValue)) {
          if (isValue) newValue = m.id;
          result.push(
            this._isFunction(callback) ? callback(m, this, result.length) : m
          );
        }
      });
    }
    if (setValue && newValue && result.length === 1) {
      this.setValue(newValue);
      this._update();
      return [];
    }
    return result;
  }

  /**
   * Testet, ob die Werte mit den Werten der Felder übereinstimmen
   * @param {String} tag
   * @param {Number} dienstId
   * @param {Number} bereichId
   * @param {String} schichtnr
   * @returns {Boolean} True bei passenden Eigenschaften
   */
  isSame(tag, dienstId, bereichId, schichtnr) {
    const sameDate = this.tag === tag;
    const sameDienst = this.dienstId === dienstId;
    const sameBereich =
      !bereichId || !this.bereichId || this.bereichId === bereichId;
    const sameSchichten = !schichtnr || this.schichtnr === schichtnr;
    return sameDate && sameDienst && sameBereich && sameSchichten;
  }

  /**
   * Debounced die einteilen-Methode
   * @param {Object} params
   */
  debouncedEinteilen = debounce((params) => this.einteilen(params), wait);

  /**
   * Fügt die Funktion dem Register des Mitarbeiters hinzu
   * @param {Function} setState
   */
  pushInMitarbeiter = (setState) => {
    this.mitarbeiter?._push?.(setState);
  };

  /**
   * Entfernt die Funktion aus dem Register der Mitarbeiterin
   * @param {Function} setState
   */
  pullFromMitarbeiter = (setState) => {
    this.mitarbeiter?._pull?.(setState);
  };

  /**
   * Testet die Konflikte bei einem aktiven Block für alle zugehörigen Felder
   * @param {Object} mitarbeiter
   * @param {Object} konflikte
   */
  addKonflikteForBlock(mitarbeiter, konflikte) {
    // Bei Vorschlägen Konflikte für den ganzen Block ermitteln
    if (!mitarbeiter?.checkKonflikte) return false;
    this.eachFeldInActivatedBlock((feld) => {
      if (feld === this) return false;
      const blockFeldKonflikt = mitarbeiter.checkKonflikte(feld, true);
      if (!this._isObject(blockFeldKonflikt)) return false;
      Object.entries(blockFeldKonflikt).forEach((arr) => {
        const [konfliktKey, konflikt] = arr;
        const currentKonflikt = konflikte[konfliktKey];
        const label = `${feld?.date?.label || feld?.tag}, ${feld?.dienst?.planname || feld?.dienstId}`;
        if (!currentKonflikt) {
          konflikte[konfliktKey] = konflikt;
          if (konflikte[konfliktKey].msg) {
            konflikte[konfliktKey].msg = `${label}: ${konflikt.msg}`;
          }
        } else {
          currentKonflikt.msg += `\n${label}: ${konflikt.msg}`;
          if (!isSeriousConflict(currentKonflikt.className)) {
            const { className } = konflikt;
            if (isPossibleConflict(className) || isSeriousConflict(className)) {
              currentKonflikt.className = className;
            }
          }
          if (!currentKonflikt.abwesend) {
            currentKonflikt.abwesend = konflikt.abwesend;
          }
        }
      });
    });
  }

  /**
   * Fügt die Absprachen den Konflikten hinzu
   * @param {Object} mitarbeiter
   * @param {Object} konflikte
   */
  addAbsprachen(mitarbeiter, konflikte) {
    const absprachen = this.getAsprachenInfos(mitarbeiter);
    if (absprachen) {
      konflikte.Absprachen = {
        className: 'absprache',
        msg: absprachen,
        filterKey: 'absprachen'
      };
    }
  }

  /**
   * Liefert title und className und info zu den Konflikten dieses Feldes.
   * Wenn mitarbeiter übergeben wird, wird von einem Vorschlag für
   * dieses Feld ausgegangen.
   * @param {Object} mitarbeiter
   * @returns object
   */
  getKonflikteClassTitleAndInfo(mitarbeiter = false) {
    const m = mitarbeiter || this.mitarbeiter;
    const konflikte = m?.checkKonflikte?.(this, !!mitarbeiter) || {};
    const result = {
      className: '',
      title: [],
      _info: false,
      konflikte,
      showMarker: false
    };
    if (this._isObject(result.konflikte)) {
      this.addKonflikteForBlock(mitarbeiter, result.konflikte);
      this.addAbsprachen(mitarbeiter, result.konflikte);
      Object.entries(result.konflikte).forEach((arr) => {
        const [konfliktKey, konflikt] = arr;
        const { className, msg, maxMsgLength, abwesend, filterKey } = konflikt;
        // Eingeteilte Felder sollen Konflikte mit dem Attribut abwesend
        // nur farblich kennzeichnen, wenn das Abwesend-Attribut true ist
        const konfliktClassName = className?.trim?.() || '';
        const addClass = mitarbeiter
          ? abwesend === undefined || abwesend
          : !(
              this?._konflikteFilter?.isInFilter &&
              !this._konflikteFilter.isInFilter(filterKey)
            );
        if (!result.className.includes(konfliktClassName) && addClass) {
          result.className = `${result.className} ${konfliktClassName}`.trim();
          result.showMarker = true;
        }
        const cleanedKey = konfliktKey.split('_').join(' ');
        if (msg) {
          result.title.push({
            txt: `${cleanedKey}: \n${
              maxMsgLength ? `${msg.slice(0, maxMsgLength)}...` : msg
            }`,
            typ: konfliktKey
          });
          if (!result._info) result._info = { value: {}, label: 'Konflikte' };
          result._info.value[konfliktKey] = {
            value: msg,
            label: cleanedKey,
            className: addClass ? konfliktClassName : ''
          };
        }
      });
    }
    return result;
  }

  /**
   * Testet, ob durch die einteilung ein Wunsch erfüllt wird.
   * @param {Object} mitarbeiter
   * @param {Boolean} vorschlag
   * @returns Object
   */
  wunschSuccess(mitarbeiter, vorschlag = false) {
    const result = {
      wuensche: [],
      msg: [],
      score: 0,
      className: '',
      labelClasses: [],
      label: []
    };
    const tage =
      vorschlag && this.blockChecked && this?.bedarf?.getBlockTage
        ? this.bedarf.getBlockTage()
        : [this.tag];
    tage.forEach((tag) => {
      const wunsch = mitarbeiter?.getWunschAm?.(tag);
      if (!wunsch) {
        result.score += 0.5;
        return;
      }
      const score = wunsch.hasDienst(this.dienstId) ? 1 : 0;
      const label = wunsch.getInitialien();
      const className = score ? wunschErfuellt : possibleConflict;
      result.wuensche.push(wunsch);
      const msg = `\n${this?._dates?.[tag]?.label || tag} ${wunsch.getName()} (${score ? 'erfüllt' : 'nicht erfüllt'})`;
      if (!result.msg?.[0]?.txt) {
        result.msg[0] = {
          txt: msg,
          typ: `${score ? 'Wunsch ist erfüllt' : 'Wunsch nicht erfüllt'}`
        };
      } else {
        result.msg[0].txt += msg;
      }
      if (!result.label.includes(label)) {
        result.label.push(label);
      }
      const wunschDayClass =
        this.tag === tag ? currentWunschDay : otherWunschDay;
      if (!result.labelClasses.includes(className))
        result.labelClasses.push(className);
      if (!result.labelClasses.includes(wunschDayClass))
        result.labelClasses.push(wunschDayClass);
      if (this.tag === tag && score) {
        result.className = wunschErfuellt;
      }
      result.score += score;
    });
    const l = result.wuensche.length;
    if (l > 0) {
      result.score /= l;
      result.check = true;
      result.labelClasses = result.labelClasses.join(' ').trim();
      result.msg[0].txt = `Wünsche:${result.msg[0].txt}`;
    } else {
      result.score = 0.5;
      result.label = false;
    }

    return result;
  }

  /**
   * @param {String} start
   * @param {Number} std
   * @returns Object
   */
  addStunden(start, std = 0) {
    const bis = new Date(start);
    bis.setTime(bis.getTime() + std * 3600000);
    return this._formatTime(bis.toISOString());
  }

  /**
   * @param {String} start
   * @param {Number} std
   * @returns Object
   */
  addMinuten(start, std = 0) {
    const bis = new Date(start);
    bis.setTime(bis.getTime() + std * 60000);
    return this._formatTime(bis.toISOString());
  }

  /**
   * Setzt den Counter zurück
   */
  static resetCounter() {
    counter = 1;
  }

  /**
   * Registriert das setState bei dem StartBedarf
   * @param {Function} setState
   */
  pushInStartBedarf = (setState) => {
    const start = this?.bedarf?.startBedarfsEintrag;
    start?._push && start._push(setState);
  };

  /**
   * Entfernt das setState aus Register des StartBedarfs
   * @param {Function} setState
   */
  pullFromStartBedarf = (setState) => {
    const start = this?.bedarf?.startBedarfsEintrag;
    start?._pull && start._pull(setState);
  };

  /**
   * Liefert die Arbeitszeit dieses Feldes für einen bestimmten Arbeitszeittyp.
   * Ausgleichsschichten werden nicht betrachtet.
   * @param {Object} typ
   */
  countArbeitszeitTyp(typ) {
    let arbeitszeit = 0;
    if (this?.bedarf) {
      const schichten = this.schichtenWithoutAusgleich;
      schichten?.forEach?.((schicht) => {
        const zeit = (schicht?.arbeitszeit || 0) / 60;
        if (schicht?.arbeitszeittyp === typ) {
          arbeitszeit += zeit;
        }
      });
    }
    return arbeitszeit;
  }

  /**
   * Erstellt die Informationen zu dem Feld
   */
  setInfo() {
    this._setPageInfoPopup(`Feld: ${this.id}`, this);
  }

  /**
   * Liefert einen String mit den Informationen zu den Absprachen
   * @param {Object} mitarbeiter
   */
  getAsprachenInfos(mitarbeiter = false) {
    const m = mitarbeiter || this.mitarbeiter;
    const absprachen = m?.getAbsprachenInfos?.(
      this.date,
      this.dienst,
      this.bereich
    );
    return absprachen || '';
  }
}

export default Feld;
