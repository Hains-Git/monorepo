import { prismaDb } from '@my-workspace/prisma_hains';
import {
  bedarfsEintragsIncludeMainInfosNoBlock,
  getFraunhoferMitarbeiter,
  whereDienstplanIn
} from './utils/crud_helper';
import { Prisma } from '@prisma/client';
import { newDate } from '@my-workspace/utils';

export async function getFraunhoferDienstplan(
  monthStart: Date,
  monthEnd: Date,
  start: Date,
  end: Date,
  dienstplanId?: number
) {
  return await prismaDb.dienstplans.findFirst({
    where: {
      ...whereDienstplanIn(monthStart, monthEnd),
      ...(dienstplanId ? { id: dienstplanId } : {}),
      dienstplanbedarves: {
        isNot: null
      }
    },
    include: {
      dienstplanbedarves: {
        include: {
          bedarfs_eintrags: {
            where: {
              tag: { gte: start, lte: end }
            },
            include: {
              first_bedarf: {
                include: {
                  block_bedarfe: {
                    include: {
                      ...bedarfsEintragsIncludeMainInfosNoBlock
                    }
                  }
                }
              },
              ...bedarfsEintragsIncludeMainInfosNoBlock
            }
          }
        }
      }
    },
    orderBy: [
      {
        anfang: 'asc'
      },
      {
        ende: 'desc'
      }
    ]
  });
}

export async function getFixedEinteilungen(
  start: Date,
  end: Date,
  bedarfeTageOutSideInterval: Record<string, number[]>,
  dienstplanId?: number
) {
  const fixedEinteilungen = await prismaDb.diensteinteilungs.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              tag: {
                gte: start,
                lte: end
              }
            },
            ...Object.entries(bedarfeTageOutSideInterval).map(([tag, dienste]) => ({
              tag: newDate(tag),
              po_dienst_id: {
                in: dienste
              }
            }))
          ]
        },
        dienstplanId
          ? {
              OR: [
                {
                  einteilungsstatuses: {
                    counts: true
                  }
                },
                {
                  dienstplan_id: dienstplanId,
                  einteilungsstatuses: { vorschlag: true }
                }
              ]
            }
          : {
              einteilungsstatuses: {
                counts: true
              }
            }
      ]
    }
  });
  return fixedEinteilungen;
}

export async function isValidFraunhoferRequest(clientId: string, clientSecret: string) {
  const isValid = await prismaDb.oauth_applications.findFirst({
    where: {
      name: 'Fraunhofer',
      uid: clientId,
      secret: clientSecret
    }
  });
  return !!isValid;
}

export async function getRelevantTeams() {
  return await prismaDb.teams.findMany({
    where: {
      name: { in: ['OP Team'] }
    }
  });
}

export async function getFraunhoferData(start: Date, end: Date) {
  const relevantTeams = await getRelevantTeams();
  const relevantTeamIds = relevantTeams.map((t) => t.id);
  const mitarbeiter = await prismaDb.mitarbeiters.findMany(getFraunhoferMitarbeiter(start, end, relevantTeamIds));
  const dienste = await prismaDb.po_diensts.findMany();

  const kontingente = await prismaDb.kontingents.findMany();
  const dienstkategorien = await prismaDb.dienstkategories.findMany({
    include: {
      dienstkategoriethemas: true
    }
  });
  const themen = await prismaDb.themas.findMany();

  return {
    mitarbeiter,
    dienste,
    kontingente,
    dienstkategorien,
    themen,
    relevantTeamIds
  };
}

export async function getAusgleichsDienstfreiId() {
  return (
    (
      await prismaDb.po_diensts.findFirst({
        select: { id: true },
        where: { name: 'Ausgleichsfrei' }
      })
    )?.id || 0
  );
}

export async function getDienstplanstatusVorschlagId() {
  return (
    (
      await prismaDb.dienstplanstatuses.findFirst({
        select: { id: true },
        where: { name: 'Vorschlag' }
      })
    )?.id || 0
  );
}

export async function getEinteilungsstatusVorschlagId() {
  return (
    (
      await prismaDb.einteilungsstatuses.findFirst({
        select: { id: true },
        where: { name: 'Vorschlag', public: false, counts: false }
      })
    )?.id || 0
  );
}

export async function getEinteilungskontextAutoId() {
  return (
    (
      await prismaDb.einteilungskontexts.findFirst({
        select: { id: true },
        where: {
          name: 'Auto'
        }
      })
    )?.id || 0
  );
}

export async function getParametersetId() {
  return (await prismaDb.parametersets.findFirst({ select: { id: true } }))?.id || 0;
}

export async function getMitarbeiterHash() {
  return (await prismaDb.mitarbeiters.findMany({ select: { id: true } })).reduce((acc: Record<number, boolean>, m) => {
    acc[m.id] = true;
    return acc;
  }, {});
}

export async function getDiensteHash() {
  const relevantTeamIds = (await getRelevantTeams()).map((t) => t.id);

  return (
    await prismaDb.po_diensts.findMany({
      select: { id: true },
      where: {
        team_id: { in: relevantTeamIds }
      }
    })
  ).reduce((acc: Record<number, boolean>, d) => {
    acc[d.id] = true;
    return acc;
  }, {});
}

export async function getBereicheHash() {
  return (
    await prismaDb.bereiches.findMany({
      select: { id: true }
    })
  ).reduce((acc: Record<number, boolean>, b) => {
    acc[b.id] = true;
    return acc;
  }, {});
}

export async function getDienstplanbedarfId(start: Date, end: Date) {
  return (
    (
      await prismaDb.dienstplanbedarves.findFirst({
        select: { id: true },
        where: {
          anfang: { lte: start },
          ende: { gte: end }
        }
      })
    )?.id || 0
  );
}

export async function createDienstplan(args: Prisma.dienstplansCreateArgs) {
  return await prismaDb.dienstplans.create(args);
}

export async function createManyDiensteinteilungs(args: Prisma.diensteinteilungsCreateManyArgs) {
  return prismaDb.diensteinteilungs.createMany(args);
}

export async function getDienstplaene() {
  return await prismaDb.dienstplans.findMany({
    orderBy: [{ anfang: 'asc' }, { ende: 'desc' }]
  });
}
