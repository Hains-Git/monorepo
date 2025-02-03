import { prismaDb } from './prisma-hains';
import { whereMitarbeiterAktivNoPlatzhalter } from './utils/crud_helper';

type Einteilung = {
  MitarbeiterID: number;
  DienstID: number;
  Tag: Date;
};

type FreigabeTyp = 'qualifiziert' | 'überqualifiziert' | 'nicht qualifiziert';

type Freigabe = {
  Dienst: number;
  Tag: Date;
  Freigabetyp: FreigabeTyp;
};

type Rotationszuweisung = {
  Tag: Date;
  RotationsID: number;
};

type MitarbeiterArbeitszeit = {
  Tag: Date;
  ArbeitszeitInMinuten: number;
};

type Wunsch = {
  Tag: Date;
  Dienste: number[];
};

type Präferenz = {
  Dienst: number;
  Bewertung: number;
};

type DienstTyp = 'Frühdienst' | 'Rufdienst' | 'Nachtdienst' | 'VersetzterDienst' | 'LangerDienst' | 'Frei';

type Dienst = {
  ID: number;
  Name: string;
  Typ: DienstTyp;
  IstRelevantFürDoppelWhopper: boolean;
};

type Kombidienst = {
  ID: number;
  Name: string;
  Dienste: number[];
};

type Rotation = {
  ID: number;
  Name: string;
  Dienste: number[];
};

type BedarfsID = {
  Tag: Date;
  Dienst: number;
};

type Bedarf = {
  ID: BedarfsID;
  Minimum: number;
  OptionalerZusätzlicherBedarf: number;
  IstBereitschaftsdienst: boolean;
  ArbeitszeitInMinuten: number;
  Belastung: number;
  IstWochenendEinteilung: boolean;
};

type Bedarfsblock = {
  Einträge: BedarfsID[];
  AnzahlAusgleichstage: number;
};

type Ausgleichsdienstgruppe = {
  Name: string;
  Einträge: BedarfsID[];
};

type Mitarbeiter = {
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

type PlanData = {
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
};

export type FraunhoferNewPlan = {
  Name: string;
  Beschreibung: string;
  Einteilungen: Einteilung[];
  Parameter: string;
};

const defaultPlanData: PlanData = {
  Mitarbeiter: [],
  Dienste: [],
  Kombidienste: [],
  Rotationen: [],
  Bedarfe: [],
  Bedarfsblöcke: [],
  Ausgleichsdienste: [],
  FixierteEinteilungen: [],
  AuslgeichsfreiDienstID: 0,
  MinPräferenz: 1,
  MaxPräferenz: 5
};

export async function getFraunhoferPlanData(start: Date, end: Date): Promise<PlanData> {
  const result: PlanData = { ...defaultPlanData };

  if (!start.getTime() || !end.getTime() || start > end) {
    return result;
  }

  try {
    const tage: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      tage.push(new Date(d));
    }
    const mitarbeiter = await prismaDb.mitarbeiters.findMany({
      where: {
        ...whereMitarbeiterAktivNoPlatzhalter(start, end)
      },
      include: {
        dienstfreigabes: {
          include: {
            freigabestatuses: true
          }
        },
        einteilung_rotations: true,
        dienstwunsches: {
          include: { dienstkategories: true }
        },
        dienstratings: true
      }
    });

    const dienste = await prismaDb.po_diensts.findMany();
    const kontingente = await prismaDb.kontingents.findMany();
    const dienstkategorien = await prismaDb.dienstkategories.findMany();

    const freigabetypenDienste: {
      [key: number]: {
        [key: number]: number;
      };
    } = {};
    const dienstkategorieDienste: {
      [key: number]: number[];
    } = {};

    dienste.forEach((d) => {
      // Map Dienste to Freigabetypen
      d.freigabetypen_ids.forEach((ft) => {
        freigabetypenDienste[ft] ||= {};
        freigabetypenDienste[ft][d.id] = d.id;
      });
      dienstkategorien.forEach((dk) => {
        // Map Dienste to Dienstkategorien
      });
    });

    // Map Dienste to Rotationen (Kontingente)
    result.Rotationen = kontingente.reduce((acc: Rotation[], k) => {
      dienste.forEach((d) => {
        // Check if Dienst is in Kontingent
      });
      return acc;
    }, []);

    // Create Dienste
    result.Dienste = dienste.map((d) => ({
      ID: d.id,
      Name: d.planname || '',
      Typ: 'Frei', // TODO: Map Diensttyp
      IstRelevantFürDoppelWhopper: false
    }));

    // Create Mitarbeiter
    result.Mitarbeiter = mitarbeiter.map((m) => ({
      ID: m.id,
      Name: m.planname || '',
      Freigaben: m.dienstfreigabes.reduce((acc: Freigabe[], f) => {
        const freigabeTypId = f.freigabetyp_id || 0;
        if (freigabeTypId < 1 || !f.freigabestatuses?.qualifiziert) return acc;
        const typ: FreigabeTyp = f.freigabestatuses.counts_active ? 'qualifiziert' : 'überqualifiziert';
        const ftDienste = freigabetypenDienste[freigabeTypId];
        if (!ftDienste) return acc;
        Object.values(ftDienste).forEach((dId) => {
          tage.forEach((tag) => {
            acc.push({
              Dienst: dId,
              Tag: tag,
              Freigabetyp: typ
            });
          });
        });
        return acc;
      }, []),
      KombidienstAusschlüsse: [],
      Rotationen: m.einteilung_rotations.reduce((acc: Rotationszuweisung[], r) => {
        // Nochmal überprüfen, ob bis inklusive oder exklusive
        const checkStart = (r.von === null || r.von <= start) && (r.bis === null || r.bis >= start);
        const checkEnd = (r.von === null || r.von <= end) && (r.bis === null || r.bis >= end);
        const checkMiddle = (r.von === null || r.von >= start) && (r.bis === null || r.bis <= end);
        const kontingentId = r.kontingent_id || 0;
        if ((!checkStart && !checkEnd && !checkMiddle) || kontingentId < 1) return acc;
        tage.forEach((tag) => {
          const check = (r.von === null || r.von <= tag) && (r.bis === null || r.bis >= tag);
          if (!check) return;
          acc.push({
            Tag: tag,
            RotationsID: kontingentId
          });
        });
        return acc;
      }, []),
      Arbeitszeit: [],
      Wünsche: [],
      'K-Wünsche': [],
      Präferenzen: [],
      MaximaleAzahlBereitschaftsdienste: 0
    }));
  } catch (error) {
    console.error('Error in getFraunhoferPlanData:', error);
    return { ...defaultPlanData };
  }

  return result;
}

export async function createFraunhoferPlan(body: FraunhoferNewPlan): Promise<{
  msg: string;
  updated: boolean;
}> {
  const result = {
    msg: 'Plan konnte nicht erstellt werden!',
    updated: false
  };
  try {
  } catch (error) {
    console.error('Error in createFraunhoferPlan:', error);
    result.msg = 'Fehler beim Erstellen des Plans!';
    result.updated = false;
  }

  return result;
}
