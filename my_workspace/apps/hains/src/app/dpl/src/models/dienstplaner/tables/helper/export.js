import { isArray } from "../../../../tools/types";

export const addKeys = (data, key, date, pos, row = true) => {
  if (date?.is_weekend) {
    const arr = row
      ? data.rows[key].wochenendenRowKeys
      : data.columns[key].wochenendenColumnKeys;
    if (!arr.includes(pos)) arr.push(pos);
  }
  if (date?.isFeiertag) {
    const arr = row
      ? data.rows[key].feiertageRowKeys
      : data.columns[key].feiertageColumnKeys;
    if (!arr.includes(pos)) arr.push(pos);
  }
};

export const notMainZeitraum = (onlyMainZeitraum, date) => (onlyMainZeitraum && date
  ? !date?.isInMainZeitraum
  : false);

export const addContent = (content, withColor, data, key, rowIndex, colIndex) => {
  if (isArray(content)) {
    return content.map((arrOrString, n) => {
      if (isArray(arrOrString)) {
        const [
          str,
          color
        ] = arrOrString;
        if (withColor && color?.length === 3) {
          if (!data.backgroundColors[key]?.[rowIndex]) {
            data.backgroundColors[key][rowIndex] = {};
          }
          if (!data.backgroundColors[key][rowIndex]?.[colIndex]) {
            data.backgroundColors[key][rowIndex][colIndex] = {};
          }
          data.backgroundColors[key][rowIndex][colIndex][n] = color;
        }
        return typeof str === "string" ? str : "";
      }
      return typeof arrOrString === "string" ? arrOrString : "";
    }).join("\n");
  }
  return typeof content === "string" ? content : "";
};
