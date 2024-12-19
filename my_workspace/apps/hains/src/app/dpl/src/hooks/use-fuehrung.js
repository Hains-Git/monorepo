import { useEffect, useState } from "react";
import { UseRegister } from "./use-register";

/**
 * Hook für die Führung durch die Dienstplan-Tabelle.
 * @param {Object} table
 * @returns checked, showLoader, handleFuehrung, handleNext, handlePrev, handleAutoScroll
 */
export const UseFuehrung = (table) => {
  const [checked, setChecked] = useState(table.sollFuehren);
  const update = UseRegister(table.push, table.pull, table);
  const [showLoader, setShowLoader] = useState(false);

  // Aktiviert die Führung durch die Tabelle und ermittelt das nächste Feld
  const fuehren = (checkedFuehren, pos) => {
    setShowLoader(() => checkedFuehren);
    table.debouncedFuehren(checkedFuehren, pos);
  };

  // Spinner, der das Laden anzeigt verstecken
  useEffect(() => {
    setChecked(() => table.sollFuehren);
    setShowLoader(() => false);
  }, [update]);

  // Click-Handler, um die Führung an und auszuschalten
  const handleFuehrung = (evt) => {
    const checkedFuehren = evt.target.checked;
    fuehren(checkedFuehren, 0);
    setChecked(() => checkedFuehren);
  };

  // Nächstes Feld suchen
  const handleNext = (evt, setLoading) => {
    fuehren(checked, table.fuehrungPos + 1);
    setLoading?.(() => false);
  };

  // Vorhergehendes Feld suchen
  const handlePrev = (evt, setLoading) => {
    fuehren(checked, table.fuehrungPos - 1);
    setLoading?.(() => false);
  };

  // Automatisches Scrollen aktivieren
  const handleAutoScroll = (evt) => {
    table.setAutoScroll(evt.target.checked, true);
  };

  return [
    checked,
    showLoader,
    handleFuehrung,
    handleNext,
    handlePrev,
    handleAutoScroll
  ];
};
