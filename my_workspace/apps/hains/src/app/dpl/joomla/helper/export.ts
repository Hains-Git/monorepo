import jsPDF, { jsPDFOptions } from 'jspdf';
import autoTable, { UserOptions, Table } from 'jspdf-autotable';

export const getPDFA4TableSize = (table: Table) => {
  let w = 0;
  let h = 0;
  if (Array.isArray(table.columns))
    table.columns.forEach(({ width }) => {
      w += width;
    });
  if (Array.isArray(table.head))
    table.head.forEach(({ height }) => {
      h += height;
    });
  if (Array.isArray(table.body))
    table.body.forEach(({ height }) => {
      h += height;
    });
  if (Array.isArray(table.foot))
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

export const createPDFTable = (
  tableOptions: UserOptions,
  options?: jsPDFOptions
) => {
  const defaultOptions: jsPDFOptions = {
    orientation: 'p',
    unit: 'pt',
    format: [14000, 14000]
  };
  const docConfig: jsPDFOptions = options
    ? { ...options, ...defaultOptions }
    : defaultOptions;
  // Erst maximale Größe erstellen
  const doc = new jsPDF(docConfig) as any;
  const tableOptionsCopy = {
    ...tableOptions,
    didParseCell: undefined,
    willDrawCell: undefined,
    didDrawCell: undefined,
    willDrawPage: undefined,
    didDrawPage: undefined
  };
  autoTable(doc, tableOptionsCopy);
  // Größe auf A4 Verhältnis anpassen
  const size = getPDFA4TableSize(doc.lastAutoTable as Table);
  docConfig.format = size.format;
  docConfig.orientation = size.format[0] >= size.format[1] ? 'l' : 'p';
  // Entgültiges Dokument erstellen
  const resultDoc = new jsPDF(docConfig);
  autoTable(resultDoc, tableOptions);
  return resultDoc;
};

export const downloadCSV = (data: string, filename: string) => {
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
