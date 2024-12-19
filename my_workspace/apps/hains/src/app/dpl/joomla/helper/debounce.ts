type Func = (...args: any[]) => void;

/**
 * Verzögert die Ausführung einer Funktion um einen bestimmten Zeitraum.
 * Und verhindert das mehrfache Ausführen der Funktion.
 * @param {Func} func
 * @param {number} timeout
 * @returns {Func}
 */
export function debounce(this: any, func: Func, timeout: number = 300): Func {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

type Id = string|number|boolean;
type IdFunc = (id:Id, ...args: any[]) => void;
/**
 * Verzögert die Ausführung einer Funktion um einen bestimmten Zeitraum.
 * Und verhindert das mehrfache Ausführen der Funktion, abhängig von einer ID.
 * @param {Func} func
 * @param {number} timeout
 * @returns {IdFunc}
 */
export function customDebounce(this: any, func: Func, timeout: number = 300): IdFunc {
  const timer: {
    [key: string]: ReturnType<typeof setTimeout> | undefined;
  } = {};
  return (id:Id = '0', ...args: any[]) => {
    const thisId:string = id?.toString?.() || "";
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
 * @param {Func} func
 * @param {number} timeout
 * @returns {Func}
 */
export function debounceLeading(this: any, func: Func, timeout: number = 300): Func {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: any[]) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined
    }, timeout);
  };
}

/**
 * Führt nur in bestimmten Zeitabständen aus und der letzte Aufruf wird ausgeführt.
 * @param {Func} func
 * @param {number} delay
 * @returns {Func}
 */
export function throttle(this: any, func: Func, delay: number): Func {
  let lastTime: number;
  let lastFunc: ReturnType<typeof setTimeout> | undefined;
  const getDiff = () => Date.now() - lastTime;
  return (...args: any[]) => {
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
