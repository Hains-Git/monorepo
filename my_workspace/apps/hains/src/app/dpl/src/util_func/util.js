/* eslint-disable func-names */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { isArray, isFunction } from '../tools/types';

export function convertPlanname(planname, bereich) {
  const start = bereich ? 'b-' : 'd-';
  return (
    start +
    planname
      .toLowerCase()
      .split(/[,./\s]/)
      .join('_')
  );
}

/**
 * Ermittelt die Größe der Tabelle in der PDF
 * @param {Object} table
 * @returns Object
 */
export const getPDFA4TableSize = (table) => {
  let w = 0;
  let h = 0;
  if (isArray(table.columns))
    table.columns.forEach(({ width }) => {
      w += width;
    });
  if (isArray(table.head))
    table.head.forEach(({ height }) => {
      h += height;
    });
  if (isArray(table.body))
    table.body.forEach(({ height }) => {
      h += height;
    });
  if (isArray(table.foot))
    table.foot.forEach(({ height }) => {
      h += height;
    });
  const margin = table.settings.margin;
  const format = [
    w + margin.left + margin.right + 100,
    h + margin.top + margin.bottom + 100
  ];
  // width / height; A4: 210 x 297 mm
  // A4 in pt = 595 x 842 -> 595
  const a4SeitenVerhaeltnis = 210 / 297;
  // Wenn die Tabelle auf ein A4-Blatt passt,
  // soll das Format des A4 genutzt werden
  if (format[0] <= 595) {
    // Seitenbreite passt auf das A4-Format
    // Hochformat
    format[0] = 595;
    format[1] = 842;
  } else if (format[0] <= 842) {
    // Seitenbreite passt auf das A4-Format
    // Querformat
    format[0] = 842;
    format[1] = 595;
  } else {
    // Seitenbreite passt nicht auf das A4-Format
    format[1] = format[0] * a4SeitenVerhaeltnis;
  }
  return {
    width: w,
    height: h,
    margin,
    table,
    format
  };
};

/**
 * Downloaden einer CSV-Datei
 * @param {String} data
 * @param {String} filename
 * @returns String
 */
export const downloadCSV = (data, filename) => {
  if (typeof data === 'string') {
    // Erstellen eines versteckten Links und setzen des Download-Attributs
    const link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,\uFEFF${encodeURIComponent(
        data
      )}\n\n\n\n\n\n\n\n\n\nSEP=;`
    );
    link.setAttribute('download', `${filename}.csv`);
    // Link einfügen, betätigen und wieder entfernen
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return data;
};

/**
 * Erstellt eine JS-PDF-Tabelle mit der maximalen Seitengröße und
 * führt ein Resizing auf ein A4-Seitenverhältnis durch.
 * @param {Object} data data = {table: Daten für jsPDF-AutoTable}
 * @param {Object} options options = {
 *    kommentar: string, // Kommentar, der unter der Tabelle angezeigt wird
 *
 *    didParseCell: function(cellData, data),
 *
 *    didDrawCell: function(cellData, data),
 *
 *    addDate: true, // Aktuelles Datum hinzufügen
 * }
 * @returns Object {docConfig, size}
 */
export const autoA4SizePDFTable = (data, options) => {
  if (!data?.table) return;
  // Tabelle mit maximaler Seitengröße erstellen
  const docConfig = {
    orientation: 'p',
    unit: 'pt',
    format: [14000, 14000]
  };
  // eslint-disable-next-line new-cap
  const doc = new jsPDF(docConfig);
  autoTable(doc, data.table);
  // A4 Seitenverhältnis ermitteln
  const size = getPDFA4TableSize(doc.lastAutoTable);
  docConfig.format = size.format;
  docConfig.orientation = size.format[0] >= size.format[1] ? 'l' : 'p';
  // Tabelle mit A4-Seitenverhältnis erstellen
  // Styling der Zellen hinzufügen
  if (isFunction(options?.didParseCell)) {
    data.table.didParseCell = (cellData) =>
      options.didParseCell(cellData, data);
  }
  if (isFunction(options?.didDrawCell)) {
    data.table.didDrawCell = (cellData) => options.didDrawCell(cellData, data);
  }
  // Neue PDF mit A4-Seitenverhältnis erstellen
  // eslint-disable-next-line new-cap
  const resultDoc = new jsPDF(docConfig);
  autoTable(resultDoc, data.table);
  // Datum und Kommentar hinzufügen
  const today = options?.addDate ? ` \nStand: ${new Date().toISOString()}` : '';
  const kommentar =
    options?.kommentar && typeof options.kommentar === 'string'
      ? `${options.kommentar}\n${today}`
      : today;
  const txt = kommentar.split('\n').map((t) => t.trim());
  const yDiff = 20;
  const fontSize = data.table?.styles?.fontSize || 12;
  const font = data.table?.styles?.font || 'helvetica';
  resultDoc.setFontSize(fontSize + 2);
  resultDoc.setFont(font, 'normal');
  resultDoc.text(
    txt,
    size.margin.left,
    resultDoc.lastAutoTable.finalY + yDiff,
    {
      maxWidth: size.width
    }
  );
  return resultDoc;
};

export function firefoxWorkaroundForDragging() {
  if (
    /Firefox\/\d+[\d.]*/.test(navigator.userAgent) &&
    typeof window.DragEvent === 'function' &&
    typeof window.addEventListener === 'function'
  )
    (function () {
      // patch for Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=505521
      let cx;
      let cy;
      let px;
      let py;
      let ox;
      let oy;
      let sx;
      let sy;
      let lx;
      let ly;
      function update(e) {
        cx = e.clientX;
        cy = e.clientY;
        px = e.pageX;
        py = e.pageY;
        ox = e.offsetX;
        oy = e.offsetY;
        sx = e.screenX;
        sy = e.screenY;
        lx = e.layerX;
        ly = e.layerY;
      }
      function assign(e) {
        e._ffix_cx = cx;
        e._ffix_cy = cy;
        e._ffix_px = px;
        e._ffix_py = py;
        e._ffix_ox = ox;
        e._ffix_oy = oy;
        e._ffix_sx = sx;
        e._ffix_sy = sy;
        e._ffix_lx = lx;
        e._ffix_ly = ly;
      }
      window.addEventListener('mousemove', update, true);
      window.addEventListener('dragover', update, true);
      // bug #505521 identifies these three listeners as problematic:
      // (although tests show 'dragstart' seems to work now, keep to be compatible)
      window.addEventListener('dragstart', assign, true);
      window.addEventListener('drag', assign, true);
      window.addEventListener('dragend', assign, true);

      const me = Object.getOwnPropertyDescriptors(window.MouseEvent.prototype);
      const ue = Object.getOwnPropertyDescriptors(window.UIEvent.prototype);
      function getter(prop, repl) {
        return function () {
          return (
            (me[prop] && me[prop].get.call(this)) || Number(this[repl]) || 0
          );
        };
      }
      function layerGetter(prop, repl) {
        return function () {
          return this.type === 'dragover' && ue[prop]
            ? ue[prop].get.call(this)
            : Number(this[repl]) || 0;
        };
      }
      Object.defineProperties(window.DragEvent.prototype, {
        clientX: { get: getter('clientX', '_ffix_cx') },
        clientY: { get: getter('clientY', '_ffix_cy') },
        pageX: { get: getter('pageX', '_ffix_px') },
        pageY: { get: getter('pageY', '_ffix_py') },
        offsetX: { get: getter('offsetX', '_ffix_ox') },
        offsetY: { get: getter('offsetY', '_ffix_oy') },
        screenX: { get: getter('screenX', '_ffix_sx') },
        screenY: { get: getter('screenY', '_ffix_sy') },
        x: { get: getter('x', '_ffix_cx') },
        y: { get: getter('y', '_ffix_cy') },
        layerX: { get: layerGetter('layerX', '_ffix_lx') },
        layerY: { get: layerGetter('layerY', '_ffix_ly') }
      });
    })();
}

/**
 * Summiert die Klassennamen der Modules dynamisch
 * @param {String} className "name name2 ..."
 * @param {Object} styles CSS-Module
 * @returns String
 */
export const addClassNames = (className, styles) => {
  if (typeof className === 'string' && className) {
    return className
      .split(' ')
      .map((c) => {
        if (styles[c]) return styles[c];
        if (typeof c === 'string') return c
        return ''
      })
      .join(' ')
      .trim();
  }
  return '';
};

function yieldFkt() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

/**
 * Führt die Tasks sequentiell aus.
 * Copied from mozilla developper javascript performance
 * @param {Array} tasks
 */
export async function breakTasks(tasks) {
  while (tasks.length > 0) {
    // Yield to a pending user input
    if (navigator.scheduling.isInputPending()) {
      // eslint-disable-next-line no-await-in-loop
      await yieldFkt();
    } else {
      // Shift the first task off the tasks array
      const task = tasks.shift();
      // Run the task
      task();
    }
  }
}

export const pushToMitarbeiterDetails = (mitarbeiter_id) => {
  if(!mitarbeiter_id) return;
  const a = document.createElement('a');
  a.target = '_blank';
  a.href = `${window.location.origin}/dpl/mitarbeiterinfo?view=detail&id=${mitarbeiter_id}`;
  a.click();
}