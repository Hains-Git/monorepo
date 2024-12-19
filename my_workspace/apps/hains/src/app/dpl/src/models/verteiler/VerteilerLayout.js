import { deepClone } from "../../tools/helper";
import Basic from "../basic";

class VerteilerLayout extends Basic{
  constructor(layout, parent, appModel = false) {
    super(appModel);
    this._setObject("parent", parent, false);
    this._set("device", layout?.device || "desktop");
    this._setInteger("id", layout?.id || 0, true, 0);
    this._setInteger("verteiler_vorlagen_id", layout?.verteiler_vorlagen_id || 0, true, 0);
    this._set("created_at", layout?.created_at || "");
    this._set("updated_at", layout?.updated_at || "");
    this._setObject("defaultConfig", this._isObject(layout) ? deepClone(layout) : {}, false);
    this.updateConfig(layout);
  }

  /**
   * Führt ein Update der UI durch.
   */
  updateUi() {
    this._update();
    this?._page?.vorlagen?.updateUi?.();
  }

  /**
   * Update der Zeilen, Spalten und des Grids
   * @param {Object} data 
   */
  updateConfig(data) {
    this._setInteger("rows", data?.rows || 1, true, 1);
    this._setInteger("cols", data?.cols || 1, true, 1);
    this._setObject("grid", data?.grid || { 0: "."});
    this.updateUi();
  }

  /**
   * Führt ein Update des Grids durch und liefert eine Kopie des Layouts zurück.
   * @param {Number} rowIx 
   * @param {Number} colIx 
   * @param {String} value 
   * @returns Object
   */
  updateGrid(rowIx, colIx, value) {
    const grid = this.grid;
    if (!this._isObject(grid)) return false;
    const row = grid[rowIx] || "";
    const cols = row.split(' ');
    if (cols?.[colIx]) {
      cols[colIx] = value;
    }
    this.grid[rowIx] = cols.join(' ');
    this.setCssProperties();
  }

  /**
   * Testet, ob ein String white-spaces enthält.
   * @param {String} str 
   * @returns Boolean
   */
  containsWhitespace(str) {
    return /\s/.test(str);
  }

  /**
   * Erzeugt ein Array aus einem String.
   * @param {String} str 
   * @returns Array
   */
  createArrayFromString(str) {
    return this.containsWhitespace(str) ? str.split(' ') : [str];
  }

  /**
   * Fügt eine neue Spalte ein
   * @param {Number} pos 
   * @param {String} str 
   * @returns  String
   */
  addColumn(pos, str) {
    const strArr = this.createArrayFromString(str);
    strArr.splice(pos, 0, '.');
    const copy = [...strArr];
    return copy.join(' ').trim();
  }

  /**
   * Entfernt eine Spalte
   * @param {Number} pos 
   * @param {String} str 
   * @returns  String
   */
  removeColumn(pos, str) {
    const strArr = this.createArrayFromString(str);
    strArr.length > 1 && strArr.splice(pos, 1);
    const copy = [...strArr];
    return copy.join(' ');
  }

  /**
   * Fügrt eine neue Zeile ein
   * @param {Number} colSize 
   * @returns String
   */
  addRow(colSize) {
    return '. '.repeat(colSize).trim();
  }

  /**
   * Erstellt ein neues Grid aus einem Array
   * @param {Array} arr 
   * @returns Object
   */
  createNewGrid(arr) {
    const newGrid = {};
    arr.forEach((item, ix) => {
      newGrid[ix] = item;
    });
    return newGrid;
  }

  /**
   * Fügt dem Grid eine neue Zeile hinzu
   * @param {Number} pos 
   * @param {Number} colSize 
   * @param {Object} grid 
   * @returns Object
   */
  addRowAtPos(pos, colSize, grid) {
    const copy = { ...grid };
    const arr = Object.values(copy);
    arr.splice(pos, 0, this.addRow(colSize));
    const newGrid = this.createNewGrid(arr);
    return newGrid;
  }

  /**
   * Entfernt eine Zeile aus dem Grid
   * @param {Number} pos 
   * @param {Object} grid 
   * @returns Object
   */
  removeRow(pos, grid) {
    const copy = { ...grid };
    const arr = Object.values(copy);
    arr.length > 1 && arr.splice(pos, 1);
    const newGrid = this.createNewGrid(arr);
    return newGrid;
  }

  /**
   * Fügt jeder Zeile des Grids eine Spalte hinzu
   * @param {Number} pos 
   * @param {Object} grid 
   * @returns Object
   */
  addColumnInAllRows(pos, grid) {
    const newGrid = {};
    Object.keys(grid).forEach((key) => {
      newGrid[key] = this.addColumn(pos, grid[key]);
    });
    return newGrid;
  }

  /**
   * Entfernt aus jeder Zeile des Grids eine Spalte
   * @param {Number} pos 
   * @param {Object} grid 
   * @returns Object
   */
  removeColumnInAllRows(pos, grid) {
    const newGrid = {};
    Object.keys(grid).forEach((key) => {
      newGrid[key] = this.removeColumn(pos, grid[key]);
    });
    return newGrid;
  }

  /**
   * Führt ein Update der Zeilen und Spalten durch.
   * @param {Object} settings 
   */
  updateColsAndRows(settings) {
    if (!settings) return false;
    let rowPos = settings.rowIx;
    let colPos = settings.colIx;
    let rows = this.rows;
    let cols = this.cols;
    const key = settings.key;
    let grid = null;

    switch (key) {
      case 'add_row_top':
        rows++;
        grid = this.addRowAtPos(rowPos, cols, this.grid);
        break;
      case 'add_row_bottom':
        rows++;
        rowPos++;
        grid = this.addRowAtPos(rowPos, cols, this.grid);
        break;
      case 'remove_row':
        rows > 1 && rows--;
        grid = this.removeRow(rowPos, this.grid);
        break;
      case 'add_col_left':
        cols++;
        grid = this.addColumnInAllRows(colPos, this.grid);
        break;
      case 'add_col_right':
        cols++;
        colPos++;
        grid = this.addColumnInAllRows(colPos, this.grid);
        break;
      case 'remove_col':
        cols > 1 && cols--;
        grid = this.removeColumnInAllRows(colPos, this.grid);
        break;
      default:
        grid = this.grid;
    }

    this.updateConfig({
      rows, 
      cols, 
      grid
    });
  }

  reset() {
    this.updateConfig(deepClone(this.defaultConfig));
  }

  /**
   * Testet, ob sich die Konfiguration des Layouts geändert hat.
   * @returns True, wenn es sich geändert hat und das Grid ein Object ist.
   */
  didLayoutChange(){
    const prevLayout = this.defaultConfig;
    const currentGrid = this?.grid;
    const prevGrid = prevLayout?.grid;
    const isDefaultGridAObject = this._isObject(prevGrid);
    const gridLength = this._isObject(currentGrid) && Object.keys(currentGrid)?.length;
    return !!(gridLength && (
      !isDefaultGridAObject || (
        isDefaultGridAObject && (
          (
            this?.rows !== prevLayout?.rows ||
            this?.cols !== prevLayout?.cols
          ) || (
            gridLength !== Object.keys(prevGrid)?.length
          ) || (
            !!Object.keys(currentGrid)?.find?.((key) => currentGrid[key] !== prevGrid?.[key])
          )
        )
      )
    ));
  };

  createCssGridAreas(){
    const gridObj = this.grid;
    let cssGridStr = '';
    if (this._isObject(gridObj)) {
      Object.values(gridObj).forEach((item) => {
        cssGridStr += `"${item}" `;
      });
    }
    return cssGridStr;
  };
  
  setCssProperties() {
    const root = document.querySelector(':root');
    root.style.setProperty('--cssDisplay', 'grid');
    const cssGridAreas = this.createCssGridAreas();
    const names = {
      desktop: '--cssGridAreas',
      tablet: '--cssGridAreasTablet',
      mobile: '--cssGridAreasMobile'
    };
    const name = names?.[this.device];
    name && root.style.setProperty(name, cssGridAreas);
    this.updateUi();
  };
}

export default VerteilerLayout;