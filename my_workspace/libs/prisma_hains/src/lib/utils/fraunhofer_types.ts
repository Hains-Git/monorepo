export type Einteilung = {
  MitarbeiterID: number;
  DienstID: number;
  Tag: Date;
};

export type FreigabeTyp = 'qualifiziert' | 'überqualifiziert' | 'nicht qualifiziert';

export type Freigabe = {
  Dienst: number;
  Tag: Date;
  Freigabetyp: FreigabeTyp;
};

export type Rotationszuweisung = {
  Tag: Date;
  RotationsID: number;
};

export type MitarbeiterArbeitszeit = {
  Tag: Date;
  ArbeitszeitInMinuten: number;
};

export type Wunsch = {
  Tag: Date;
  Dienste: number[];
};

export type Präferenz = {
  Dienst: number;
  Bewertung: number;
};

export type DienstTyp = 'Frühdienst' | 'Rufdienst' | 'Nachtdienst' | 'VersetzterDienst' | 'LangerDienst' | 'Frei';

export type Dienst = {
  ID: number;
  Name: string;
  Typ: DienstTyp;
  IstRelevantFürDoppelWhopper: boolean;
};

export type Kombidienst = {
  ID: number;
  Name: string;
  Dienste: number[];
};

export type Rotation = {
  ID: number;
  Name: string;
  Dienste: number[];
};

export type BedarfsID = {
  Tag: Date;
  Dienst: number;
  Bereich: number;
};

export type Bedarf = {
  ID: BedarfsID;
  Minimum: number;
  OptionalerZusätzlicherBedarf: number;
  IstBereitschaftsdienst: boolean;
  ArbeitszeitInMinuten: number;
  Belastung: number;
  IstWochenendEinteilung: boolean;
};

export type Bedarfsblock = {
  Einträge: BedarfsID[];
  AnzahlAusgleichstage: number;
};

export type Ausgleichsdienstgruppe = {
  Name: string;
  Einträge: BedarfsID[];
};

export type Mitarbeiter = {
  ID: number;
  Name: string;
  Freigaben: Freigabe[];
  KombidienstAusschlüsse: number[];
  Rotationen: Rotationszuweisung[];
  Arbeitszeit: MitarbeiterArbeitszeit[];
  Wünsche: Wunsch[];
  'K-Wünsche': Date[];
  Präferenzen: Präferenz[];
  MaximaleAzahlBereitschaftsdienste: number;
};

export type PlanData = {
  Mitarbeiter: Mitarbeiter[];
  Dienste: Dienst[];
  Kombidienste: Kombidienst[];
  Rotationen: Rotation[];
  Bedarfe: Bedarf[];
  Bedarfsblöcke: Bedarfsblock[];
  Ausgleichsdienste: Ausgleichsdienstgruppe[];
  FixierteEinteilungen: Einteilung[];
  AuslgeichsfreiDienstID: number;
  MinPräferenz: number;
  MaxPräferenz: number;
  msg: string;
};

export type FraunhoferNewPlan = {
  Name: string;
  Beschreibung: string;
  Einteilungen: Einteilung[];
  Parameter: string;
};

export type DienstTypenThemen = Record<DienstTyp, number[]>;

export type DienstkategorieDienste = Record<number, number[]>;

export type FreigabetypenDienste = Record<number, Record<number, number>>;
