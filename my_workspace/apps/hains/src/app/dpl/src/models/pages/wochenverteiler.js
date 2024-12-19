import Verteiler from './verteiler';
import { getRGB } from "../../tools/helper";
import { autoA4SizePDFTable } from "../../util_func/util";
import { development } from "../../tools/flags";
import { getWeek, toDate } from "../../tools/dates";

class Wochenverteiler extends Verteiler {
  constructor(data, props, appModel = false) {
    super(data, props, appModel);
  }

  get filename() {
    const date = toDate(this?.calendar?.tag || new Date());
    return `WV-KW${getWeek(date)}-${date.getFullYear()}`;
  }

  /**
   * PDF-Tabellen-Zelle stylen
   * @param {Object} cellData 
   * @param {Object} param1 
   */
  getStylingPDF(cellData, {
    weekends,
    holidays,
    bereichColors,
    subBereichColors,
    bold
  }) {
    const section = cellData.section;
    const rowIndex = cellData.row.index;
    const colIndex = cellData.column.index;
    cellData.cell.styles.textColor = "#232328";
    const lwd = 0.3;
    cellData.cell.styles.lineWidth = {
      top: lwd, right: lwd, bottom: lwd, left: lwd
    };
    // cellData.cell.styles.lineColor = [180];
    cellData.cell.styles.lineColor = [255];
    cellData.cell.styles.fillColor = [255];
    if (section === "head") {
      // cellData.cell.styles.lineWidth.bottom = 1;
      cellData.cell.styles.fontStyle = 'bold';
      if (holidays.includes(colIndex)) {
        cellData.cell.styles.fillColor = [255, 200, 200];
      } else if (weekends.includes(cellData.column.index)) {
        cellData.cell.styles.fillColor = [215];
      }
    } else if (section === "body") {
      const color = bereichColors[colIndex]?.[rowIndex] || ( 
        subBereichColors?.[colIndex]?.find && subBereichColors[colIndex].find(
          (c) => rowIndex >= c.from && rowIndex <= c.to
        )?.color
      );
      if (color) {
        cellData.cell.styles.fillColor = color;
      }
      if (bold?.[colIndex]?.[rowIndex]) {
        cellData.cell.styles.fontStyle = 'bold';
      }
    }
  }

  initColorForData(data, ix, rowIndex, color_hl, color_bg, ib){
    if (color_hl) {
      if (!data.bereichColors[ix]) data.bereichColors[ix] = [];
      data.bereichColors[ix][rowIndex] = getRGB(color_hl);
    }
    if (color_bg) {
      if (!data.subBereichColors[ix]) data.subBereichColors[ix] = [];
      data.subBereichColors[ix].push({
        color: getRGB(color_bg),
        from: rowIndex + 1,
        to: data.bereichRows[ib]
      });
    }
  }

  addBoldToData(data, ixx, rowIndex) {
    if (!data.bold[ixx]) data.bold[ixx] = {};
    data.bold[ixx][rowIndex] = true;
  }

  addRowToData(data, rowIndex, colIndex, text, isOneColList = false) {
    if (!data.table.body[rowIndex]) {
      data.table.body[rowIndex] = [];
      const l = isOneColList ? 14 : 7;
      for (let i = 0; i < l; i++) {
        data.table.body[rowIndex].push({
          content: "", 
          colSpan: isOneColList ? 1 : 2
        });
      }
    }
    if (!data.table.body?.[rowIndex]?.[colIndex]) {
      console.error(
        "addToRow: data.table.body[rowIndex][colIndex] not exist", 
        {
          data, 
          row: data.table.body?.[rowIndex],
          rowIndex, 
          colIndex,
          text,
          isOneColList
        }
      );
    }
    data.table.body[rowIndex][colIndex].content = text;
    return data.table.body[rowIndex];
  }

  /**
   * Wochenverteiler-Daten für das PDF und die CSV vorbereiten 
   * @param {boolean} save
   * @returns Oject
   */
  prepareData(save = false) {
    const data = {
      table: {
        head: [[]],
        body: [],
        foot: [],
        theme: 'plain',
        tableWidth: 'wrap',
        horizontalPageBreak: true,
        styles: { cellWidth: 'wrap', fontSize: 12, font: "helvetica" },
        columnStyles: { text: { cellWidth: 'auto' } }
      },
      weekends: [],
      holidays: [],
      bereichColors: {},
      subBereichColors: {},
      bold: {},
      bereichRows: []
    };

    // Über Daten iterieren und Tabellen-Konfiguration erstellen
    this.data?.eachVerteilerDate?.((dayCol, ix) => {
      const {
        name,
        dateDe
      } = this.germanDate(dayCol);
      const ixx = ix * 2;
      data.table.head[0].push({content: `${name}, ${dateDe}`, colSpan: 2});
      if (this.data.dates?.[dayCol]?.isFeiertag) {
        data.holidays.push(ixx);
      }
      if (ix > 4) {
        data.weekends.push(ixx);
      }
      let rowIndex = -1;
      // Iteriert über die Bereiche für einen Tag
      let ib = -1;
      this.data.bereiche?.eachByVorlage?.((bereich) => {
        if(save && !this.showBereich(bereich)) return;
        ib++;
        const {
          content_layout,
          color_hl,
          color_bg,
          isOneColList
        } = bereich;
        rowIndex++;
        const lastRows = data.bereichRows[ib-1];
        if (ix === 0) {
          const res = this.getBereichRowsLength(bereich);
          const l = res.length;
          for (let i = 1; i <= l; i++) {
            this.addRowToData(data, rowIndex+i, isOneColList ? ixx : ix, "", isOneColList);
            if (isOneColList) this.addRowToData(data, rowIndex+i, ixx+1, "", isOneColList);
          }
          data.bereichRows[ib] = l + 1;
          if (lastRows) data.bereichRows[ib] += lastRows;
        }
        if (lastRows) {
          rowIndex = lastRows;
        }
        this.addRowToData(
          data, 
          rowIndex, 
          ix, 
          bereich.name, 
          false
        );
        this.initColorForData(data, ixx, rowIndex, color_hl, color_bg, ib);
        if (isOneColList) this.initColorForData(data, ixx+1, rowIndex, color_hl, color_bg, ib);
        this.addBoldToData(data, ixx, rowIndex);
        if (isOneColList) this.addBoldToData(data, ixx+1, rowIndex);
        // Iteriert über die Dienste eines Bereiches
        this.getContent(bereich, dayCol, true, ({
            po_dienst,
            einteilungen,
            label
          }) => {
          if (!isOneColList) {
            rowIndex++;
            this.addRowToData(
              data, 
              rowIndex, 
              ix, 
              label, 
              false
            );
            this.addBoldToData(data, ixx, rowIndex);
          }
          // Iteriert über die Einteilungen eines Dienstes
          einteilungen.forEach((einteilung, ie) => {
            if (!einteilung?.id) return;
            const isEven = ie % 2 === 0;
            if (!isOneColList || isEven) {
              rowIndex++;
            }
            let colIndex = ix;
            if (isOneColList) colIndex = isEven ? ixx : ixx+1;
            this.addRowToData(
              data, 
              rowIndex, 
              colIndex, 
              this.getPDFEinteilung(content_layout, einteilung, po_dienst),
              isOneColList
            );
          });
        });
      });
    });
    if (development) console.log("data", data);
    return data;
  }

  /**
   * Erstellt eine PDF mit dem Wochenverteiler als Tabelle
   * @returns Object
   * @param {Boolean} save
   * @param {Function} callback
   */
  createPdf(save = false, callback = false) {
    const data = this.prepareData(save);
    const doc = autoA4SizePDFTable(data, {
      didParseCell: (cellData, _data) => this.getStylingPDF(cellData, _data),
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
    this.data.bereiche?.each?.((bereich) => callback(bereich));
  }
}

export default Wochenverteiler;
