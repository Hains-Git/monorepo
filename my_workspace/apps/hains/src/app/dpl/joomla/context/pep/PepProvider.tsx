import React from 'react';
import { History } from '../../pep_einsatzplan/types';

type PepContextType = {
  showKontextColors: boolean;
  showPepName: boolean;
  setHistory: React.Dispatch<React.SetStateAction<History[]>>;
  setHistoryLabel: React.Dispatch<React.SetStateAction<string>>;
};

export const PepContext = React.createContext<PepContextType>({
  showKontextColors: false,
  showPepName: true,
  setHistory: () => {},
  setHistoryLabel: () => {}
});

export function PepProvider({
  children,
  showKontextColors,
  showPepName,
  setHistory,
  setHistoryLabel
}: PepContextType & {
  children: React.ReactNode;
}) {
  const value = React.useMemo(
    () => ({ showKontextColors, showPepName, setHistory, setHistoryLabel }),
    [showKontextColors, showPepName, setHistory, setHistoryLabel]
  );
  return <PepContext.Provider value={value}>{children}</PepContext.Provider>;
}
