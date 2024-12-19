import { deepClone, getRGB } from '../../tools/helper';
import { autoA4SizePDFTable } from '../../util_func/util';
import TagesverteilerGrid from '../tagesverteiler/TagesverteilerGrid';
import Verteiler from './verteiler';

class Tagesverteiler extends Verteiler {
  constructor(data, props, appModel = false) {
    super(data, props, appModel);
    this.initGrid();
  }

  get filename() {
    return `TV-${
      this?.calendar?.tag || new Date().toISOString().split('T')[0]
    }`;
  }

  setTagesverteilerGrid(tagesverteilerGrid = {}) {
    this._set('grid', tagesverteilerGrid);
  }

  resetGrid() {
    this.setTagesverteilerGrid();
  }

  initGrid() {
    this.setTagesverteilerGrid(new TagesverteilerGrid(this, this._appModel));
  }

  /**
   * Grid-Layout für den Tagesverteiler zusammenfassen mit dem
   * Namen der Grid-Elemente als Key und den Row/Col-Indizes als Values
   * @returns Object
   */
  getGridIndizes() {
    const config = this?.grid?.desktop;
    const grid = config?.grid;
    const result = {
      cols: config?.cols || 0,
      rows: config?.rows || 0,
      grid: {}
    };
    let hasGrid = false;
    if (this._isObject(grid)) {
      Object.values(grid).forEach((row, rowIndex) => {
        row?.split &&
          row.split(' ').forEach((col, colIndex) => {
            const obj = { rowIndex, colIndex };
            if (!result.grid[col]) {
              result.grid[col] = [obj];
              hasGrid = true;
            } else {
              result.grid[col].push(obj);
            }
          });
      });
    }
    return hasGrid && result;
  }

  /**
   * Erstellt die Zeilen des CSS-Grids für den Export
   * @param {number} rowsL 
   * @param {number} colsL 
   * @returns {Array} Rows
   */
  createGridRowsAndCols(rowsL, colsL) {
    const rows = [];
    for (let i = 0; i < rowsL; i++) {
      rows.push([]);
      for (let j = 0; j < colsL; j++) {
        rows[i].push({
          infos: [],
          content: []
        });
      }
    }
    return rows;
  }

  /**
   * Zellen erstellen des CSS-Grids erstellen
   * @param {object} grid 
   * @param {string} name 
   * @param {number} span 
   * @param {Array} rows 
   * @param {object} colSpans 
   * @param {object} rest 
   * @returns {Array} Cells
   */
  createGridCells(grid, name, span, rows, colSpans, rest) {
    const gridInfo = grid?.[name];
    if (!gridInfo) {
      if (!rest[name]) {
        rest[name] = {
          infos: [],
          content: []
        };
      }
      return rest[name];
    }
    return gridInfo?.map?.(({ rowIndex, colIndex }) => {
      colSpans[colIndex] = span;
      return rows[rowIndex][colIndex];
    }) || [];
  }

  /**
   * Liefert einen Callback, mit dem die Überschriften und Einteilungen in die Tabelle eingefügt werden.
   * @param {Functiion} addContent 
   * @param {object} bereich 
   * @param {string} bereichName 
   * @param {object} item 
   * @param {number} span 
   * @param {string} colorBG 
   * @param {string} dayCol 
   * @returns {Function} Callback
   */
  callAddDiensteAndBereicheToGrid(addContent, bereich, bereichName, item, span, colorBG, dayCol){
    return ({ po_dienst, einteilungen, dienstfrei, label }) => {
      const { content_layout, isOneColList } = bereich;
      if (!isOneColList) {
        addContent(
          bereichName,
          label,
          item,
          colorBG,
          {
            bold: true,
            color: colorBG,
            bereich,
            po_dienst,
            dienstfrei,
            isOneColList
          },
          span
        );
      }
      // Iteriert über die Einteilungen eines Dienstes
      let doubleContent = [];
      const l = einteilungen.length - 1;
      einteilungen.forEach((einteilung, ie) => {
        if (!einteilung?.id) return;
        const isEven = ie % 2 === 0;
        // Bei One-Col-List werden zwei Einteilungen in eine Zelle geschrieben
        if (isOneColList) {
          if (isEven) doubleContent = [];
          doubleContent.push(
            this.getPDFEinteilung(content_layout, einteilung, po_dienst)
          );
        } else {
          doubleContent = this.getPDFEinteilung(
            content_layout,
            einteilung,
            po_dienst
          );
        }
        if (!isOneColList || !isEven || ie === l) {
          addContent(
            bereichName,
            doubleContent,
            item,
            colorBG,
            {
              color: colorBG,
              einteilung,
              po_dienst,
              dienstfrei,
              bereich,
              isOneColList
            },
            span
          );
        }
      });
    }
  }

  /**
   * Fügt die Daten in die Tabelle ein.
   * @param {Function} addContent 
   */
  addDataToGrid(addContent) {
    this.data?.eachVerteilerDate?.((dayCol) => {
      this.data?.collections?.eachByVorlage?.((item) => {
        const { name, planname, color } = item;
        const rgbColor = getRGB(color);
        // Titelzeile
        addContent(
          `hl-${planname}`,
          name,
          item,
          rgbColor,
          { bold: true, color: rgbColor },
          1
        );
        item?.eachBereichTVByVorlage?.((bereich) => {
          const {isOneColList } = bereich;
          const colorBG = getRGB(bereich.color);
          const span = isOneColList ? 2 : 1;
          const bereichName = `ct-${bereich.sectionName}`;
          const content = bereich.name;
          // Subtitle (Bereich bzw. Dienst)
          addContent(
            bereichName,
            content,
            item,
            colorBG,
            { bold: true, color: rgbColor, bereich, isOneColList },
            span
          );
          this.getContent(
            bereich,
            dayCol,
            true,
            this.callAddDiensteAndBereicheToGrid(
              addContent, 
              bereich, 
              bereichName, 
              item, 
              span, 
              colorBG, 
              dayCol
            )
          );
        });
      });
    });
  }

  /**
   * Creates a default row with columns for the table grid
   * @param {object} colSpans 
   * @returns {Array} DefaultRow
   */
  createTableGridDefaultRow(colSpans) {
    const defaultRow = [];
    const colSpansL = Object.values(colSpans).reduce((acc, span) => acc + span, 0);
    for (let x = colSpansL; x > 0; x--) {
      defaultRow.push({ content: '', colSpan: 1 });
    }
    return defaultRow;
  }

  /**
   * Zählt die Anzahl der notwendigen Spalten für das Gitter.
   * @param {Array} row 
   * @param {number} rI 
   * @param {number} rL 
   * @param {Array} rows 
   * @returns {number} l
   */
  countNecessaryColumns(row, rI, rL, rows) {
    const lengths = [];
    row.forEach((cell, colIndex) => {
      let rowSpan = 0;
      const contentL = cell?.content?.length || 0;
      for (let i = rI + 1; i < rL; i++) {
        if (rows?.[i]?.[colIndex]?.key !== cell.key) break;
        rowSpan++;
      }
      if (contentL) {
        if (!lengths[rowSpan]) lengths[rowSpan] = [];
        lengths[rowSpan].push(contentL);
      }
    });
    const l = Math.max(...(lengths.find((arr) => !!arr) || [0]));
    // const l = Math.max(...row.map((cell) => (cell?.content?.length || 0)));
    return l;
  }

  /**
   * Falls die Spalte sich über mehrere Rows erstreckt,
   * soll der Content auf die Rows aufgeteilt werden.
   * @param {Array} rows 
   * @param {number} rI 
   * @param {number} rL 
   * @param {number} colIndex 
   * @param {object} col 
   * @param {number} l 
   */
  balanceContentOverRows(rows, rI, rL, colIndex, col, l){
    for (let i = rI + 1; i < rL; i++) {
      const _col = rows?.[i]?.[colIndex];
      const content = _col?.content;
      if (_col?.key !== col.key || !content) break;
      _col.content = content.slice(l);
      _col.infos = _col.infos.slice(l);
    }
  }

  /**
   * Liefert den Style für die Gitterlinien
   * @returns {object} Object
   * @example
   * { 
   *  textColor: string, 
   *  lineColor: Array, 
   *  lineWidth: { 
   *    top: number, 
   *    right: number, 
   *    bottom: number, 
   *    left: number 
   *  } 
   * }
   */
  getGridStyleBase() {
    const lwd = 0.3;
    return {
      textColor: '#232328',
      lineColor: [255],
      lineWidth: {
        top: lwd,
        right: lwd,
        bottom: lwd,
        left: lwd
      }
    };
  }

  /**
   * Fügt den Content in die Zelle ein
   * @param {object} cell 
   * @param {string} content 
   * @param {string} color 
   * @param {boolean} bold 
   */
  addContentToGridCell(cell, content, color, bold) {
    if(!this._isObject(cell)) return;
    const { textColor, lineColor, lineWidth } = this.getGridStyleBase();
    cell.content = content || '';
    cell.styles = {
      fillColor: color,
      textColor,
      fontStyle: bold ? 'bold' : 'normal',
      lineColor,
      lineWidth
    };
  }

  /**
   * Tagesverteiler-Daten für das PDF und die CSV vorbereiten
   * @param {Boolean} save
   * @returns Oject
   */
  prepareData(save = false) {
    const gridIndizes = this.getGridIndizes();
    const data = {
      table: {
        head: [],
        body: [],
        foot: [],
        theme: 'plain',
        tableWidth: 'wrap',
        horizontalPageBreak: true,
        styles: { cellWidth: 'wrap', fontSize: 12, font: 'helvetica' },
        columnStyles: { text: { cellWidth: 'auto' } }
      }
    };

    const grid = gridIndizes?.grid || {};
    const rest = {};
    const colSpans = {};
    const rowsL = gridIndizes?.rows || 0;
    const colsL = gridIndizes?.cols || 0;
    const rows = this.createGridRowsAndCols(rowsL, colsL);
    const rL = rows.length;
    this.addDataToGrid((key, name, item, defaultColor, infos, span) => {
      const cells = this.createGridCells(grid, key, span, rows, colSpans, rest);
      cells?.forEach?.((cell) => {
        cell.item = item;
        cell.color = defaultColor;
        if (name) cell?.content?.push(name);
        cell.infos.push(infos);
        cell.key = key;
      });
    });

    let rowIndex = 0;
    const tableBody = data.table.body;
    const defaultRow = this.createTableGridDefaultRow(colSpans);
    const removeCols = {};
    rows.forEach((row, rI) => {
      const l = this.countNecessaryColumns(row, rI, rL, rows);
      let cI = 0;
      row.forEach((col, colIndex) => {
        const span = colSpans[colIndex];
        this.balanceContentOverRows(rows, rI, rL, colIndex, col, l);
        for (let i = 0; i < l; i++) {
          const index = rowIndex + i;
          if (!tableBody?.[index]) {
            tableBody[index] = deepClone(defaultRow);
          }
          const currentRow = tableBody[index];
          const content = col.content?.[i];
          const info = col.infos?.[i];
          const color = info?.color || col.color;
          const bold = info?.bold;
          const arrContent = this._isArray(content);
          const currentContent = arrContent ? content : [content];
          for(let c = 0; c < span; c++) {
            const currentCol = currentRow?.[cI + c];
            const cellCont = currentContent[c] || '';
            this.addContentToGridCell(currentCol, cellCont, color, bold);
            if(currentCol && !arrContent) {
              if(c === 0) currentCol.colSpan = span;
              else if(span > 1) removeCols[index] = cI + c;
            }
          }
        }
        cI += span;
      });
      rowIndex += l;
    });
    for(const rowI in removeCols) {
      if(tableBody[rowI]) {
        tableBody[rowI].splice(removeCols[rowI], 1)
      }
    }
    return data;
  }

  /**
   * Erstellt eine PDF mit dem Tagesverteiler als Tabelle
   * @param {Boolean} save
   * @param {Function} callback
   * @returns Object
   */
  createPdf(save = false, callback = false) {
    const data = this.prepareData();
    const doc = autoA4SizePDFTable(data, {
      addDate: true
    });
    if (save && doc?.save) doc.save(`${this.filename}.pdf`);
    if (this._isFunction(callback)) callback(doc);
    return doc;
  }

  /**
   * Diese Methode iteriert über die Bereich-Wochenverteiler bzw. Bereich-Tagesverteiler.
   * Sie muss in dem entsprechenden Verteiler implementiert werden.s
   * @param {Function} callback 
   */
  eachBereichOrDienst(callback) {
    this.data.collections?._each?.((collection) => {
      collection?.eachBereichTV?.((bereich) => {
        callback(bereich);
      });
    });
  }
}

export default Tagesverteiler;
