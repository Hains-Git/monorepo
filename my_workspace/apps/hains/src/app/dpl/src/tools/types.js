/**
* Testet eine Variable auf ihren Typ.
* Dabei kann auch zwischen Objekten und Funktionen unterschieden werden.
* @param {Any} value Variable die getestet werden soll
* @returns {String} Typ der Variablen
* @example Object, Array, Function, String, Number, Boolean, Null, Undefined
*/
export const checkType = (value) => {
  const result = Object.prototype.toString.call(value);
  const type = result.split(" ")[1].replace("]", "");
  return type;
};

/**
 * Testet, ob es sich bei der Varibalen um ein Object handelt
 * @param {Any} value Varibale die getestet werden soll
 * @returns {Boolean} True, wenn es ein Object ist, ansonsten false
 */
export const isObject = (value) => checkType(value) === "Object";

/**
 * Testet, ob es sich bei der Varibalen um ein Date handelt
 * @param {Any} value Varibale die getestet werden soll
 * @returns {Boolean} True, wenn es ein Object ist, ansonsten false
 */
export const isDate = (value) => value instanceof Date;

/**
 * Testet, ob es sich bei der Variablen um eine Funktion handelt
 * @param {Any} value Varibale die getestet werden soll
 * @returns {Boolean} True, wenn es eine Funktion ist, ansonsten false
 */
export const isFunction = (value) => checkType(value) === "Function";

/**
 * Testet, ob es sich bei der Varibalen um ein Array handelt
 * @param {Any} value Varibale die getestet werden soll
 * @returns {Boolean} True, wenn es ein Array ist, ansonsten false
 */
export const isArray = (value) => Array.isArray(value);

/**
 * Testet, ob es sich bei der Varibalen um eine Zahl handelt.
 * Auch Zahlen-Strings werden als Zahl erkannt.
 * @param {Any} value
 * @returns {Boolean} True, wenn es eine Zahl ist. 
 */
export const isNumber = (value) => !Number.isNaN(parseFloat(value));