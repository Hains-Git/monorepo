import { abwesentheitenueberblick_counters, diensteinteilungs } from '@prisma/client';

import { getEinteilungenOhneBedarf } from '@my-workspace/prisma_cruds';
import { PlanerDate } from '@my-workspace/models';
import { formatDate, getISOWeek, isMonday } from 'date-fns';

type TParams = {
  von: Date;
  bis: Date;
  poDienstIds: number[];
};

async function getEinteilungenOhneBedarfByPoDienst({ von, bis, poDienstIds }: TParams) {
  return await getEinteilungenOhneBedarf({ von, bis, poDienstIds, counts: true, isPublic: true });
}

function createCounterByMitarbeiter(poDienstId: number, einteilungen: diensteinteilungs[]) {
  const counterByMitarbeiter = {};
  let pdCount = 0;
  einteilungen.forEach((einteilung) => {
    const mId = einteilung.mitarbeiter_id;
    const pId = einteilung.po_dienst_id;
    if (!counterByMitarbeiter[mId]) {
      counterByMitarbeiter[mId] = {};
      if (!counterByMitarbeiter[mId][poDienstId]) {
        pdCount = 1;
        counterByMitarbeiter[mId][poDienstId] = pdCount;
      }
    } else {
      if (!counterByMitarbeiter[mId][poDienstId]) {
        counterByMitarbeiter[mId][poDienstId] = pdCount;
      } else {
        pdCount += 1;
      }
      counterByMitarbeiter[mId][poDienstId] = pdCount;
    }
  });
  return counterByMitarbeiter;
}

async function processCounter(counter: abwesentheitenueberblick_counters) {
  const von = counter.von;
  const bis = counter.bis;
  const poDienstId = counter.po_dienst_id;
  const de = await getEinteilungenOhneBedarfByPoDienst({ von, bis, poDienstIds: [poDienstId] });
  const counterMitarbeiter = createCounterByMitarbeiter(poDienstId, de as diensteinteilungs[]);
  return counterMitarbeiter;
}

export async function addCountsValue(counters: abwesentheitenueberblick_counters[]) {
  const data = await counters.reduce(async (acc, counter) => {
    const accumulator = await acc; // Await the previous iteration's result
    const id = counter.id;
    if (!accumulator[id]) {
      accumulator[id] = {};
    }
    accumulator[id] = await processCounter(counter);
    return accumulator;
  }, Promise.resolve({})); // Start with a resolved Promise containing an empty object
  return data;
}

type TParams1 = {
  day: Date;
  dates: object;
};

export function createDates({ day, dates }: TParams1) {
  let weekCounter = getISOWeek(day) + 1;

  if (isMonday(day)) {
    weekCounter = getISOWeek(day);
  }
  const formatedDay = formatDate(day, 'yyyy-MM-dd');
  dates[formatedDay] = new PlanerDate(day, weekCounter);
  return dates;
}
