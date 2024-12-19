/**
 * Verzögert die Ausführung einer Funktion um einen bestimmten Zeitraum.
 * Und verhindert das mehrfache Ausführen der Funktion.
 * @param {Funtion} func
 * @param {Number} timeout
 */
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/**
 * Verzögert die Ausführung einer Funktion um einen bestimmten Zeitraum.
 * Und verhindert das mehrfache Ausführen der Funktion, abhängig von einer ID.
 * @param {Funtion} func
 * @param {Number} timeout
 */
export function customDebounce(func, timeout = 300) {
  const timer = {};
  return (id = '0', ...args) => {
    const thisId = id.toString();
    clearTimeout(timer[thisId]);
    timer[thisId] = setTimeout(() => {
      func.apply(this, args);
      if (timer[thisId]) {
        delete timer[thisId];
      }
    }, timeout);
  };
}

/**
 * Führt eine Funktion aus und verhindert das folgende erneute Ausführen der Funktion
 * in einem bestimmten Zeitraum.
 * @param {Funtion} func
 * @param {Number} timeout
 */
export function debounceLeading(func, timeout = 300) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

/**
 * Führt nur in bestimmten Zeitabständen aus und der letzte Aufruf wird ausgeführt.
 * @param {Funtion} func
 * @param {Number} delay
 */
export function throttle(func, delay) {
  let lastTime;
  let lastFunc;
  const getDiff = () => Date.now() - lastTime;
  return (...args) => {
    if (!lastTime) {
      func.apply(this, args);
      lastTime = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (getDiff() >= delay) {
          func.apply(this, args);
          lastTime = Date.now();
        }
      }, delay - getDiff());
    }
  };
}

export const longwait = 300;

export const wait = 200;

export const shortwait = 100;

export const veryshortwait = 50;

export const noWait = 0;
