import { useEffect, useState } from "react";
import { UseMounted } from "./use-mounted";

/**
 * Stellt die Verbindung der Komponente zum Modell her, sodass die Komponente aus den Modells
 * heraus zum rendern angestoßen werden kann.
 * Dazu wird ein State erstellt und die SetState-Funktion
 * in einem Array in dem Modell untergebracht.
 * @param {Function} push
 * @param {Function} pull
 * @param {Object} parent
 * @param {Function} bedingung
 * @returns update-State
 */
export const UseRegister = (push = false, pull = false, parent = false, bedingung = true) => {
  const [update, setUpdate] = useState({});
  const mounted = UseMounted();
  const set = (value) => mounted && setUpdate(() => value);

  useEffect(() => {
    if (bedingung) {
      if (push && pull) push(set);

      return () => {
        if (pull) pull(set);
      };
    }
  }, [parent, bedingung]);

  return update;
};

/**
 * Stellt die Verbindung der Komponente zum Modell her, sodass die Komponente aus den Modells
 * heraus zum rendern angestoßen werden kann.
 * Dazu wird ein State erstellt und die SetState-Funktion
 * in einem Array in dem Modell untergebracht.
 * Hierbei kann jedoch ein Key übergeben werden, sodass sich
 * die Komponente unter einem bestimmten Namen registriert.
 * Das Register ist ein Objekt. Seine Attribute sind Array,
 * in die die setState-Funktionen gepushed werden.
 * {update: [setUpdate1, setUpdate2, ....]}
 * @param {String} key
 * @param {Function} push
 * @param {Function} pull
 * @param {Object} parent entspricht dem Modell, bei dem sich registriert wird
 * @param {Function} bedingung
 * @returns update-State
 */
export const UseRegisterKey = (key = "update", push = false, pull = false, parent = false, bedingung = true) => {
  const [update, setUpdate] = useState({});
  const mounted = UseMounted();
  const set = (value) => mounted && setUpdate(() => value);

  // Registriert die Komponente bei dem Modell (Parent)
  useEffect(() => {
    if (bedingung && key) {
      if (push && pull) push(key, set);
      return () => {
        if (pull) pull(key, set);
      };
    }
  }, [parent, bedingung, key]);

  return update;
};
