import { useEffect, useState } from 'react';
import { caretDown, caretUp } from '../tools/htmlentities';
import { development } from '../tools/flags';

/**
 * Stellt grundlegende Funktionen für ein Dropdown zur Verfügung.
 * Dazu wird ein State erstellt, der angibt, ob das Dropdown angezeigt oder versteckt werden soll.
 * Es gibt ein Caret, welches je nach Zustand nach oben bzw. unten zeigt.
 * Und es gibt eine Funktion, mit getoggled wird.
 * @param {Boolean} start Anfangszustand (anzeigen/verstecken)
 * @param {Boolean} useClose schließen der Dropdowns bei Klick
 * @returns caret, show, handleClick, closeDropDown, setShow, setCaret
 */
export const UseDropdown = (start = false, useClose = true) => {
  const [show, setShow] = useState(start);
  const [caret, setCaret] = useState(start ? caretUp : caretDown);

  // Toggled Verstecken/Anzeigen und Caret
  const handleClick = (evt) => {
    if (evt) evt.stopPropagation();
    const now = !show;
    setShow(() => now);
    setCaret(() => (now ? caretUp : caretDown));

    const pLabel = evt?.target?.closest('p.popup-more-infos-label');
    if (!pLabel) return now;

    if (pLabel.classList.contains('active')) {
      pLabel.classList.remove('active');
    } else {
      pLabel.classList.add('active');
    }
    return now;
  };

  // Setzt den Zustand auf verstecken
  const closeDropDown = () => {
    setShow(() => false);
    setCaret(() => caretDown);
  };

  // Event-Litener, damit bei Klick das Dropdown versteckt wird
  useEffect(() => {
    setShow(() => start);
    if (useClose) {
      document.addEventListener('click', closeDropDown);
      return () => {
        document.removeEventListener('click', closeDropDown);
      };
    }
  }, [start, useClose]);

  return {
    caret,
    show,
    handleClick,
    closeDropDown,
    setShow,
    setCaret
  };
};
