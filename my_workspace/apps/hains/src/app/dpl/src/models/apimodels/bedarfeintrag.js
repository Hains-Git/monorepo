import { formatDate } from '../../tools/dates';
import Basic from '../basic';
import FreiSchicht from '../helper/freischicht';

/**
 * Klasse um ein Bedarfeintrag-Objekt zu erstellen.
 * @class
 */
class Bedarfeintrag extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set('ausgleich_tage', obj.ausgleich_tage);
    this._setInteger('dienstbedarf_id', obj.dienstbedarf_id);
    this._setInteger('bereich_id', obj.bereich_id);
    this._setInteger('dienstverteilungstyp_id', obj.dienstverteilungstyp_id);
    this._setInteger('dienstplanbedarf_id', obj.dienstplanbedarf_id);
    this._set('first_entry', obj.first_entry);
    this._setInteger('kostenstelle_id', obj.kostenstelle_id);
    this._setInteger('id', obj.id);
    this._set('is_block', obj.is_block);
    this._setInteger('opt', obj.opt);
    this._setInteger('min', obj.min);
    this._setInteger('po_dienst_id', obj.po_dienst_id);
    this._set('tag', formatDate(obj.tag));
    this._set('verteilungscode', obj.verteilungscode);
    this.setGettersInObj();
    this.resetAttributes();
    if (preventExtension) this._preventExtension();
  }

  /**
   * Setzt getters in Objekt, auf welches dann zugegriffen werden kann.
   */
  setGettersInObj() {
    this._setGetter('dienst', () =>
      this._getIdsObject(['_dienste', '_po_dienste'], 'po_dienst_id', true)
    );
  }

  /**
   * Liefert den Tag als Zahl für Vergleiche mit <,> YYYYMMDD
   */
  get tagzahl() {
    return this._dateZahl(this.tag);
  }

  /**
   * Liefert first_entry, das entspricht dem ersten Bedarfseintrag eines Blockes
   */
  get startBedarfId() {
    return this.first_entry;
  }

  /**
   * Liefert den ersten Bedarfseintrag eines Blockes
   */
  get startBedarfsEintrag() {
    return this._getIdsObject('_bedarfseintraege', 'startBedarfId', true);
  }

  /**
   * Liefert den zugehörigen Bedarf
   */
  get bedarf() {
    return this._getIdsObject('_bedarfe', 'dienstbedarf_id', true);
  }

  /**
   * Liefert die Arbeitszeitverteilung aus dem Bedarf oder false, falls diese nicht gefunden wurde
   */
  get arbeitszeitverteilung() {
    return this?.bedarf?.arbeitszeitverteilung || false;
  }

  /**
   * Liefert den Tag aus dem ersten Bedarfseintrag eines Blockes
   */
  get startTag() {
    const start = this.startBedarfsEintrag;
    return start ? start.tag : this.tag;
  }

  /**
   * Liefert true wenn gesamt Bedarf voll ist.
   */
  get isFull() {
    return this.felder.length >= this.gesamtBedarf;
  }

  get addOpt() {
    let min = 0;
    const count = this.felder.reduce((acc, feld) => {
      if (feld?.empty) return acc;
      if (feld?.einteilung?.is_optional) acc++;
      else min++;
      return acc;
    }, 0);
    return count < this.opt && count + min < this.gesamtBedarf;
  }

  /**
   * Liefert das zugehörige Datum
   */
  get date() {
    return this._getIdsObject('_dates', 'tag', true);
  }

  /**
   * Liefert die Schichten des Bedarfseintrages
   */
  get schichten() {
    return this._getIdsObject('_schichten', 'id', true);
  }

  /**
   * Liefert den Dienstverteilungstyp des Bedarfseintrages
   */
  get dienstverteilungstyp() {
    return this._getIdsObject(
      '_dienstverteilungstypen',
      'dienstverteilungstyp_id',
      true
    );
  }

  /**
   * Liefert den zugehörigen Bereich
   */
  get bereich() {
    return this._getIdsObject('_bereiche', 'bereich_id', true);
  }

  /**
   * Liefert die zugehörige Kostenstelle
   */
  get kostenstelle() {
    return this._getIdsObject('_kostenstellen', 'kostenstelle_id', true);
  }

  /**
   * Liefert die geforderte Dienstgruppe
   */
  get dienstgruppe() {
    return this?.arbeitszeitverteilung?.dienstgruppe || false;
  }

  /**
   * Liefert die geforderte Dienstgruppe
   */
  get preDienstgruppe() {
    return this?.arbeitszeitverteilung?.preDienstgruppe || false;
  }

  /**
   * Liefert die Stunden, die an die letzte Schicht angehängt werden sollen,
   * an denen auf eine Dienstgruppe getestet wird.
   */
  get dienstgruppeStd() {
    return this?.arbeitszeitverteilung?.std || 0.0;
  }

  /**
   * Liefert die Stunden, die an die letzte Schicht angehängt werden sollen,
   * an denen auf eine Dienstgruppe getestet wird.
   */
  get preDienstgruppeStd() {
    return this?.arbeitszeitverteilung?.pre_std || 0.0;
  }

  /**
   * Liefert die Minuten, die sich die Arbeitszeitverteilung mit der geforderten
   * Dienstruppe überschneiden darf.
   */
  get preAcceptedUeberschneidung() {
    return this?.arbeitszeitverteilung?.pre_ueberschneidung_minuten || 0.0;
  }

  /**
   * Liefert den Gesamten Bedarf
   */
  get gesamtBedarf() {
    return this.min + this.opt;
  }

  /**
   * Liefert ein Info-Objekt
   */
  get _info() {
    const bedarfeintragInfos = {
      id: { value: this.id.toString(), label: 'ID' },
      dienst: {
        value: this?.dienst?.planname || this.po_dienst_id.toString(),
        label: 'Dienst'
      },
      tag: { value: this?.date?.label || this.tag, label: 'Tag' },
      ausgleich: {
        value: this.ausgleich_tage.toString(),
        label: 'Ausgleich (Tage)'
      },
      min: { value: this.min.toString(), label: 'Min. Bedarf' },
      max: { value: this.gesamtBedarf.toString(), label: 'Max. Bedarf' },
      block: { value: this.is_block ? 'Ja' : 'Nein', label: 'Blockbedarf' }
    };

    if (this.is_block) {
      bedarfeintragInfos.first = {
        value: this.startBedarfId.toString(),
        label: 'Start Eintrag'
      };
      const l = this.block_ids?.length || 0;
      if (l > 1) {
        bedarfeintragInfos.blockBedarfe = { value: {}, label: 'Block' };
        this.block_ids?.forEach?.((bId) => {
          if (bId === this.id) return false;
          const bedarf = this?._bedarfseintraege?.[bId];
          if (bedarf?._info) {
            bedarfeintragInfos.blockBedarfe.value[bId] = {
              value: bedarf._info.value,
              label: bedarf?.date?.label || this.tag
            };
          }
        });
      }
    }

    const bereich = this.bereich;
    if (bereich) bedarfeintragInfos.bereich = bereich._feldInfo;
    if (this?.dienstverteilungstyp) {
      bedarfeintragInfos.verteilungstyp = this.dienstverteilungstyp._info;
    }
    const schichten = this.schichten;
    if (schichten?.forEach) {
      const allSchichten = this?.ausgleich_tage
        ? this.getAusgleich(schichten)
        : schichten;
      bedarfeintragInfos.schichten = {
        value: {},
        label: 'Schichten',
        ignore: true
      };
      bedarfeintragInfos.ausgleichSchichten = {
        value: {},
        label: 'Ausgleich',
        ignore: true
      };
      allSchichten.forEach((schicht) => {
        if (schicht?.ausgleich) {
          bedarfeintragInfos.ausgleichSchichten.ignore = false;
          bedarfeintragInfos.ausgleichSchichten.value[schicht.schicht_nummer] =
            schicht._info;
        } else {
          bedarfeintragInfos.schichten.ignore = false;
          bedarfeintragInfos.schichten.value[schicht.schicht_nummer] =
            schicht._info;
        }
      });
    }

    if (this?.bedarf) {
      bedarfeintragInfos.bedarf = {
        value: this.bedarf._info,
        label: 'Dienstbedarf'
      };
    }

    return {
      value: bedarfeintragInfos,
      label: 'Bedarf'
    };
  }

  /**
   * Liefert ein Info-Objekt für die Dienste
   */
  get _dienstInfo() {
    return {
      value: this._info.value,
      label: this?.dienst?.planname || this.po_dienst_id.toString(),
      sort: this?.dienst?.planname || 'zzz'
    };
  }

  /**
   * Liefert ein Info-Objekt für die Dates
   */
  get _dateInfo() {
    return {
      value: this._info.value,
      label: this?.date?.label || this.tag,
      sort: this.tagzahl
    };
  }

  /**
   * Liefert den Tag des letzten Bedarfes eines Blockes.
   * Falls keiner gefunden wird, wird der Tag des Bedarfes geliefert.
   */
  get lastBedarfTag() {
    if (this.is_block) {
      const startBedarf = this.startBedarfsEintrag;
      const block_ids = startBedarf?.block_ids;
      const l = (block_ids?.length || 0) - 1;
      const lastId = block_ids?.[l];
      const tag = l && this._bedarfseintraege?.[lastId]?.tag;
      if (tag) return tag;
    }

    return this.tag;
  }

  /**
   * Setzt einige Attribute zurück
   * @returns {Object} block_ids, felder, checkedBlock
   */
  resetAttributes() {
    this._setArray('block_ids', []);
    this._setArray('felder', []);
    this._setArray('checkedBlock', []);
    return {
      block_ids: this.block_ids,
      felder: this.felder,
      checkedBlock: this.checkedBlock
    };
  }

  /**
   * Liefert die Ausgleich-Schichten des Bedarfes
   */
  getAusgleich(schichten = []) {
    const ausgleich = this?.ausgleich_tage || 0;
    const lastTag = this.lastBedarfTag;
    // Auslgeich nur an den letzten Tag eines Blockes anhängen
    if (this.tag === lastTag && ausgleich && schichten?.length) {
      let lastSchicht = schichten[schichten.length - 1];
      // Für jeden Folgetag eine Schicht Frei von ende vorheriger Schicht
      // bis 0 Uhr des folgenden Tages einfügen
      const date = new Date(lastTag);
      // Ausgleich endet frühestens am Anfang des übernächsten Tages
      // Damit liegt der Start auf dem Folgetag
      date.setDate(date.getDate() + 1);
      for (let i = 0; i < ausgleich && lastSchicht; i++) {
        // Tag um 1 raufzählen
        date.setDate(date.getDate() + 1);
        const [anfang, ende] = [
          lastSchicht.ende,
          `${formatDate(date)}T00:00:00.000Z`
        ];
        // Arbeitszeit in min
        const arbeitszeit =
          (new Date(ende).getTime() - new Date(anfang).getTime()) / 60000;
        // Neue Schichten nur hinzufügen, wenn sie die vorhandenen Schichten ergänzen
        if (arbeitszeit <= 0) continue;
        lastSchicht = new FreiSchicht(
          {
            id: `ausgleich_${this.id}_${i}`,
            anfang,
            ende,
            arbeitszeit,
            dienstId: this.po_dienst_id,
            ausgleich: true,
            bedarfs_eintrag_id: this.id,
            schicht_nummer: lastSchicht.schicht_nummer + 1
          },
          this._appModel
        );
        schichten.push(lastSchicht);
      }
    }
    return schichten;
  }

  /**
   * Fügt ein feld dem Felder-Attribut hinzu
   * und führt setBlockChecked(index, true) aus.
   * @param {Object} feld
   * @returns {Array} felder
   */
  addFeld(feld) {
    if (!this.felder.includes(feld)) {
      const i = this.felder.length;
      this.felder.push(feld);
      this.setBlockChecked(i, true);
    }
    return this.felder;
  }

  /**
   * Entfernt ein Feld aus dem Felder-Attribut.
   * Entfernt einen index aus dem checkedBlock-Attribut.
   * @param {Object} feld
   * @returns {Array} felder
   */
  removeFeld(feld) {
    const i = this.felder.indexOf(feld);
    if (i >= 0) {
      this.felder.splice(i, 1);
      const checkedBlock = this?.startBedarfsEintrag?.checkedBlock;
      const l = checkedBlock?.length || 0;
      if (l > this.felder.length && checkedBlock?.[i] !== undefined) {
        this.startBedarfsEintrag.checkedBlock.splice(i, 1);
      }
    }
    return this.felder;
  }

  /**
   * Setzt das Checked-Attribut für den Start-Bedarf.
   * True nur, wenn alle Felder auch den gleichen value haben.
   * Wenn der Wert sich ändert, dann wird _update() ausgeführt.
   * @param {Number} index
   * @param {Boolean} checked
   * @returns {Boolean} Checked-Attribut
   */
  setBlockChecked(index = 0, checked = false) {
    const start = this?.is_block && this?.startBedarfsEintrag;
    const l = start?.block_ids?.length || 0;
    if (index < 0 || l < 2 || !this._isArray(start?.checkedBlock)) {
      return false;
    }
    const result = !!(
      checked && this.checkFelderEintraege(this?.felder?.[index])
    );
    const oldChecked = start.isBlockChecked(index);
    start.checkedBlock[index] = result;
    if (oldChecked !== result) {
      start._update();
    }
    return !!result;
  }

  /**
   * Liefert das blockChecked-Attribut aus dem Start-Bedarf.
   * @param {Number} index
   * @returns {Boolean} true,
   * wenn der is_block true ist
   * und Block-Checked-Index true ist
   * und mindestens zwei Bedarfseinträge im Block sind.
   */
  isBlockChecked(index = 0) {
    const start = this?.is_block && this?.startBedarfsEintrag;
    const l = (start && start?.block_ids?.length) || 0;
    return !!(l > 1 && start?.checkedBlock?.[index]);
  }

  /**
   * Iteriert über alle zusammengehörigen Felder eines Blockes
   * und führt eine Funktion aus.
   * @param {Object} feld
   * @param {Function} callback
   * @returns {Boolean} true, wenn alle Felder iteriert werden konnten.
   */
  eachFeldInBlock(feld, callback) {
    const blockIds = this.is_block && this.startBedarfsEintrag?.block_ids;
    const l = blockIds?.length || 0;
    if (l < 2) return false;
    const feldIndex = this.felder.indexOf(feld);
    if (feldIndex >= 0) {
      for (let i = 0; i < l; i++) {
        const bedarf = this?._bedarfseintraege?.[blockIds[i]];
        const nextFeld = bedarf?.felder?.[feldIndex];
        const result = callback(nextFeld);
        if (result) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Testet, ob alle Felder eines Blockes den gleichen Value haben.
   * @param {Object} feld
   */
  checkFelderEintraege(feld) {
    if (!feld) return false;
    const value = feld.value;
    let same = true;
    const felder = [];
    this.eachFeldInBlock(feld, (nextFeld) => {
      felder.push(nextFeld);
      same = nextFeld && value === nextFeld.value;
      return !same;
    });
    return !!same;
  }

  /**
   * Fügt den block_ids eine bedarfeintrag-Id hinzu
   * @param {Number} beId
   * @returns {Array} block_ids
   */
  addToBlock(beId) {
    if (this.is_block) {
      const id = parseInt(beId, 10);
      if (!this.block_ids.includes(id)) {
        this.block_ids.push(id);
        // Bedarfe nach Tag aufsteigend sortieren
        this.block_ids.sort((a, b) => {
          const sortA = this?._bedarfseintraege[a]?.tagzahl || 0;
          const sortB = this?._bedarfseintraege[b]?.tagzahl || 0;
          return sortA - sortB;
        });
      }
    }

    return this.block_ids;
  }

  /**
   * Liefert alle Tage eines Blockes
   * @returns Array
   */
  getBlockTage() {
    const tage = [this.tag];
    this.startBedarfsEintrag.block_ids?.forEach?.((bId) => {
      if (bId === this.id) return;
      const bedarf = this?._bedarfseintraege?.[bId];
      if (bedarf?.tag) tage.push(bedarf?.tag);
    });
    return tage;
  }
}

export default Bedarfeintrag;
