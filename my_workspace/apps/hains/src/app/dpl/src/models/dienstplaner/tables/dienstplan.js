import React from 'react';
import BedarfCounter from '../../../components/dienstplaner/bedarf-counter/BedarfCounter';
import Label from '../../../components/dienstplaner/label/Label';
import TableMenue from '../../../components/dienstplaner/table-menue/TableMenue';
import { highlightByTableSearchClass, zIndexes } from '../../../styles/basic';
import { debounce, shortwait, throttle, wait } from '../../../tools/debounce';
import { booleanPlanerDateSearch, booleanSearch, createSearchGroup, numericLocaleCompare, setPageWarning } from '../../../tools/helper';
import FilterVorlage from '../filtervorlagen/filtervorlage';
import Table from './helper/table';
import { returnError } from '../../../tools/hains';
import CustomFelder from './benutzerdefinierte-felder/customfelder';
import CustomCounterTitle from '../../../components/dienstplaner/table/customfeld/CustomCounterTitle';
import CustomCounter from '../../../components/dienstplaner/table/customfeld/CustomCounter';
import { showConsole, showExport } from '../../../tools/flags';
import { addContent, addKeys, notMainZeitraum } from './helper/export';
import { autoA4SizePDFTable, downloadCSV, pushToMitarbeiterDetails } from '../../../util_func/util';
import { getFontColorByWhite, hexToRgb, rgbToHex } from '../../../../joomla/helper/util';

/**
 * Liefert die Vorlage für die Default-Dienstplan-Tabelle
 * @param {Function} createId
 * @param {String} name
 * @returns object
 */
export const defaultDienstplanTable = (
  createId = () => '',
  name = '',
  className = ''
) => ({
  id: createId(name),
  fontSizeFaktor: 0,
  visible: true,
  className: `${name} ${className}`,
  style: {
    width: '100%',
    height: '100%',
    overflow: 'scroll',
    display: 'block',
    position: 'relative'
  },
  head: {
    id: createId('head'),
    visible: true,
    style: {
      position: 'sticky',
      top: '0px',
      zIndex: zIndexes.z6
    }
  },
  body: {
    id: createId('body'),
    visible: true
  },
  foot: {
    id: createId('foot'),
    visible: true
  }
});

/**
 * Erstellt ein DiensplanTable-Objekt
 * @class
 */
class DienstplanTable extends Table {
  constructor(obj = {}, createId = () => '', appModel = false) {
    super(obj, appModel, false);
    this._set('createId', createId);
    this._setArray('keyCodes', [
      'ArrowLeft',
      'ArrowRight',
      'ArrowDown',
      'ArrowUp',
      'Enter'
    ]);
    this.setFilterVorlage(false);
    this.setShowToggle();
    this._setInteger('defaultEnd', 10);
    this.setAuswahl();
    this.resetEnd(false);
    this._setObject('searchGroups', {
      dienste: createSearchGroup(this, 'dienste'),
      mitarbeiter: createSearchGroup(this, 'mitarbeiter'),
      dates: createSearchGroup(this, 'dates')
    });
    this._set("ignoreBaseSearchValueFor", "dates");
    this._set("checkForNotIgnoringBaseSearchValue", "mitarbeiter");
    this._set('customFelder', new CustomFelder(this, this?._appModel));
    this.setSearchValues();
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  get farbgruppenOptions() {
    return {
      dienste: true,
      dienstkategorien: true,
      einteilungskontext: true,
      farbgruppen: true
    }
  }

  /**
   * Einstellung welche Abfragen im Export angezeigt werden sollen
   */
  get exportAbfrage() {
    return {
      checkBedarfeAbfrage: true,
      onlyMainZeitraumAbfrage: true,
      withCounterAbfrage: true,
      withWunschAbfrage: true,
      withColorAbfrage: true
    };
  }

  /**
   * Liefert die Default-Parameter für die Filter-Vorlage
   */
  get defaultFilterVorlageParams() {
    return {};
  }

  /**
   * Zeigt die Informationen zum Dienstplan
   */
  get showName() {
    return {
      name: `${this?._id}: ${this?._name}`,
      title: [
        { txt: `Dienstplan-ID: ${this?._id}` },
        { txt: `Dienstplan-Name: ${this?._name}` },
        { txt: `Planmonat: ${this?._anfang?.str} - ${this?._ende?.str}` }
      ]
    };
  }

  /**
   * Liefert entweder eine Filter-Vorlage mit den Default-Parametern
   */
  get defaultFilterVorlage() {
    return new FilterVorlage(
      {
        ...this.defaultFilterVorlageParams,
        parent: this,
        uncheckAllButton: false,
        resetDefaultParams: false
      },
      this._appModel
    );
  }

  /**
   * Liefert, ob die Wuensche angezeigt werden sollen
   * @returns {Boolean} Boolean
   */
  get addWuensche() {
    return !!this?._user?.dienstplanTableSettings?.wuensche;
  }

  /**
   * Liefert ob nur die Dienste aus der Vorlage angezeigt werden sollen
   * @returns {Boolean} Boolean
   */
  get onlyVorlageDienste() {
    return !!this?._user?.dienstplanTableSettings?.only_vorlagedienste;
  }

  /**
   * Liefert ob nur der Planungszeitraum angezeigt werden soll
   * @returns {Boolean} Boolean
   */
  get onlyPlanungszeitraum() {
    return !!this?._user?.dienstplanTableSettings?.only_planungszeitraum;
  }

  get emptyAsRegeldienst() {
    return !!this?._user?.dienstplanTableSettings?.empty_as_regeldienst;
  }

  /**
   * Liefert ob der Einteilungsstatus markiert werden soll
   * @returns {Boolean} Boolean
   */
  get markEinteilungsstatus() {
    return !!this?._user?.dienstplanTableSettings?.mark_einteilungsstatus;
  }

  /**
   * Liefert die Dienste in der vorgesehenen Reihenfolge
   */
  get orderedDienste() {
    const dienste = this?._dienste._each?.()?.arr || [];
    return dienste.sort((a, b) => a.order - b.order);
  }

  /**
   * Liefert das tableSearchHighlight-Attribut
   */
  get tableSearchHighlight() {
    return !!this?._page?.tableSearchHighlight;
  }

  /**
   * Liefert die Mitarbeiter in alphabetischer Reihenfolge
   */
  get orderedMitarbeiter() {
    const mitarbeiter = this?._page?.orderedMitarbeiter || [];
    return mitarbeiter;
  }

  get sortings() {
    return this?._page?.tableSortings || [];
  }

  get sortStart() {
    return this?._user?.dienstplanTableSettings?.mitarbeiter_sort || 0;
  }

  /**
   * Index der Ansicht im Dienstplan
   */
  get ansichtIndex() {
    return 0;
  }

  /**
   * Liefert den Namen für die Veröffentlichung
   */
  get publishName() {
    return 'Dienstplan';
  }

  /**
   * Liefert true, wenn die Tabelle veröffentlicht werden kann
   */
  get publishable() {
    return (
      this?._vorlage?.isPublishable?.(this.publishName)
    );
  }

  /**
   * Liefert den Namen der Tabelle
   */
  get filename() {
    const anfang = this._anfang?.str || 'Unbekannt';
    const yearMonth = anfang.split('-').slice(0, 2).join('-');
    return `${this.publishName}_${yearMonth}`;
  }

  /**
   * Liefert ein Array mit den Positionen der customColumns
   */
  get customColumnsPositions() {
    const columns = [];
    const cells = this.firstHeadRow?.cells;
    const lc = cells?.length || 0;
    for (let i = 1; i < lc; i++) {
      const cell = cells[i];
      if (cell?.id?.includes?.('custom')) {
        columns.push(i);
      } else break;
    }
    return columns;
  }

  /**
   * Liefert die erste Zeile des Tabellenkopfes
   */
  get firstHeadRow() {
    return this?.head?.rows?.[0];
  }

  get allEinteilungenPublic() {
    let res = true;
    this?.body?.eachRow?.((row) => {
      if(!res) return;
      row?.eachCell?.((cell) => {
        if(!cell?.el || !res) return;
        if(!cell?.el?.allEinteilungenPublic) {
          res = false;
        }
      }, true);
    }, true);
    return res;
  }

  /**
   * Setzt das Auswahl-Attribut
   * @param {Object} auswahl
   */
  setAuswahl(auswahl = false) {
    this._set('auswahl', auswahl);
  }

  /**
   * Setzt die SearchValues der Gruppen zusammen zu einem String
   * @returns String
   */
  joinSearchGroupValues() {
    const searchGroups = this?.searchGroups || {};
    const searchValues = Object.values(searchGroups).map(
      (group) => group?.check?.length || group?.searchValue || ''
    );
    return searchValues.join('');
  }

  /**
   * Ändert das aktuelle Such-Wort
   * @param {String} value
   */
  setSearchValues(value = '') {
    this._set('searchValue', typeof value === 'string' ? value : '');
    this._set('joinedSearchValue', this.joinSearchGroupValues());
  }

  /**
   * Setzt Ende von Zeilen und Spalten zurück und triggert ggf. ein update der Tabelle
   * @param {Boolean} update
   */
  resetEnd(update = false) {
    this.setCellEnd(this.defaultEnd);
    this.setRowEnd(this.defaultEnd);
    if (update) {
      this.updateSearch();
    }
  }

  updateUIAndUser() {
    this.updateBodys();
    this?._user?._update?.();
  }

  /**
   * Setzt das addWuensche-Attribut und triggert ggf. ein update der Tabelle
   * @param {Boolean} add
   * @param {Boolean} update
   */
  setAddWuensche(add = true) {
    this?._user?.setAddWunesche?.(add);
    this.updateUIAndUser();
  }

  /**
   * Setzt das onlyVorlageDienste-Attribut und triggert ggf. ein update der Tabelle
   * @param {Boolean} add
   * @param {Boolean} update
   */
  setOnlyVorlageDienste(only = false) {
    this?._user?.setOnlyVorlageDienste?.(only);
    this.updateUIAndUser();
  }

  setOnlyPlanungszeitraum(only = false) {
    this?._user?.setOnlyPlanungszeitraum?.(only);
    this.updateUIAndUser();
  }

  setEmptyAsRegeldienst(empty = false) {
    this?._user?.setEmptyAsRegeldienst?.(empty);
    this.updateUIAndUser();
  }

  setMarkEinteilungsstatus(mark = false) {
    this?._user?.setMarkEinteilungsstatus?.(mark);
    this.updateUIAndUser();
    this?._page?._setState?.(mark, "markEinteilunsstatus");
  }

  /**
   * Setzt das FilterVorlage-Attribut
   * @param {Object} filterVorlage
   */
  setFilterVorlage(filterVorlage = false) {
    this._set('filterVorlage', filterVorlage);
  }

  /**
   * Attribut, welches das Togglen von Diensten/Wünschen im Tabellen-Menü ermöglicht
   * @param {Boolean} wuensche
   * @param {Boolean} dienste
   */
  setShowToggle(wuensche = false, dienste = false) {
    this._set('showToggleWuensche', wuensche);
    this._set('showToggleDienste', dienste);
  }

  /**
   * Fügt dem Kopf das Tabellen-Menue hinzu
   * @param {Object} param0
   */
  createTableMenue() {
    return (
      this?.head?.addRow?.({
        visible: true,
        id: this.createId('headrow', 0),
        cells: [
          {
            id: this.createId('headcell', 0, 0),
            visible: true,
            header: true,
            style: {
              position: 'sticky',
              left: '0px',
              zIndex: zIndexes.z6
            },
            getColumn: () => this.getColumn(0),
            getContent: (component = true) =>
              component ? (
                <TableMenue
                  farbgruppen={this?._farbgruppen}
                  konfliktFilter={this?._konflikteFilter}
                  filterVorlage={this.filterVorlage}
                  table={this}
                />
              ) : (
                'Menü'
              )
          }
        ]
      })
    );
  }

  /**
   * Erstellt eine neue Zeile im Body mit einer Mitarbeiterin als erste Zelle
   * @param {Object} mitarbeiter
   * @param {*} cellId
   * @param {*} rowId
   * @returns Zeile
   */
  defaultMitarbeiterRow(mitarbeiter = false, rowPos = 0) {
    return (
      this?.body?.addRow?.({
        id: this.createId('bodyrow', rowPos),
        mitarbeiterId: mitarbeiter?.id,
        visible: true,
        cells: [
          {
            id: this.createId('bodymitarbeiter', rowPos, 0),
            visible: true,
            header: true,
            mitarbeiterId: mitarbeiter?.id,
            className: mitarbeiter?.class || '',
            style: {
              position: 'sticky',
              left: '0px',
              zIndex: zIndexes.z5,
              fontSize: '1.1em'
            },
            getColumn: () => this.getColumn(0),
            getContent: (component = true) =>
              component ? (
                <Label
                  name={mitarbeiter?.cleanedPlanname || ''}
                  parent={mitarbeiter}
                  onDoubleClick={() => {
                    pushToMitarbeiterDetails(mitarbeiter?.id || 0);
                  }}
                />
              ) : (
                mitarbeiter?.planname || ''
              )
          }
        ]
      })
    );
  }

  /**
   * Erstellt ein Objekt für den BedarfCounter
   * @param {Object} el
   * @returns {Object} Object
   */
  getBedarfCounterElement(el) {
    return {
      el,
      getCurrentBedarf: () => el?.getCurrentBedarf?.(),
      _push: this?._einteilungsstatusAuswahl?._push,
      _pull: this?._einteilungsstatusAuswahl?._pull
    };
  }

  /**
   * Fügt der ersten Zeile des Tabellenkopfes eine Zelle als Date hinzu.
   * Auerßdem wird eine Column erstellt
   * @param {Object} date
   * @returns Zeile
   */
  createDateHeadCell(date) {
    const row = this.head?.rows?.[0];
    const cellPos = row?.length || 0;

    const cell = row?.addCell?.({
        id: this.createId('headdate', 0, cellPos),
        visible: true,
        header: true,
        dateId: date?.id,
        className: date?._className || '',
        getColumn: () => this.getColumn(cellPos),
        getContent: (component = true) =>
          component ? (
            <>
              <Label
                name={date?.week_day || ''}
                title={date?.feiertagName || ''}
              />
              <Label
                name={`${date?.day}.${date?.month_nr}.` || ''}
                title={date?.feiertagName || ''}
                parent={date}
              />
              <BedarfCounter el={this.getBedarfCounterElement(date)} />
            </>
          ) : (
            date?.contentArray || ''
          )
      });
    return cell;
  }

  /**
   * Fügt der ersten Zeile des Tabellenkopfes eine Zelle als Dienst hinzu.
   * Auerßdem wird eine Column erstellt
   * @param {Object} dienst
   * @returns Zeile
   */
  createDienstHeadCell(dienst) {
    const row = this.head?.rows?.[0];
    const cellPos = row?.length || 0;
    const cell = row?.addCell?.({
        id: this.createId('headdienst', 0, cellPos),
        visible: true,
        header: true,
        dienstId: dienst?.id,
        className: '',
        style: {
          backgroundColor: dienst.color
        },
        getColumn: () => this.getColumn(cellPos),
        getContent: (component = true) =>
          component ? (
            <>
              <Label name={dienst?.planname || ''} title="" parent={dienst} />
              <BedarfCounter el={this.getBedarfCounterElement(dienst)} />
            </>
          ) : (
            dienst?.planname || ''
          )
      });
    return cell;
  }

  /**
   * Speichert die aktuellen Einstellungen der Tabelle
   */
  saveSettings = debounce((callback) => {
    this._user.saveDienstplanTableSettings?.(callback);
  }, wait);

  /**
   * @param {Number} keyCode
   * @returns True wenn in keyCodes
   */
  usesKeyCode(keyCode) {
    return this.keyCodes.includes(keyCode);
  }

  filterCheck(body, date, dienst, mitarbeiter) {
    return !!this?.filterVorlage?.isInFilter?.({
      body,
      mitarbeiter,
      date,
      dienst,
      teams: {
        mitarbeiter,
        date: this.onlyPlanungszeitraum 
          ? this?._dates?._each?.(false, (_date) => _date?.isInMainZeitraum)?.arr || []
          : false
      }
    });
  }

  /**
   * Testet, ob eine Einteilung in der Tabelle angezeigt wird.
   * Für in Einteilungsstatus-Auswahl verwendet.
   * @param {object} e 
   * @returns {boolean}
   */
  isEinteilungInFilter(e) {
    if(!e?.writable || !e?.date?.isInMainZeitraum || !e?.dienst?.isInVorlage) return false;
    const mitarbeiter = e?.mitarbeiter || false;
    const date = e?.date || false;
    const dienst = e?.dienst || false;
    return this.filterCheck(true, date, dienst, mitarbeiter);
  }

  /**
   * Testet, ob das Element gefiltert wird.
   * @param {object} rowOrCell
   * @returns {boolean}
   */
  isInFilter(rowOrCell) {
    let result = true;
    if (this?.filterVorlage?.isInFilter) {
      const mitarbeiter = rowOrCell?.mitarbeiter || false;
      const date = rowOrCell?.date || false;
      const dienst = rowOrCell?.dienst || false;
      if(date && !date?.showInTable) {
        return false;
      }

      if (mitarbeiter || date || dienst) {
        result = this.filterCheck(rowOrCell?.isBody, date, dienst, mitarbeiter);
      }
    }
    return !!result;
  }

  /**
   * Aktualisiert den Filter der Tabelle
   */
  updateFilter() {
    this.resetEnd(true);
  }

  /**
   * Aktualisiert die Tabelle nach einer Suche
   */
  updateSearch(toggled = false) {
    this.debouncedSearch(`${toggled ? ' ': ''}${this.searchValue}`);
  }

  /**
   * @param {object | object[]} el 
   * @param {mitarbeiter|dienste|dates} groupKey 
   * @param {boolean} checkForNotIgnoringBaseSearchValue
   * @returns True, wenn das Element in der Suche auftaucht
   */
  searchByGroup(el, groupKey, checkForNotIgnoringBaseSearchValue) {
    const group = this.searchGroups[groupKey];
    const baseSearchValue = !checkForNotIgnoringBaseSearchValue && groupKey === this.ignoreBaseSearchValueFor 
      ? "" : this.searchValue;
    const elements = this._isArray(el) ? el : [el];
    if(group?.searchValue || group?.checked?.length) {
      return !!elements.find((_el) => group?.checked?.find?.(
        (groupEl) => groupEl.id?.toString?.() === _el?.id?.toString?.()
      ));
    } 
    if(baseSearchValue) {
      const boolSearch = groupKey === 'dates' 
      ? (_el) => booleanPlanerDateSearch(_el, baseSearchValue) 
      : (_el) => booleanSearch(_el?.planname || "", baseSearchValue);
      return !!elements.find(boolSearch);
    }
    return true;
  }

  /**
   * @param {object} rowOrCell 
   * @param {boolean} checkForNotIgnoringBaseSearchValue
   * @param {boolean} highlight
   * @returns True, wenn es ein Feld ohne Gruppe ist oder die Gruppe in der Suche auftaucht
   */
  searchRowOrCell(rowOrCell, checkForNotIgnoringBaseSearchValue, highlight) {
    let checked = true;
    const {mitarbeiter, date, dienst, el} = rowOrCell;
    if(mitarbeiter && date || mitarbeiter && dienst || date && dienst) {
      let elements = el?.getMitarbeiterEl?.();
      let key = 'mitarbeiter';
      if(mitarbeiter && dienst) {
        elements = el?.getDates?.();
        key = 'dates';
      } else if(mitarbeiter && date) {
        elements = el?.getDiensteEl?.();
        key = 'dienste';
      }
      checked = !elements || this.searchByGroup(elements, key, checkForNotIgnoringBaseSearchValue);
      if(elements && highlight && checked && rowOrCell?.isACell) {
        rowOrCell?.setClassName?.(`${rowOrCell?.defaultClassName || ''} ${highlightByTableSearchClass}`.trim());
      } else if(rowOrCell?.isACell){
        rowOrCell?.setClassName?.(rowOrCell?.defaultClassName || '');
      }
    } else if(mitarbeiter) {
      checked = this.searchByGroup(mitarbeiter, 'mitarbeiter', checkForNotIgnoringBaseSearchValue);
    } else if(date) {
      checked = this.searchByGroup(date, 'dates', checkForNotIgnoringBaseSearchValue);
    } else if(dienst) {
      checked = this.searchByGroup(dienst, 'dienste', checkForNotIgnoringBaseSearchValue);
    }
    return checked;
  }

  /**
   * @param {object} rowOrCell 
   * @param {boolean} checkForNotIgnoringBaseSearchValue
   * @returns True
   */
  highlightEinteilung(cell, checkForNotIgnoringBaseSearchValue) {
    this.searchRowOrCell(cell, checkForNotIgnoringBaseSearchValue, true);
    return true;
  }

  /**
   * Durchsucht die Zeilen des Tabellenkörpers nach den Suchbegriffen.
   * @param {object} row 
   * @param {number} cellLimit 
   * @param {boolean} emptySearch 
   * @param {object} visibleData {cols: {}, rows: {head: {}, body: {}, foot: {}}}
   * @param {string} name 
   * @param {number} rowIndex 
   * @param {boolean} checkForNotIgnoringBaseSearchValue
   */
  searchBodyCells(row, cellLimit, emptySearch, visibleData, name, rowIndex, checkForNotIgnoringBaseSearchValue) {
    const visibleRows = visibleData.rows[name];
    const visibleColumns = visibleData.cols;
    row?.eachCell?.((cell, j) => {
      const isFixedCell = j < cellLimit;
      const isFilteredCell = isFixedCell || this.isInFilter(cell);
      cell.setVisible(isFilteredCell);
      if(!isFilteredCell || emptySearch) {
        if(emptySearch && this.tableSearchHighlight ) {
          cell?.setClassName?.(cell?.defaultClassName || '');
        }
        return false;
      }
      const cellCheck = this.tableSearchHighlight 
        ? this.highlightEinteilung(cell, checkForNotIgnoringBaseSearchValue)
        : this.searchRowOrCell(cell, checkForNotIgnoringBaseSearchValue);
      if(cellCheck) {
        visibleRows[rowIndex] = true;
        visibleColumns[j] = true;
      }
      cell.setVisible(!!visibleColumns[j]);
    }, false);
    return visibleData;
  }

  /**
   * Durchsucht die Zeilen und Spalten des Tabellenkörpers nach den Suchbegriffen.
   * @param {string} name 
   * @param {boolean} emptySearch 
   * @param {object} visibleData {cols: {}, rows: {head: {}, body: {}, foot: {}}}
   * @param {number} cellLimit 
   */
  searchBody(name, emptySearch, visibleData, cellLimit){
    const visibleRows = visibleData.rows[name];
    const group = this.searchGroups[this.checkForNotIgnoringBaseSearchValue];
    const checkForNotIgnoringBaseSearchValue = !!group?.checked?.length;
    this?.[name]?.eachRow?.((row, i) => {
      const isHead = name === 'head';
      const isFilteredRow = isHead || this.isInFilter(row);
      if (isHead || (isFilteredRow && emptySearch)) visibleRows[i] = true;
      if(isFilteredRow) {
        const rowCheck = this.searchRowOrCell(row, checkForNotIgnoringBaseSearchValue);
        if(rowCheck) visibleRows[i] = true;
        this.searchBodyCells(row, cellLimit, emptySearch, visibleData, name, i, checkForNotIgnoringBaseSearchValue);
      }
      row?.setVisible?.(!!visibleRows[i]);
    }, false);
    return visibleData;
  }

  /**
   * Durchsucht die Tabelle nach bestimmten Begriffen
   * @param {String} value
   * @param {Boolean} update
   */
  search = (value = false, update = true) => {
    const joinedGroupSearchValues = this.joinSearchGroupValues();
    const didValueChange = value !== this.searchValue ||
      this.joinedSearchValue !== joinedGroupSearchValues;
    if (didValueChange) {
      this.setSearchValues(value.trimStart());
      const visibleData = {
        cols: {},
        rows: {
          head: {},
          body: {},
          foot: {}
        }
      };
      const emptySearch =
        this.searchValue === '' && joinedGroupSearchValues === '';
      const cellLimit = (this.customColumnsPositions?.length || 0) + 1;
      this.searchBody('head', emptySearch, visibleData, cellLimit);
      this.searchBody('body', emptySearch, visibleData, cellLimit);
      this.searchBody('foot', emptySearch, visibleData, cellLimit);
      for (const colIndex in visibleData.cols) {
        for (const name in visibleData.rows) {
          for (const rowIndex in visibleData.rows[name]) {
            const cell = this?.[name]?.rows?.[rowIndex]?.cells?.[colIndex];
            if (!cell) continue;
            cell.setVisible(true);
          }
        }
      }
    }
    update && this.update();
  };

  /**
   * Debounced die Suche in der Tabelle
   */
  debouncedSearch = debounce((value) => {
    this.search(value, true);
  }, wait);

  /**
   * Liefert die Zeile und Spalte der fokussierten Zelle.
   * @param {Object} focusedFeld
   */
  findStart(focusedFeld) {
    const result = [-1, -1, 0];
    const focusedDateId = focusedFeld?.tag;
    const focusedMitarbeiterId =
      focusedFeld?.mitarbeiterId || focusedFeld?.mitarbeiter?.id;
    const focusedDienstId = focusedFeld?.dienstId;
    const rows = this?.body?.rows || [];
    result[0] =
      rows?.findIndex && (focusedDateId || focusedMitarbeiterId)
        ? rows.findIndex(
            (row) =>
              row.dateId === focusedDateId ||
              row.mitarbeiterId === focusedMitarbeiterId
          )
        : -1;
    const row = rows[result[0]];
    result[1] =
      row?.cells?.findIndex && (focusedDateId || focusedDienstId)
        ? row.cells.findIndex((cell) =>
            row?.dateId
              ? cell.dienstId && cell.dienstId === focusedDienstId
              : (cell.dateId && cell.dateId === focusedDateId) ||
                (cell.dienstId && cell.dienstId === focusedDienstId)
          )
        : -1;
    const content = row?.cells?.[result[1]]?.el?.renderedContent;
    result[2] =
      content?.findIndex && focusedFeld
        ? content.findIndex((reactEl) => reactEl?.props?.feld === focusedFeld)
        : -1;

    return result;
  }

  /**
   * Liefert die erste sichtbare Zeile ab rowStart, mit nicht leeren
   * Zellen.
   * @param {Number} rowStart
   * @returns Array (cells, length)
   */
  getStartCells(rowStart) {
    const rl = this?.body?.rows?.length || 0;
    let row = false;
    let cells = false;
    for (let i = rowStart; i < rl; i++) {
      row = this?.body?.rows?.[i];
      cells = row?.isVisible && row?.cells;
      if (cells?.length) break;
    }
    return [cells, cells?.length || 0];
  }

  /**
   * Fokussiert die nächste Spalte rechts
   * @param {Number} rowStart
   * @param {Number} colStart
   * @param {Number} refStart
   */
  nextRight(rowStart = 0, colStart = 0, refStart = 0) {
    const [cells, l] = this.getStartCells(rowStart);
    for (let j = colStart; j < l; j++) {
      const cell = cells[j];
      const content = cell?.isVisible && cell?.el?.renderedContent;
      for (let k = refStart; k >= 0; k--) {
        const ref = content?.[k]?.props?.feld?.ref;
        if (!ref?.focus) continue;
        ref.focus();
        return true;
      }
    }
  }

  /**
   * Fokussiert die nächste Spalte links
   * @param {Number} rowStart
   * @param {Number} colStart
   * @param {Number} refStart
   */
  nextLeft(rowStart = 0, colStart = 0, refStart = 0) {
    const [cells] = this.getStartCells(rowStart);
    for (let j = colStart; j >= 0; j--) {
      const cell = cells[j];
      const content = cell?.isVisible && cell?.el?.renderedContent;
      for (let k = refStart; k >= 0; k--) {
        const ref = content?.[k]?.props?.feld?.ref;
        if (!ref?.focus) continue;
        ref.focus();
        return true;
      }
    }
  }

  /**
   * Fokussiert das nächsten obere Feld
   * @param {Number} rowStart
   * @param {Number} colStart
   * @param {Number} refStart
   */
  nextUp(rowStart = 0, colStart = 0, refStart = 0) {
    const rows = this?.body?.rows || [];
    for (let i = rowStart; i >= 0; i--) {
      const row = rows[i];
      const cell = row?.isVisible && row?.cells?.[colStart];
      const content = cell?.isVisible && cell?.el?.renderedContent;
      const l = (content?.length || 1) - 1;
      for (let k = rowStart !== i || refStart < 0 ? l : refStart; k >= 0; k--) {
        const ref = content?.[k]?.props?.feld?.ref;
        if (!ref?.focus) continue;
        ref.focus();
        return true;
      }
    }
  }

  /**
   * Fokussiert das nächste untere Feld
   * @param {Number} rowStart
   * @param {Number} colStart
   * @param {Number} refStart
   */
  nextDown(rowStart = 0, colStart = 0, refStart = 0) {
    const rows = this?.body?.rows || [];
    const l = rows?.length || 0;
    for (let i = rowStart; i < l; i++) {
      const row = rows[i];
      const cell = row?.isVisible && row?.cells?.[colStart];
      const content = cell?.isVisible && cell?.el?.renderedContent;
      const lcontent = content?.length || 0;
      for (let k = rowStart === i ? refStart : 0; k < lcontent; k++) {
        const ref = content?.[k]?.props?.feld?.ref;
        if (!ref?.focus) continue;
        ref.focus();
        return true;
      }
    }
  }

  /**
   * Springt auf Tastendruck zum nächsten Feld
   * @param {Number} keyCode
   * @param {Object} feld
   */
  nextField(keyCode, feld = false) {
    if (!this.usesKeyCode(keyCode)) return false;
    const currentFeld = feld || this?.auswahl?.feld;
    if (!currentFeld) this.nextRight();
    const [rowStart, colStart, refStart] = this.findStart(currentFeld);
    if (colStart < 0) {
      this.nextRight(rowStart < 0 ? 0 : rowStart, 0, 0);
      return false;
    }
    switch (keyCode) {
      case this.keyCodes[0]:
        this.nextLeft(rowStart, colStart - 1, refStart < 0 ? 0 : refStart);
        break;
      case this.keyCodes[1]:
        this.nextRight(rowStart, colStart + 1, refStart < 0 ? 0 : refStart);
        break;
      case this.keyCodes[2]:
      case this.keyCodes[4]:
        this.nextDown(
          refStart < 0 ? rowStart + 1 : rowStart,
          colStart,
          refStart + 1
        );
        break;
      case this.keyCodes[3]:
        this.nextUp(
          refStart <= 0 ? rowStart - 1 : rowStart,
          colStart,
          refStart - 1
        );
        break;
    }
  }

  /**
   * Sucht das nächste Feld in der Tabelle
   */
  throttledNextField = throttle((keyCode, feld = false) => {
    this.nextField(keyCode, feld);
  }, shortwait);

  /**
   * Setzt den Freitext der Vorlage
   * @param {String} freitext
   */
  setVorlageFreitext(freitext) {
    if (this?._vorlage?.setFreitext && typeof freitext === 'string') {
      this._vorlage.setFreitext(freitext.trim());
    }
  }

  /**
   * Iteriert über die Tabellen-Zeilen und Spalten und stellt die Daten für
   * den Export zusammen.
   * @param {Boolean} onlyMainZeitraum
   * @param {Boolean} checkBedarfe
   * @param {Boolean} withCounter
   * @param {Boolean} withWunsch
   * @param {Boolean} withColor
   * @param {Boolean} exportEinteilungen
   * @param {Boolean} zusatzTabelle
   * @returns Object
   */
  prepareDataForExport(
    publish = false,
    onlyMainZeitraum = false,
    checkBedarfe = false,
    withCounter = true,
    withWunsch = false,
    withColor = false,
    zusatzTabelle = false
  ) {
    const data = {
      table: {
        head: [],
        body: [],
        foot: [],
        theme: 'plain',
        tableWidth: 'wrap',
        horizontalPageBreak: true,
        styles: { cellWidth: 'wrap', fontSize: 16, font: 'helvetica' },
        columnStyles: { text: { cellWidth: 'auto' } }
      },
      columns: {
        head: {
          wochenendenColumnKeys: [],
          feiertageColumnKeys: []
        },
        body: {
          wochenendenColumnKeys: [],
          feiertageColumnKeys: []
        },
        foot: {
          wochenendenColumnKeys: [],
          feiertageColumnKeys: []
        }
      },
      rows: {
        head: {
          wochenendenRowKeys: [],
          feiertageRowKeys: []
        },
        body: {
          wochenendenRowKeys: [],
          feiertageRowKeys: []
        },
        foot: {
          wochenendenRowKeys: [],
          feiertageRowKeys: []
        }
      },
      backgroundColors: {
        head: {},
        body: {},
        foot: {}
      },
      warnUnbesetzteBedarfe: false
    };

    const checkElBedarf = ({ date, dienst }) => {
      if (checkBedarfe) {
        const bedarf =
          (date?.getCurrentBedarf && date?.getCurrentBedarf()) ||
          (dienst?.getCurrentBedarf && dienst?.getCurrentBedarf()) ||
          0;
        if (bedarf > 0) data.warnUnbesetzteBedarfe = true;
      }
    };

    const eachRow = (key = 'head') => {
      // Über Zeilen iterieren
      this?.[key]?.eachRow((row) => {
        const rowDate = row?.date;
        // Nur Hauptmonat betrachten?
        if (notMainZeitraum(onlyMainZeitraum, rowDate)) return false;
        // Zähler hinzufügen?
        if (!withCounter && row.id.includes('-custom')) return false;
        const dataRow = [];
        const rowIndex = data.table[key].length;
        // Über Spalten Iterieren
        row.eachCell &&
          row.eachCell((cell) => {
            const cellDate = cell?.date;
            const content = cell?.getContent?.(false, {withColor, withWunsch, publish});
            // Nur Hauptmonat betrachten?
            if (notMainZeitraum(onlyMainZeitraum, cellDate)) return false;
            // Zähler hinzufügen?
            if (!withCounter && cell.id.includes('-custom')) return false;
            checkElBedarf(cell);
            const colIndex = dataRow.length;
            if (!rowDate) addKeys(data, key, cellDate, colIndex, false);
            dataRow.push(
              addContent(content, withColor, data, key, rowIndex, colIndex)
            );
          }, true);
        addKeys(data, key, rowDate, rowIndex, true);
        data.table[key].push(dataRow);
      }, true);
    };
    eachRow('head');
    eachRow('body');
    eachRow('foot');
    if (zusatzTabelle) {
      this.addZusatzTabelleToExportData(data, onlyMainZeitraum);
    }
    if (showExport) console.log('preparedExportData', data);
    if (data.warnUnbesetzteBedarfe) {
      setPageWarning(
        this?._page,
        'Es existieren unbesetzte Bedarfe in der Tabelle'
      );
    }
    return data;
  }

  /**
   * Fügt den Daten die ZusatzTabelle im Tabellen-Fuss hinzu
   * @param {Object} data
   * @param {Boolean} onlyMainZeitraum
   */
  addZusatzTabelleToExportData(data, onlyMainZeitraum = false) {
    const vorlage = this?._vorlage;
    if (
      this?._dates?._each &&
      vorlage?.hasExtraDienste &&
      vorlage?.getExtraDienste
    ) {
      const columnTitles = ['Dienste'];
      data.table.foot.push(columnTitles);
      // Über die Zusatz-Dienset iterieren
      vorlage.getExtraDienste((dienst, i) => {
        const rowIndex = data.table.foot.length;
        const dataRow = [
          addContent(
            dienst.exportLabel(true),
            true,
            data,
            'foot',
            rowIndex,
            columnTitles.length
          )
        ];
        // Über alle Tage iterieren
        this._dates._each((date) => {
          // Nur Hauptmonat betrachten?
          if (notMainZeitraum(onlyMainZeitraum, date)) return false;
          const el = date.getDienstEl(dienst.id);
          // Beim ersten Durchlauf die Header erstellen
          if (i === 0) {
            addKeys(data, 'foot', date, columnTitles.length, false);
            columnTitles.push(date.label);
          }
          // Einteilungen einfügen
          dataRow.push(
            addContent(
              el?.getMitarbeiter?.() || '-',
              false,
              data,
              'foot',
              rowIndex,
              dataRow.length
            )
          );
        });
        // Zeile hinzufügen
        data.table.foot.push(dataRow);
      });
    }
  }

  /**
   * Erstellt eine CSV und downloaded die Datei
   * @param {Boolean} onlyMainZeitraum
   * @param {Boolean} checkBedarfe
   * @param {Boolean} withCounter
   * @param {Boolean} withWunsch
   * @returns csvData
   */
  downloadCSV(
    onlyMainZeitraum = false,
    checkBedarfe = false,
    withCounter = true,
    withWunsch = false
  ) {
    const { table } = this.prepareDataForExport(
      false,
      onlyMainZeitraum,
      checkBedarfe,
      withCounter,
      withWunsch,
      false,
      false
    );
    let csvData = '';
    const add = (columns) => {
      if (!columns?.map) return;
      csvData += `${columns.map((str) => `"${str}"`).join(';')}\n`;
    };
    table.head.forEach(add);
    table.body.forEach(add);
    table.foot.forEach(add);
    return downloadCSV(csvData, this.filename);
  }

  /**
   * Erstellt das Styling der Zellen des Tabellen-Körpers der PDF
   * @param {Object} data
   * @param {Object} param1
   */
  stylePDFTableBody(data, { columns, rows }) {
    const wochenendenColumnKeys =
      columns?.[data.section]?.wochenendenColumnKeys || [];
    const feiertageColumnKeys =
      columns?.[data.section]?.feiertageColumnKeys || [];
    const wochenendenRowKeys = rows?.[data.section]?.wochenendenRowKeys || [];
    const feiertageRowKeys = rows?.[data.section]?.feiertageRowKeys || [];
    const isFTColum = feiertageColumnKeys.includes(data.column.index);
    const isFTRow = feiertageRowKeys.includes(data.row.index);
    const isWEColumn = wochenendenColumnKeys.includes(data.column.index);
    const isWeRow = wochenendenRowKeys.includes(data.row.index);
    const isEvenRow = data.row.index % 2 === 0;
    const row = feiertageRowKeys.length || wochenendenRowKeys.length;
    if (row) {
      data.cell.styles.fillColor = [255];
    } else data.cell.styles.fillColor = isEvenRow ? [240] : [255];
    if (isFTColum || isFTRow) {
      data.cell.styles.fillColor =
        isFTColum && isEvenRow ? [255, 200, 200] : [255, 220, 220];
    } else if (isWEColumn || isWeRow) {
      data.cell.styles.fillColor = isWEColumn && isEvenRow ? [215] : [230];
    }
    data.cell.styles.textColor = '#232328';
    const lwd = 0.3;
    const lwb = 3;
    data.cell.styles.lineWidth = {
      top: lwd,
      right: lwd,
      bottom: lwd,
      left: lwd
    };
    data.cell.styles.lineColor = [180];
    data.cell.styles.fontStyle = 'normal';
    if (data.column.index === 0) {
      data.cell.styles.fontStyle = 'bold';
      data.cell.styles.lineWidth.right = lwb;
    }
    if (data.row.index === 0) {
      data.cell.styles.lineWidth.top = lwb;
    }
  }

  /**
   * Erstellt das Styling für den TabellenKopf in der PDF
   * @param {Object} data
   */
  stylePDFTableHead(data) {
    data.cell.styles.fontStyle = 'bold';
    data.cell.styles.fillColor = '#58d3b4';
    data.cell.styles.textColor = '#ffffff';
    const lwd = 0.3;
    const lwb = 3;
    data.cell.styles.lineWidth = {
      top: lwd,
      right: lwd,
      bottom: lwd,
      left: lwd
    };
    data.cell.styles.lineColor = [180];
    if (data.column.index === 0) {
      data.cell.styles.lineWidth.right = lwb;
    }
  }

  /**
   * Erstellt den Style für den Tabellen-Fuss
   * @param {Object} data
   * @param {Object} styleInfos
   */
  stylePDFTableFoot(data, styleInfos) {
    this.stylePDFTableBody(data, styleInfos);
  }

  /**
   * Erstellt das Styling der PDF
   * @param {Object} data
   * @param {Object} styleInfos
   */
  getStylingPDF(data, styleInfos) {
    if (data.section === 'body') {
      this.stylePDFTableBody(data, styleInfos);
    } else if (data.section === 'head') {
      this.stylePDFTableHead(data);
    } else if (data.section === 'foot') {
      this.stylePDFTableFoot(data, styleInfos);
    }
  }

  /**
   * Erstellt farbige Rechtecke für die einzelnen Zellen der PDF
   * @param {Object} data
   * @param {Object} styleInfos
   */
  getRectPDF(data, styleInfos) {
    const doc = data.doc;
    const rowIndex = data.row.index;
    const colIndex = data.column.index;
    const colors =
      styleInfos?.backgroundColors?.[data.section]?.[rowIndex]?.[colIndex];
    if (!this._isObject(colors)) return;
    const cell = data.cell;
    const padding = cell.styles.cellPadding;
    const l = cell.text.length;
    const height = (cell.contentHeight - 2 * padding) / l;
    const width = cell.width;
    const x = cell.x;
    const y = cell.y;
    for (const pos in colors) {
      const posInt = parseInt(pos, 10);
      const bgColor = colors[pos];
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      const rectY = y + padding + pos * height;
      doc.rect(x, rectY, width, height, 'F');
      if (cell.text[posInt]) {
        const hexColor = rgbToHex(bgColor[0], bgColor[1], bgColor[2]);
        const {color} = getFontColorByWhite(hexColor);
        const rgbColor = hexToRgb(color);
        doc.setTextColor(rgbColor[0], rgbColor[1], rgbColor[2]);
        doc.text(cell.text[posInt], x + padding, rectY, { baseline: 'top' });
      }
    }
  }

  /**
   * Erstellt eine Tabelle mit autotable und jsPDF.
   * Erstellt die Tabelle auf einer sehr großen Seite
   * und ermittelt anschließend eine passendes Seiteverhältnis.
   * @param {boolean} sizing
   * @param {Object} docConfig
   * @param {Number} fontSize
   * @param {Object} data
   * @param {String} freitext
   * @returns Liefert ein jsPDF.doc
   */
  createTablesPDF(data = {}, freitext = '') {
    // PDF erstellen
    const resultDoc = autoA4SizePDFTable(data, {
      didParseCell: (cellDat, _data) => this.getStylingPDF(cellDat, _data),
      didDrawCell: (cellDat, _data) => this.getRectPDF(cellDat, _data),
      kommentar: freitext,
      addDate: true
    });
    return resultDoc;
  }

  /**
   * Erstellt mit jsPDF eine PDF für den Export
   * @param {Boolean} onlyMainZeitraum
   * @param {Boolean} checkBedarfe
   * @param {Boolean} withCounter
   * @param {Boolean} withWunsch
   * @param {Boolean} withColor
   * @param {Boolean} exportEinteilungen
   * @param {Boolean} zusatzTabelle
   * @param {Boolean} freitext
   * @returns jsPDF.doc
   */
  createPDF(
    publish = false,
    onlyMainZeitraum = false,
    checkBedarfe = false,
    withCounter = true,
    withWunsch = false,
    withColor = false,
    zusatzTabelle = false,
    freitext = ''
  ) {
    const data = this.prepareDataForExport(
      publish,
      onlyMainZeitraum,
      checkBedarfe,
      withCounter,
      withWunsch,
      withColor,
      zusatzTabelle
    );
    const doc = this.createTablesPDF(data, freitext);
    return doc;
  }

  /**
   * Erstellt aus der Tabelle eine csv oder eine pdf
   */
  export(
    pdf = false,
    onlyMainZeitraum = false,
    checkBedarfe = false,
    withCounter = true,
    withWunsch = false,
    withColor = false
  ) {
    let result = false;
    if (pdf) {
      result = this.createPDF(
        false,
        onlyMainZeitraum,
        checkBedarfe,
        withCounter,
        withWunsch,
        withColor,
        false,
        ''
      );
      result?.save && result.save(`${this.filename}.pdf`);
    } else {
      result = this.downloadCSV(
        onlyMainZeitraum,
        checkBedarfe,
        withCounter,
        withWunsch
      );
    }
    if (showExport) console.log(this.filename, result);

    return result;
  }

  /**
   * Erstellt und veröffentlicht eine PDF und die Einteilungen.
   * @param {String} freitext
   * @param {Function} setState
   */
  publish(freitext = '', setState = false) {
    const thisFreitext = freitext?.trim ? freitext.trim() : '';
    const hains = this._hains;
    const currDate = this._anfang?.str || '';
    if (!hains || !this.publishable || !currDate) {
      return false;
    }
    const thisSetState = (nr, title = '') =>
      this._isFunction(setState) && setState(nr, title);
      
    thisSetState(1);

    const showError = (info = false, title = false) => {
      thisSetState(3, title || '');
      setPageWarning(this?._page, info || 'Veröffentlichung fehlgeschlagen!');
    };

    const id = this?._vorlageId || 0;
    const formData = new FormData();
    formData.append('vorlage_id', id);
    formData.append('dienstplan_id', this?._id);
    formData.append('freitext', thisFreitext);
    hains.api('publish', 'post', formData).then(
      (response) => {
        if (!this?._mounted) return;
        const einteilungenInfo = response?.einteilungen?.info;
        const info = response?.info;
        if (response?.uploaded) {
          thisSetState(2, einteilungenInfo);
          if (response?.einteilungen?.deaktiviert) {
            setPageWarning(this?._page, info || einteilungenInfo);
          }
          this.setVorlageFreitext(response.freitext);
        } else {
          showError(info, einteilungenInfo);
          this.setVorlageFreitext(thisFreitext);
        }
      },
      (err) => {
        showError(false, false);
        returnError(err);
      }
    );
  }

  /**
   * @returns String mit dem freitext aus der Vorlage
   */
  getFreitext() {
    return this?._vorlage?.freitext || '';
  }

  /**
   * Alle benutzerdefinierten Zeilen und Spalten entfernen
   */
  removeCustomFelder() {
    const l = this?.head?.length || 0;
    if (l > 1) {
      this.head.rows.splice(1, l);
    }
    let removed = this.removeLastCustomFeld(false);
    while (removed) {
      removed = this.removeLastCustomFeld(false);
    }
  }

  /**
   * Liefert den Index des letzten benutzerdefinierten Feldes.
   * Falls vorher keines existierte wird eine 0 ausgegeben.
   * @param {Boolean} row
   * @returns Number
   */
  getLastCustomFeldPosition(row) {
    let position = (this?.head?.length || 1) - 1;
    if (!row) {
      const columns = this.customColumnsPositions;
      position = columns?.length ? Math.max(...columns) : 0;
    }
    return position;
  }

  /**
   * Liefert das letzte Custom Feld
   * @param {Boolean} row
   * @returns Object
   */
  getLastCustomFeld(row) {
    const position = this.getLastCustomFeldPosition(row);
    const cell = row
      ? this?.head?.rows?.[position]?.cells?.[0]
      : this?.firstHeadRow?.cells?.[position];
    const feld = cell?.id?.includes && cell.id.includes('custom') && cell?.el;
    return feld || false;
  }

  /**
   * Entfernt die letzte benutzerdefinierte Zeile oder Spalte
   * @param {Booelan} row
   */
  removeLastCustomFeld(row) {
    const position = this.getLastCustomFeldPosition(row);
    if (row) {
      const customRow = this?.head?.rows?.[position];
      if (
        position > 0 &&
        customRow?.id?.includes &&
        customRow.id.includes('custom')
      ) {
        this.head.rows.splice(position, 1);
        return true;
      }
    } else if (position > 0) {
      let removed = false;
      const removeColumn = (body) => {
        this?.[body]?.eachRow?.((row) => {
          const cells = row?.cells;
          const cell = cells?.[position];
          if (
            cells?.splice &&
            cell?.id?.includes &&
            cell.id.includes('custom')
          ) {
            cells.splice(position, 1);
            removed = true;
          }
        }, false);
      };
      removeColumn('head');
      removeColumn('body');
      removeColumn('foot');
      return removed;
    }
    return false;
  }

  /**
   * Fügt dem Tabellen-Kopf eine neue Zeile hinzu
   * @param {Object} feld
   * @param {Object} firstHeadRow
   */
  addCustomRow(feld, firstHeadRow) {
    const rowIndex = (this.head?.length || 1) - 1;
    const row =
      this?.head?.addRow?.({
        id: this.createId('headrow-custom', rowIndex),
        visible: true,
        className: 'custom_row'
      });
    const l = (row?.addCell && firstHeadRow?.length) || 0;
    // passende Anzahl an Spalten einfügen
    for (let i = 0; i < l; i++) {
      const headCell = firstHeadRow?.cells?.[i];
      let cell = false;
      const colIndex = i - 1;
      const getComponent =
        i === 0
          ? () => (
              <CustomCounterTitle
                customFelder={this.customFelder}
                feld={feld}
                cell={cell}
                rowIndex={rowIndex}
                colIndex={colIndex}
              />
            )
          : () => (
              <CustomCounter
                // Der Key (cellId_feldKey) ist wichtig für das richtige Rendern bei Vorlagewechsel
                key={`${cell?.id}_${feld?.key}`}
                customFelder={this.customFelder}
                feld={feld}
                cell={cell}
                rowIndex={rowIndex}
                colIndex={colIndex}
              />
            );
      const getContentValues =
        i === 0
          ? () => feld?.name || ''
          : () => (feld?.getCounterTxt?.(cell) || '');
      cell = row.addCell({
        id: this.createId('headcell-custom', rowIndex, i),
        visible: headCell?.visible,
        header: i === 0,
        className: `custom_cell ${headCell?.className || ''}`.trim(),
        dienstId: headCell?.dienstId || 0,
        mitarbeiterId: headCell?.mitarbeiterId || 0,
        dateId: headCell?.dateId || '',
        style:
          i === 0
            ? {
                position: 'sticky',
                left: '0px',
                zIndex: zIndexes.z5,
                fontSize: '1.1em'
              }
            : null,
        el: feld,
        getColumn: () => this.getColumn(i),
        getContent: (component = true) =>
          component ? getComponent() : getContentValues()
      });
    }
  }

  /**
   * Fügt den Zeilen eine neue Spalte hinzu
   * @param {Object} feld
   * @param {Array} customColumns
   */
  addCustomColumn(feld, customColumns) {
    const position = customColumns?.length || 0;
    customColumns?.push?.(position);
    const colId = `custom-${position}`;
    this.addColumn(
      {
        sticky: true
      },
      colId
    );
    const addColumn = (body) => {
      this?.[body]?.eachRow?.((row, rowPos) => {
        let cell = false;
        const rowIndex = rowPos - 1;
        const getComponent =
          rowPos === 0 && body === 'head'
            ? () => (
                <CustomCounterTitle
                  customFelder={this.customFelder}
                  feld={feld}
                  cell={cell}
                  rowIndex={rowIndex}
                  colIndex={position}
                />
              )
            : () => (
                <CustomCounter
                  // Der Key (cellId_feldId_feldVorlageId) ist wichtig für das richtige Rendern bei Vorlagewechsel
                  key={`${cell?.id}_${feld?.key}`}
                  customFelder={this.customFelder}
                  feld={feld}
                  cell={cell}
                  rowIndex={rowIndex}
                  colIndex={position}
                />
              );
        const getContentValues =
          rowPos === 0 && body === 'head'
            ? () => feld?.name || ''
            : () => (feld?.getCounterTxt?.(cell) || '');
        cell =
          row?.addCell &&
          row.addCell(
            {
              id: this.createId(`${body}cell-custom`, rowIndex, position),
              visible: true,
              header: rowPos === 0 && body === 'head',
              className: 'custom_cell',
              dienstId: row?.dienstId || 0,
              mitarbeiterId: row?.mitarbeiterId || 0,
              dateId: row?.dateId || '',
              el: feld,
              getColumn: () => this.getColumn(colId),
              getContent: (component = true) =>
                component ? getComponent() : getContentValues()
            },
            position + 1
          );
      }, false);
    };
    addColumn('head');
    addColumn('body');
    addColumn('foot');
  }

  /**
   * Fügt die benutzerdefinierten Zeilen und Spalten der aktuellen Vorlage hinzu.
   */
  addCustomFelder() {
    if (this?.customFelder?.eachFeld) {
      this.customFelder.eachFeld(this?._vorlageId, (feld) => {
        if (feld?.row) {
          this.addCustomRow(feld, this.firstHeadRow);
        } else {
          this.addCustomColumn(feld, this.customColumnsPositions);
        }
      });
    }
  }

  /**
   * Entfernt die alten benutzerdefinierten Felder
   * und fügt die neuen benutzerdefinierten Felder hinzu
   */
  changedVorlage() {
    this.removeCustomFelder();
    this.addCustomFelder();
    this.resetEnd(true);
  }

  /**
   * Führt ein Update aller CustomFelder durch
   */
  updateCounterThroughFeld = throttle(() => {
    this.customFelder?.eachFeld?.(this._vorlageId || 0, (customFeld) => {
      customFeld?.eachCounter?.((counter) => {
          counter?.updateThroughFeld?.();
        });
    });
    this._setState("everythingPublished", {});
  }, wait);

  /**
   * Führt ein Update der Frontend-Elemente durch
   */
  updateFrontendThroughChannel() {
    this.updateSearch();
    if (this?.auswahl?.debouncedUpdateFilter) {
      this.auswahl.debouncedUpdateFilter();
    }
    this._setState("everythingPublished", {});
  }

  /**
   * Liefert die CustomFelder nur, wenn es dazu eine Vorlage gibt
   */
  getCustomFelder() {
    const vId = this?._vorlageId || 0;
    return Number.isNaN(parseInt(vId, 10)) ? false : this.customFelder;
  }

  /**
   * Führt ein Update aller Columns aus
   */
  updateColumns() {
    this.eachColumn((col) => {
      col._update();
    });
  }

  /**
   * Verändert die Fontsize
   * @param {Number} add
   * @param {Boolean} reset
   */
  setFontSize(add = 0, reset = false) {
    const update = super.setFontSize(add, reset);
    if(update) this.auswahl?._update?.();
  }
}

export default DienstplanTable;
