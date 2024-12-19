export type History = {
  Arbeitsplatz: string;
  Dienst: string;
  PepDienst: string;
  Bereich: string;
  Kontext: string;
  Kontextkommentar: string;
  Status: string;
  Kommentar: string;
  Bearbeitet: string;
  Nutzer: string;
};

export type Funktion = {
  id: number;
  name: string;
  prio: number;
};

export type Team = {
  id: number;
  name: string;
};

export type PlanerDate = {
  id: string;
  is_weekend: boolean;
  feiertag: string | { name: string };
  label: string;
  year: number;
};
