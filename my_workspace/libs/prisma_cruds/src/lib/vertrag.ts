import { prismaDb } from '@my-workspace/prisma_hains';
import { whereRotationIn } from './utils/crud_helper';

export async function getVertragsTypsForMitarbeiterinfo() {
  return await prismaDb.vertragstyps.findMany({
    include: {
      vertragsgruppes: {
        include: {
          vertragsstuves: {
            include: {
              vertragsgruppes: true,
              vertrags_variantes: true
            }
          },
          vertragstyps: true
        }
      }
    }
  });
}

export async function getVertragsForTeamVK(date: Date) {
  return await prismaDb.vertrags.findMany({
    where: {
      anfang: { lte: date },
      ende: { gte: date }
    },
    orderBy: [{ ende: 'asc' }],
    include: {
      mitarbeiters: {
        include: {
          funktion: {
            include: {
              teams: true
            }
          },
          einteilung_rotations: {
            where: {
              ...whereRotationIn(date, date)
            },
            include: {
              kontingents: {
                include: {
                  teams: true
                }
              }
            }
          }
        }
      },
      vertrags_arbeitszeits: {
        where: {
          von: { lte: date },
          bis: { gte: date },
          vk: { gt: 0, lte: 1 },
          tage_woche: { gt: 0, lte: 7 }
        }
      },
      vertrags_phases: {
        where: {
          von: { lte: date },
          bis: { gte: date }
        },
        include: {
          vertragsstuves: {
            include: {
              vertragsgruppes: true
            }
          }
        }
      }
    }
  });
}
