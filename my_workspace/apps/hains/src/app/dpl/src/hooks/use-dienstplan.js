import { useEffect, useState } from "react";
import { UseRegister } from "./use-register";

/**
 * Hiermit wird der Dienstplan initialisiert.
 * Es werden Funktionen zur Navigation mit dem Keyboard durch die Dienstplan-Tabelle zur Verfügung
 * gestellt. Zusätzlich wird die Möglichkeit zur Auswahl einer Vorlage und einer Ansicht erstellt.
 * @param {Object} dienstplan
 * @param {Object} user
 * @returns options, itemHandler, ansichtHandler
 */
export const UseDienstplan = (dienstplan, user) => {
  const [options, setOptions] = useState(false);
  UseRegister(dienstplan?._push, dienstplan?._pull, dienstplan);

  // Ermöglicht Benutzung des Keyboards zur Navigation in der Tabelle
  const handleKeyPress = (evt) => {
    dienstplan?.handleKeyDown?.(evt);
  };

  /**
   * Initialisiert die Vorlagen und die Event-Listener
   */
  useEffect(() => {
    if (user && dienstplan?.vorlagen) {
      setOptions(() => dienstplan.vorlagen || []);
      document.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      setOptions(() => []);
    };
  }, [user, dienstplan]);

  // Auswahl der Vorlagen
  const itemHandler = (item) => {
    if(!item) return;
    dienstplan?.setVorlage?.(item, true);
  };

  // Auswahl der Ansichten
  const ansichtHandler = (item) => {
    item?.fkt?.();
  };

  return [
    options,
    itemHandler,
    ansichtHandler
  ];
};
