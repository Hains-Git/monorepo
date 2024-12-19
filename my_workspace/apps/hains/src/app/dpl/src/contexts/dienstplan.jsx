import React, { useMemo } from 'react';
import { UseRegister } from '../hooks/use-register';

export const DienstplanContext = React.createContext({});

export function DienstplanProvider({ children, dienstplan, user }) {
  const table = dienstplan?.table;
  const auswahl = table?.auswahl;
  const currentFeld = table?.auswahl?.feld;
  const updateDpl = UseRegister(
    dienstplan?._push,
    dienstplan?._pull,
    dienstplan
  );
  const updateTable = UseRegister(table?._push, table?._pull, table);
  const updateAuswahl = UseRegister(auswahl?._push, auswahl?._pull, auswahl);

  const value = useMemo(
    () => ({
      dienstplan,
      table,
      currentFeld,
      user
    }),
    [
      dienstplan,
      table,
      currentFeld,
      user,
      updateDpl,
      updateTable,
      updateAuswahl
    ]
  );

  return (
    <DienstplanContext.Provider value={value}>
      {children}
    </DienstplanContext.Provider>
  );
}
