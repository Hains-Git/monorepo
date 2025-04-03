import { _einteilung_rotation } from '@my-workspace/prisma_cruds';
import { newDate } from '@my-workspace/utils';

export async function rotationAm(date = newDate(), mitarbeiterId: number) {
  const rotationen = await _einteilung_rotation.einteilungRotationByTag(date, mitarbeiterId);
  return rotationen;
}

export async function rotationIn(anfang: Date, ende: Date) {
  const rotationen = await _einteilung_rotation.findMany({
    where: {
      OR: [
        {
          von: {
            lte: anfang // Matches "anfang >= von"
          },
          bis: {
            gte: anfang // Matches "anfang <= bis"
          }
        },
        {
          von: {
            lte: ende // Matches "ende >= von"
          },
          bis: {
            gte: ende // Matches "ende <= bis"
          }
        },
        {
          von: {
            gte: anfang // Matches "anfang <= von"
          },
          bis: {
            lte: ende // Matches "ende >= bis"
          }
        }
      ],
      mitarbeiters: {
        platzhalter: false
      }
    },
    orderBy: {
      mitarbeiter_id: 'asc'
    }
  });
  return rotationen;
}
