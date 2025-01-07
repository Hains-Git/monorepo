import { TVertragsstufe } from './api_data_types';
import { CSS_Style } from './ts_types';

/**
 * Macht einen Deep-Clone des Javascript-Objekts, wobei Funktionen nicht
 * geklont werden
 * @param {T} obj
 * @returns T
 */
export type DeepClone = <T>(obj: T) => T;
export const deepClone: DeepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Konvertiert den Planname in einen eindeutigen Namen für Dienst und Bereich
 * @param {string} planname
 * @param {boolean} bereich
 * @returns {string} (b-|d-) + planname
 */
export function convertPlanname(planname: string, bereich: boolean): string {
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
 * Summiert die Klassennamen der Modules dynamisch
 * @param {string} className "name name2 ..."
 * @param {CSS_Style} styles CSS-Module
 * @returns {string} "name1 css_module_name2, ..."
 */
export const addClassNames = (className: string, styles: CSS_Style): string => {
  if (typeof className === 'string' && className) {
    return className
      .split(' ')
      .map((c) => {
        if (styles[c]) return styles[c];
        if (typeof c === 'string') return c;
        return '';
      })
      .join(' ')
      .trim();
  }
  return '';
};

/**
 * Vergleicht die String a und b numerisch
 * @param {string} a
 * @param {string} b
 * @returns {number} -1, 0, 1
 */
export const numericLocaleCompare = (a: string, b: string): number => {
  const result = a?.localeCompare?.(b, undefined, { numeric: true });
  return result === undefined ? 1 : result;
};

/**
 * Liefert den Wert des verschachtelten Schlüssels.
 * Der @ Key iteriert über alle Elemente eines Arrays / Objekts
 * und fügt sie durch den Join Parameter zu einem String zusammen.
 * @param {T} obj
 * @param {string} key
 * @param {string} join
 * @returns {any} value
 * @example
 * const obj = {a: {b: {c: 1}, e: [1,2,3], f: {g: 2, h: 3}}};
 * getNestedKey(obj, "a.b.c") // 1
 * getNestedKey(obj, "a.e[1]") // 2
 * getNestedKey(obj, "a.f.@", "||") // 2||3
 * getNestedKey(obj, "a.e.@", ";") // 1;2;3
 */
export const getNestedAttr = (obj: any, key: string, join = '\n'): any => {
  if (typeof obj !== 'object') return;
  const keys = key?.split?.('.') || [''];
  let attr: any = obj;
  const l = keys.length;
  for (let i = 0; i < l; i++) {
    const currentKey = keys[i];
    if (currentKey === '@' && typeof attr === 'object') {
      return Object.values(attr)
        .map((a) => getNestedAttr(a, keys.slice(i + 1).join('.'), join))
        .join(join || '');
    }
    attr = attr?.[currentKey];
  }
  return attr;
};

/**
 * Verschiebt ein Popup in den sichtbaren Bereich des Fensters.
 * @param e
 */
export const resetElementPosition = <E extends HTMLElement | null>(e: E) => {
  if (!e) return;
  const { bottom, left, right, top } = (e as HTMLElement).getBoundingClientRect();
  const width = window.innerWidth - 20;
  const height = window.innerHeight - 20;
  if (bottom > height) {
    (e as HTMLElement).style.top = `${height - (bottom - top)}px`;
  }
  if (right > width) {
    (e as HTMLElement).style.left = `${width - (right - left)}px`;
  }
};

/**
 * Liefert den Indexwert aus einem String, der mit einem Pattern übereinstimmt.
 * @param {string} match
 * @returns {string} indexValue
 * @example
 * getIndexFromPattern("[0]") -> "0"
 * getIndexFromPattern(".a") -> "a"
 * getIndexFromPattern("[a]") -> "a"
 */
export const getIndexFromPattern = (match: string): string => {
  const replaceArrOrObjKey = /[\[\]\.]/g;
  let indexValue = match.replace(replaceArrOrObjKey, '');
  while (indexValue.match(replaceArrOrObjKey)) {
    indexValue = indexValue.replace(replaceArrOrObjKey, '');
  }
  return indexValue;
};

export const nestedFormDataPattern = /(\[\d+\])|(\.[^\[\]\.]*)|(\[[^\[\]\.]*\])/g;

export type FormDataObject = {
  [key: string]: any;
};

export const getValueAsPossibleNumber = (value: string | File) => {
  const num = Number(value);
  return !value || Number.isNaN(num) ? value : num;
};

/**
 * Liefert ein Javascript-Object aus einem FormData-Objekt.
 * Iteriert über alle FormData-Elemente.
 * Keys mit Punkten und eckigen Klammern werden als verschachtelte Objekte interpretiert.
 * @param {FormData} data
 * @returns {FormDataObject}
 * @example
 * const data = new FormData();
 * data.append("a.b.c", 1);
 * data.append("a.b.d", 2);
 * data.append("a.e[0]", 3);
 * data.append("a.e[1]", 4);
 * data.append("b[0].a.[0]", 3);
 * data.append("b[0].a.[1]", 2);
 * data.append("b[1].a.[0]", 7);
 * data.append("f", 5);
 * -> result = {
 *   a: {
 *     b: { c: 1, d: 2 },
 *     e: [3, 4]
 *   },
 *   b: [
 *    {a: [3, 2]},
 *    {a: [7]}
 *   ],
 *   f: 5
 * }
 */
export const getFormDataAsObject = (data: FormData): FormDataObject => {
  const obj: FormDataObject = {};
  const arrMatch = /(\[\d+\])/g;
  const objArrKeys: string[] = [];
  data.forEach((value, key) => {
    const matches = key.match(nestedFormDataPattern);
    if (matches?.length) {
      if (value === '') return;
      let newKey = key;
      while (newKey.match(nestedFormDataPattern)) {
        newKey = newKey.replace(nestedFormDataPattern, '');
      }
      if (!objArrKeys.includes(newKey)) objArrKeys.push(newKey);
      const l = matches.length - 1;
      let last = obj[newKey];
      const matchKeys: string[] = [];
      matches.forEach((matchValue, i) => {
        const isArr = !!matchValue.match(arrMatch);
        const matchKey = getIndexFromPattern(matchValue);
        matchKeys.push(matchKey);
        const _key = matchKeys[i - 1];
        if (i === 0 && !obj[newKey]) {
          obj[newKey] = isArr ? [] : {};
          last = obj[newKey];
        } else if (i > 0) {
          if (!last[_key]) last[_key] = isArr ? [] : {};
          last = last[_key];
        }
        if (i === l) {
          last[matchKey] = value;
        }
      });
    } else {
      obj[key] = value;
    }
  });
  objArrKeys.forEach((key) => {
    obj[key] = JSON.stringify(obj[key]);
  });

  return obj;
};

/**
 * Reinigt den Plannamen von inaktiven Mitarbeitern
 * @param {string} name
 * @returns {string}
 */
export const cleanInactiveName = (name: string): string => {
  const nameStr = name?.toString?.() || '';
  const pattern = /(bis \d{4}-\d{1,2}-\d{1,2})|((OLD)?-\d{1,2}\.\d{1,2}\.\d{4})/;
  const pos = nameStr.search(pattern);
  if (pos > 0) {
    return `${nameStr.slice(0, pos).trim()} (NA)`;
  }

  return nameStr.trim();
};

export const getTagKey = (str: string) => {
  const arr = str.split('-');
  const m = arr[1];
  const key = `${arr[0]}-${m}-01`;
  return key;
};

const getDateString = (date: Date) => {
  const year = date.getFullYear();
  let month: string | number = date.getMonth() + 1;
  let day: string | number = date.getDate();
  if (month < 10) month = `0${month}`;
  if (day < 10) day = `0${day}`;
  return `${year}-${month}-${day}`;
};

export const getStartAndEnd = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const nextMonth = new Date(year, month, 32);
  const end = new Date(year, month, 32 - nextMonth.getDate());
  return {
    start: getDateString(start),
    end: getDateString(end)
  };
};

/**
 * @param dateStr - string [in format of 2024-06-24T09:13:49.597Z]
 * @param showTime = boolean [ob die Zeit mit angezeigt werden soll]
 * @returns string [in format of 24.06.2024, 11:18:03]
 */
export const convertDateInGermanDateTimeFormat = (dateStr: string, showTime = false) => {
  const date = new Date(dateStr);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  const res = showTime ? `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}` : `${day}.${month}.${year}`;
  return res;
};

export function hexToRgb(hex: string, defaultValue = 0): number[] {
  const result = [defaultValue, defaultValue, defaultValue];
  hex = hex.toLowerCase().trim();
  if (!(/^#[0-9a-f]{6}$/.test(hex) || /^#[0-9a-f]{3}$/.test(hex))) return result;
  hex = hex.replace('#', '');
  if (hex.length === 6) {
    result[0] = parseInt(hex.substring(0, 2), 16);
    result[1] = parseInt(hex.substring(2, 4), 16);
    result[2] = parseInt(hex.substring(4, 6), 16);
  }
  if (hex.length === 3) {
    result[0] = parseInt(hex.substring(0, 1), 16) * 17;
    result[1] = parseInt(hex.substring(1, 2), 16) * 17;
    result[2] = parseInt(hex.substring(2, 3), 16) * 17;
  }
  return result;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const getContrast = (foregroundColor: string, backgroundColor: string) => {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color).map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };

  const foreLum = getLuminance(foregroundColor);
  const backLum = getLuminance(backgroundColor);

  const contrast = (foreLum + 0.05) / (backLum + 0.05);

  return contrast;
};

export const getFontColor = (fg: string, bg: string, ratio = 2.3) => {
  const contrastRatio = getContrast(fg, bg);
  const color = contrastRatio > ratio ? '#FFFFFF' : '#000';
  return { color, contrastRatio };
};

export const getFontColorByWhite = (bg: string, ratio = 2.3) => {
  return getFontColor('#FFFFFF', bg, ratio);
};

export const sortVertragsstufen = (a: TVertragsstufe, b: TVertragsstufe) => {
  const typ = numericLocaleCompare(
    getNestedAttr(a, 'vertragstyp.name') || '',
    getNestedAttr(b, 'vertragstyp.name') || ''
  );
  if (typ !== 0) return typ;
  const gruppe = numericLocaleCompare(
    getNestedAttr(a, 'vertragsgruppe.name') || '',
    getNestedAttr(b, 'vertragsgruppe.name') || ''
  );
  if (gruppe !== 0) return gruppe;
  const sufe = a.stufe - b.stufe;
  if (sufe !== 0) return sufe;
  const bis = numericLocaleCompare(
    getNestedAttr(a, 'vertrags_variante.bis') || '',
    getNestedAttr(b, 'vertrags_variante.bis') || ''
  );
  if (bis !== 0) return bis;
  return numericLocaleCompare(
    getNestedAttr(a, 'vertrags_variante.von') || '',
    getNestedAttr(b, 'vertrags_variante.von') || ''
  );
};
