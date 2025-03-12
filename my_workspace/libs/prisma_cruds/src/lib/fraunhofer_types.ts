export type TDienstTyp =
  | 'Frühdienst'
  | 'Rufdienst'
  | 'Nachtdienst'
  | 'VersetzterDienst'
  | 'LangerDienst'
  | 'OnTopFD'
  | 'Frei';

export type TEinteilung = {
  MitarbeiterID: number;
  DienstID: number;
  BereichID: number | null;
  Tag: Date;
  IstRelevantFürDoppelWhopper?: boolean;
  Typ?: TDienstTyp;
};

export type TFreigabeTyp = 'qualifiziert' | 'überqualifiziert' | 'nicht qualifiziert';

export type TFreigabe = {
  Dienst: number;
  Tag: Date;
  Freigabetyp: TFreigabeTyp;
};

export type TRotationszuweisung = {
  Tag: Date;
  RotationsID: number;
};

export type TMitarbeiterArbeitszeit = {
  Tag: Date;
  ArbeitszeitInMinuten: number;
};

export type TWunsch = {
  Tag: Date;
  Dienste: number[];
};

export type TPräferenz = {
  Dienst: number;
  Bewertung: number;
};

export type TDienst = {
  ID: number;
  Name: string;
  Typ: TDienstTyp;
  IstRelevantFürDoppelWhopper: boolean;
};

export type TKombibedarf = {
  ID: number;
  Name: string;
  Bedarfe: TBedarfsID[];
};

export type TRotation = {
  ID: number;
  Name: string;
  Dienste: number[];
};

export type TBedarfsID = {
  Tag: Date;
  Dienst: number;
  Bereich: number;
};

export type TBedarf = {
  ID: TBedarfsID;
  Minimum: number;
  OptionalerZusätzlicherBedarf: number;
  IstBereitschaftsdienst: boolean;
  ArbeitszeitInMinuten: number;
  Belastung: number;
  IstWochenendEinteilung: boolean;
  SollAutomatischGeplantWerden: boolean;
};

export type TBedarfsblock = {
  Einträge: TBedarfsID[];
  AnzahlAusgleichstage: number;
};

export type TAusgleichsdienstgruppe = {
  Name: string;
  Einträge: TBedarfsID[];
};

export type TMitarbeiter = {
  ID: number;
  Name: string;
  Freigaben: TFreigabe[];
  KombibedarfAusschlüsse: number[];
  Rotationen: TRotationszuweisung[];
  Arbeitszeit: TMitarbeiterArbeitszeit[];
  Wünsche: TWunsch[];
  'K-Wünsche': Date[];
  Präferenzen: TPräferenz[];
  MaximaleAnzahlBereitschaftsdienste: number;
};

export type TPlanData = {
  Mitarbeiter: TMitarbeiter[];
  Dienste: TDienst[];
  Kombibedarfe: TKombibedarf[];
  Rotationen: TRotation[];
  Bedarfe: TBedarf[];
  Bedarfsblöcke: TBedarfsblock[];
  Ausgleichsdienste: TAusgleichsdienstgruppe[];
  FixierteEinteilungen: TEinteilung[];
  AuslgeichsfreiDienstID: number;
  MinPräferenz: number;
  MaxPräferenz: number;
  msg: string;
};

export type TFraunhoferNewPlan = {
  Name: string;
  Beschreibung: string;
  Einteilungen: TEinteilung[];
  Parameter: string;
  client_id: string;
  client_secret: string;
};

export type TDienstTypenThemen = Record<TDienstTyp, number[]>;

export type TDienstkategorieDienste = Record<number, number[]>;

export type TFreigabetypenDienste = Record<number, Record<number, number>>;

export type TDienstplan = {
  ID: number;
  Name: string;
  Beschreibung: string;
  Anfang: Date | null;
  Ende: Date | null;
};
