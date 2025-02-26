import { mitarbeiters } from '@prisma/client';
import { _mitarbeiter } from '@my-workspace/prisma_cruds';

type TParams = {
  mitarbeiter_id: number;
  funktionen?: string;
  mitarbeiter?: string;
};

export async function searchOverview(curMitarbeiter: mitarbeiters, params: TParams) {
  const result = {};
  let mitarbeiterId = params?.mitarbeiter_id;
  const funktionen = params?.funktionen;
  const paramsMitarbeiterPlanname = params?.mitarbeiter;
  let mitarbeiter: mitarbeiters[] | null = null;
  if (mitarbeiterId) {
    if (Number(mitarbeiterId) === 0 && curMitarbeiter) {
      mitarbeiterId = curMitarbeiter?.id;
    }
    const mit = await _mitarbeiter.getMitarbeiterById(mitarbeiterId);
    mitarbeiter = mit ? [mit] : null;
  } else if (!params?.mitarbeiter) {
    mitarbeiter = await _mitarbeiter.getMitarbeitersByCustomQuery({
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
    mitarbeiter = await _mitarbeiter.getMitarbeitersByCustomQuery({
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

  if (mitarbeiter) {
  } else {
    return [];
  }

  return result;
}
