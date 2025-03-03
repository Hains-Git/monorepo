import { funktions, geraetepasses, geraets, mitarbeiters } from '@prisma/client';
import { _account_info, _geraet, _mitarbeiter } from '@my-workspace/prisma_cruds';

import { _geraete_pass } from '@my-workspace/prisma_cruds';

type TParams = {
  mitarbeiter_id: number;
  funktionen?: string;
  mitarbeiter?: string;
};

export async function searchOverview(curMitarbeiter: mitarbeiters, params: TParams) {
  let mitarbeiterId = Number(params.mitarbeiter_id);
  const funktionen = params?.funktionen;
  const paramsMitarbeiterPlanname = params?.mitarbeiter;
  let mitarbeiter: (mitarbeiters & { fuktion?: funktions | null })[] = [];
  let geraete: geraets[] = [];
  let geraetePaesse: geraetepasses[] = [];

  if (mitarbeiterId) {
    if (Number(mitarbeiterId) === 0 && curMitarbeiter) {
      mitarbeiterId = curMitarbeiter?.id;
    }
    mitarbeiter = await _mitarbeiter.findMany(
      {
        where: {
          id: mitarbeiterId
        }
      },
      { funktion: true }
    );
  } else if (!params?.mitarbeiter) {
    mitarbeiter = await _mitarbeiter.findMany({
      where: {
        aktiv: true,
        platzhalter: false,
        funktion_id: {
          in: funktionen?.split(',').map(Number)
        }
      },
      orderBy: {
        planname: 'asc'
      },
      take: 30
    });
  } else {
    mitarbeiter = await _mitarbeiter.findMany({
      where: {
        planname: {
          contains: paramsMitarbeiterPlanname,
          mode: 'insensitive'
        },
        platzhalter: false,
        funktion_id: {
          in: funktionen?.split(',').map(Number)
        }
      },
      orderBy: {
        planname: 'asc'
      },
      take: 30
    });
  }

  if (mitarbeiter && mitarbeiter.length > 0) {
    mitarbeiter = mitarbeiter.slice(0, 30);
    const mitarbeiterIds = mitarbeiter.map((mit) => mit.id);
    geraetePaesse = await _geraete_pass.findMany({
      where: {
        mitarbeiter_id: {
          in: mitarbeiterIds
        }
      },
      orderBy: [{ updated_at: 'asc' }, { herstellereinweisung: 'asc' }]
    });
    if (mitarbeiter.length == 1 && mitarbeiterId) {
      geraete = await _geraet.findMany({
        where: {
          in_use: true
        },
        orderBy: [{ name: 'asc' }, { typ: 'asc' }, { hersteller: 'asc' }]
      });
      geraete = geraete.map((geraet) => {
        const pass = geraetePaesse.find((p) => p.geraet_id === geraet.id);

        let tableSortValue = 3;
        let tableColorValue = '#f44336';
        let tableTitleValue = 'Nicht eingewiesen';

        if (pass) {
          tableSortValue = 1;
          tableColorValue = '#8bc34a';
          tableTitleValue = 'Eingewiesen';

          if (pass.herstellereinweisung) {
            tableSortValue = 2;
            tableColorValue = '#5298e2';
            tableTitleValue = 'Herstellereinweisung';
          }
        }

        return {
          ...geraet,
          has_pass: !!pass,
          herstellereinweisung: pass?.herstellereinweisung ?? false,
          table_sort: tableSortValue,
          table_color: tableColorValue,
          table_title: tableTitleValue
        };
      });
    }
  }
  return {
    mitarbeiter,
    geraetePaesse,
    geraete
  };
}
