import React from "react";
import { showConsole } from "../../../tools/flags";
import Basic from "../../basic";
import { HEX, numericLocaleCompare } from "../../../tools/helper";
import { bsColors } from "../../../styles/basic";
import {
  debounce, shortwait, wait
} from "../../../tools/debounce";
import { isFunction, isNumber } from "../../../tools/types";

/**
 * Erstellt das Label für die xTicks
 * @param {Object} param0
 * @returns ReactElement
 */
const xTick = ({
  x, y, payload
}) => {
  // Sehr lange Namen verkürzen, damit kein Overflow entsteht
  const l = (payload?.value?.slice && payload?.value?.length) || 0;
  const value = l > 12
    ? `${payload.value.slice(0, 12)}...`
    : payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-45)">
        {value}
      </text>
    </g>
  );
};

class Shared extends Basic {
  constructor(index, parent, appModel = false) {
    super(appModel);
    this._set("parent", parent);
    this._set("sort", false);
    this.setCurrentSort(0);
    this._setObject("responsiveContainer", {
      width: "100%",
      height: 500,
      debounce: 200
    });
    this._setObject("chart", {
      type: "bar",
      layout: "horizontal",
      tooltip: false,
      onClick: null,
      barCategoryGap: "5%",
      barGap: "2%",
      dataSettings: {},
      margin: {
        top: 0,
        bottom: 100,
        left: 0,
        right: 0
      },
      xAxis: {
        axisKey: "name",
        label: false,
        tick: xTick,
        hide: false,
        type: "category",
        tickCount: 5,
        minTickGap: 0,
        allowDecimals: false
      },
      yAxis: {
        label: false,
        hide: false,
        type: "number",
        tick: {
          stroke: 'grey',
          strokeWidth: 0.1
        },
        tickCount: 7,
        minTickGap: 0,
        allowDecimals: false
      },
      brush: {
        dataKey: "name",
        height: 30,
        travellerWidth: 15,
        y: 450,
        updateIndex: (brushIndex) => {
          this.chart.brush.startIndex = brushIndex.startIndex;
          this.chart.brush.endIndex = brushIndex.endIndex;
          this.update("table", {});
        }
      },
      referenceLines: []
    });
    this._set("data", false);
    this._set("table", true);
    this._set("label", "");
    this._set("current", index);
    this.toggleId();
    this.setOnlyMainZeitraum(true);
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Liefert die ID für die Komponente
   */
  get id() {
    return `dienstplan-statistik-${this.position}-${this.idToogle ? 1 : 0}`;
  }

  /**
   * Liefert die Statistik-Models aus dem Parent
   */
  get models() {
    return this?.parent?.models || [];
  }

  /**
   * Liefert den Index der Statistik im Parent-Element
   */
  get position() {
    const arr = this?.parent?.statistics;
    const i = arr?.indexOf ? arr?.indexOf(this) : -1;
    return i;
  }

  /**
   * Erzeugt eine Zufällige Hexa-Dezimale Zahl, welche eine Farbe darstellt
   */
  get randomFill() {
    let hexCode = "#";
    for (let i = 0; i < 6; i++) {
      const randomNumber = Math.floor(Math.random() * 16);
      hexCode += HEX[randomNumber];
    }
    return hexCode;
  }

  /**
   * Liefert die Länge der Daten
   */
  get dataLength() {
    return this?.data?.length || 0;
  }

  /**
   * Liefert den Namen des Hauptmonats
   */
  get monthLabel() {
    return `Nur Hauptmonat (${this?._mainDate?.month || "Unbekannt"})`;
  }

  /**
   * Erzeugt ein neues InfoEl
   * @param {Object|Function} info
   * @param {String} name
   * @returns Object
   */
  createInfoEl(info, name) {
    const infoEl = {
      get _info() {
        if (isFunction(info)) return info();
        return info;
      }
    };
    infoEl.setInfo = () => {
      this._setPageInfoPopup(name, infoEl);
    };
    return infoEl;
  }

  /**
   * Um das Diagramm mit seinem Brush upzudaten,
   * muss der Key sich verändern und dieser entspricht der ID.
   */
  toggleId() {
    this._set("idToogle", !this?.idToogle);
  }

  /**
   * Funktion, mit der die Daten erstellt werden
   * @param {Array|Object} data
   */
  createData(data = []) {
    this._set("data", data);
  }

  /**
   * Berechnet und sortiert die Daten neu
   */
  updateData = debounce(() => {
    this.createData();
    this.setCurrentSort(this.currentSort);
  }, wait);

  /**
   * Ändert den Zeitraum für die Statistik
   * @param {Boolean} check
   */
  setOnlyMainZeitraum(check = true) {
    this._set("onlyMainZeitraum", check);
  }

  toggleOnlyMainZeitraum = debounce(() => {
    this.setOnlyMainZeitraum(!this.onlyMainZeitraum);
    this.updateData();
  }, shortwait);

  /**
   * Ändert die Sortierung anhand des Sortings
   * @param {Number} index
   */
  setCurrentSort(index = 0) {
    this._set("currentSort", index);
    const sort = this?.sort?.[this.currentSort];
    if (sort?.fkt) {
      sort.fkt();
    }
    this.toggleId();
    this._update();
  }

  /**
   * Setzt die Brush entsprechend der Sortierung zurück
   */
  resetBrushIndex() {
    const sort = this?.sort?.[this.currentSort];
    if (sort?.setBrush) {
      sort.setBrush();
    }
    this.toggleId();
    this._update();
  }

  /**
   * Entfernt die Statistik aus dem Parent
   */
  remove() {
    if (this?.parent?.removeStatistic) {
      this.parent.removeStatistic(this.position);
    }
  }

  /**
   * Ändert die aktuelle Statistik.
   */
  change(item) {
    if (this?.parent?.changeStatistic && item?.index !== this.current) {
      this.parent.changeStatistic(this.position, item);
    }
  }

  /**
   * Iteriert über die Keys des ersten Data-Elements, wenn es ein Object ist
   * und führt den Callback aus.
   * @param {Function} callback
   * @param {Boolean} ignoreNotNumbers
   */
  iterateFirstDataElement(callback, ignoreNotNumbers = true) {
    const firstElement = this?.data?.[0];
    if (this._isObject(firstElement)) {
      for (const key in firstElement) {
        const barData = firstElement[key];
        if (ignoreNotNumbers && !isNumber(barData)) continue;
        if (this._isFunction(callback)) callback(barData, key);
      }
    }
  }

  /**
   * Liefert die Farbe für eine Data-Kategorie
   * @param {Number} pos
   */
  getDataColor(pos) {
    const defaultColors = [
      bsColors.primary,
      bsColors.second,
      bsColors.third,
      bsColors.fourth,
      bsColors.fifth
    ];
    return defaultColors?.[pos] || this.randomFill;
  }

  /**
   * Erstellt für jedes Min und Max eine Referenz-Linie
   * @param {Number} value
   * @param {String} key
   * @param {String} label
   */
  createYReferenceLine(value, key, label = "") {
    if (value > 0) {
      if (this._isArray(this.chart.dataSettings[key].referenceLinesPositions)) {
        this.chart.dataSettings[key].referenceLinesPositions.push(this.chart.referenceLines.length);
      }
      this.chart.referenceLines.push({
        label,
        isFront: true,
        y: value,
        stroke: this.randomFill,
        strokeWidth: 1,
        filter: false
      });
    }
  }

  /**
   * Erstellt die Data-Settings für stacked Bars
   */
  createDataSettingsStacked() {
    let i = 0;
    this.iterateFirstDataElement((data, key) => {
      this.createDataSetting(key, "Gesamt", i);
      i++;
    }, true);
  }

  /**
   * Erstellt die Data-Settings für not stacked Bars
   */
  createDataSettingsNotStacked() {
    let i = 0;
    this.iterateFirstDataElement((data, key) => {
      this.createDataSetting(key, key, i);
      i++;
    }, true);
  }

  /**
   * Fügt ein Data-Setting-Attribut hinzu
   * @param {String} key
   * @param {String} stackedId
   * @param {Number} fillNr
   */
  createDataSetting(key, stackedId, fillNr, type = "") {
    this.chart.dataSettings[key] = {
      label: key,
      stackedId,
      type: type || this.chart.type,
      referenceLinesPositions: [],
      fill: this.getDataColor(fillNr),
      filter: false,
      filterHandler: (evt) => {
        evt.stopPropagation();
        const checked = !this.chart.dataSettings[key].filter;
        this.chart.dataSettings[key].filter = checked;
        // Referenz-Linien ausblenden
        this.chart.dataSettings[key].referenceLinesPositions.forEach((pos) => {
          if (this.chart?.referenceLines?.[pos]) {
            this.chart.referenceLines[pos].filter = checked;
          }
        });
        this.setCurrentSort(this.currentSort);
      }
    };
  }

  /**
   * Erstellt das Tooltip für not stacked Bars
   * @param {Array} keys
   */
  createNotStackedTooltip(keys = []) {
    const getCustomIntros = (payload, unit) => {
      const result = [];
      keys?.forEach?.(({ dataKeys, label }) => {
        result.push(
          <p
            className="intro"
            key={label}
          >
            {`${label}: ${dataKeys?.length
              ? payload.reduce((total, pl) => (total + (dataKeys.includes(pl.dataKey)
                ? pl.value : 0)), 0)
              : ""} ${unit}`}
          </p>
        );
      });
      return result;
    };
    this.chart.tooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        const unit = payload?.[0]?.payload?.unit || "";
        return (
          <div className="custom-graph-tooltip">
            <p className="label">{`${label}`}</p>
            {getCustomIntros(payload, unit)}
            {payload.map((pl) => (
              <p
                className="intro"
                style={{
                  color: pl.fill
                }}
                key={pl.name}
              >
                {`${pl.name}: ${pl.value} ${unit}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };
  }

  /**
   * Passt die Brush-Indizes an
   * @param {Number} startIndex
   * @param {Number} endIndex
   * @param {Boolean} start
   */
  setBrushIndex(startIndex = 0, endIndex = 0, start = false) {
    const l = this.dataLength;
    this.chart.brush.startIndex = start && startIndex > 0 && startIndex < l
      ? startIndex - 1 : 0;
    this.chart.brush.endIndex = !start && endIndex > 0 && endIndex < l
      ? endIndex : l - 1;
  }

  getSum(x, keys) {
    return keys?.reduce?.((total, key) => {
      return total + x[key];
    }, 0) || 0;
  }

  /**
   * Sortiert die Daten anhand summierter Keys auf oder absteigend
   * @param {Array} keys
   * @param {Boolean} absteigend
   */
  sortSum(keys = [], absteigend = true) {
    if (!this?.data?.sort) return;
    const sort = absteigend
      ? (a, b) => this.getSum(b, keys) - this.getSum(a, keys)
      : (a, b) => this.getSum(a, keys) - this.getSum(b, keys)
    this.data.sort(sort);
  }

  /**
   * Sortiert die Daten alphabetisch nach einem Key
   * @param {String} key
   */
  sortAlphabetic(key = "") {
    if (!this?.data?.sort) return;
    this.data.sort(
      (a, b) => numericLocaleCompare(a[key], b[key])
    );
  }

  /**
   * Fügt dem sort eine neue Sortierung hinzu
   * @param {String} id
   * @param {String} title
   * @param {Array} keys
   * @param {Boolean} absteigend
   * @param {Boolean} alph
   */
  addToSort(id = "", title = "", keys = [], absteigend = false, alph = false) {
    if (!this._isArray(this.sort)) {
      this._setArray("sort", []);
    }
    this.sort.push({
      id,
      title,
      index: this.sort.length,
      fkt: () => {
        if(alph) return this.sortAlphabetic(keys?.[0] || "name");
        const dataSettings = this?.chart?.dataSettings;
        const filteredKeys = keys.filter((k) => !dataSettings?.[k]?.filter);
        return this.sortSum(filteredKeys, absteigend);
      },
      setBrush: () => this.resetBrush(keys, alph)
    });
  }

  /**
   * Stellt die Brush entsprechend ein
   * @param {Array} keys
   * @param {Boolean} alph
   */
  resetBrush(keys = [], alph = false) {
    if (alph) this.setBrushIndex(0, 0, true);
    else if (this?.data?.findIndex) {
      const dataSettings = this?.chart?.dataSettings;
      const filteredKeys = keys.filter((k) => !dataSettings?.[k]?.filter);
      const limit = this.getSum(this.data[this.dataLength - 1], filteredKeys);
      const i = this.data.findIndex((x) => this.getSum(x, filteredKeys) === limit);
      this.setBrushIndex(0, i, false);
    }
  }

  /**
   * Testet, ob das Element gefiltert wird.
   * @param {Object} mitarbeiter
   * @param {Object} feld
   */
  isInFilter(mitarbeiter, feld) {
    let result = true;
    if (this?.parent?.filterVorlage?.isInFilter) {
      result = this?.parent?.filterVorlage?.isInFilter({
        mitarbeiter,
        date: feld?.date,
        dienst: feld?.dienst,
        teams: {
          mitarbeiter,
          date: feld?.date
        }
      });
    }
    return result;
  }
}

export default Shared;
