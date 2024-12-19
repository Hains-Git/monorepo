/**
* Testet eine Variable auf ihren Typ.
* Dabei kann auch zwischen Objekten und Funktionen unterschieden werden.
* @param {any} value Variable die getestet werden soll
* @returns {string} Typ der Variablen
*/
export const checkType = (value: any): string => {
  const result = Object.prototype.toString.call(value);
  const type = result.split(" ")[1].replace("]", "");
  return type;
};

/**
 * Testet, ob es sich bei der Varibalen um ein Object handelt
 * @param {any} value Varibale die getestet werden soll
 * @returns {boolean} True, wenn es ein Object ist, ansonsten false
 */
export const isObject = (value: any): boolean => checkType(value) === "Object";

/**
 * Testet, ob es sich bei der Variablen um eine Funktion handelt
 * @param {any} value Varibale die getestet werden soll
 * @returns {boolean} True, wenn es eine Funktion ist, ansonsten false
 */
export const isFunction = (value: any): boolean => checkType(value) === "Function";