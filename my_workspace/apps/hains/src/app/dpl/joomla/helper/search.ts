/**
 * Testet, ob value das valueToSearch enthält.
 * Wenn valuetoSearch in Anführungszeichen steckt, wird getestet,
 * ob es am Anfang des value steht.
 * @param {string} value
 * @param {string} valueToSearch
 * @returns {boolean} True, wenn value das SearchValue entält
 */
export const stringIncludesSearchValue = (value: string, valueToSearch: string): boolean => {
  const cleanedValue = value?.toString?.()?.trim?.()?.toLowerCase?.() || "";
  const searchValue = valueToSearch?.toString?.()?.trim?.()?.toLowerCase?.() || "";
  const l = searchValue.length - 1;
  if (l < 0) return true;
  if (l > 1 && searchValue.charAt(0) === '"' && searchValue.charAt(l) === '"') {
    return cleanedValue.indexOf(searchValue.substring(1, l).trim()) === 0;
  }
  return cleanedValue.indexOf(searchValue) >= 0;
};

/**
 * Testet Array aus String oder einen String auf das Enthaltensein
 * von valueToSearch.
 * @param {string|string[]} value
 * @param {string} valueToSearch
 * @returns {boolean} True, wenn value valueToSearch min. einmal enthält.
 */
export const stringArrayOrStringIncludesSearchValue = (
  value: string | string[],
  valueToSearch: string
): boolean => {
  if (typeof value === 'string') {
    return stringIncludesSearchValue(value, valueToSearch);
  }
  let inSearch = false;
  value?.find?.((name) => {
    inSearch = stringIncludesSearchValue(name, valueToSearch);
    return inSearch;
  });
  return inSearch
};

/**
 * Testet, ob der Value im valueToSearch enthalten ist.
 * valueToSearch kann ein Array aus Strings oder ein String sein.
 * Wenn der Suchbegriff in "" steckt, wird getestet, ob der Suchbegriff am Anfang
 * des String steckt.
 * Weiterhin können Suchbegriffe mit && und || verknüpft werden.
 * Wobei erst && und dann || ausgwertet werden.
 * @param {string|string[]} value
 * @param {string} valueToSearch
 * @returns {boolean} True, wenn der valueToSearch enthalten ist.
 */
export const booleanSearch = (value: string|string[], valueToSearch: string): boolean => {
  const isValid = valueToSearch?.trim?.() || "";
  if (!isValid) return true;
  const ors = valueToSearch.split('||').map((v) => v.split('&&'));
  let inSearch = false;
  ors.find((orValues: string|string[]) => {
    if (typeof orValues === 'string') {
      inSearch = stringArrayOrStringIncludesSearchValue(value, orValues);
      return inSearch;
    }
    inSearch = orValues.reduce((bool, andValue) => bool && stringArrayOrStringIncludesSearchValue(value, andValue), true);
    return inSearch;
  });
  return inSearch;
};