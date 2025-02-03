import { prismaDb } from '../prisma-hains';

export async function getAllAccountInfos() {
  return await prismaDb.account_infos.findMany({
    where: {
      mitarbeiter: {
        platzhalter: false
      }
    }
  });
}

export async function getAccountInfoForMitarbeiterInfo() {
  return await prismaDb.account_infos.findMany({
    where: {
      mitarbeiter: {
        platzhalter: false
      }
    },
    include: {
      user: {
        select: {
          email: true,
          admin: true,
          login: true,
          id: true,
          user_gruppes: true
        }
      },
      mitarbeiter: {
        select: {
          aktiv: true,
          a_seit: true,
          anrechenbare_zeit: true,
          funktion_id: true,
          personalnummer: true,
          planname: true,
          name: true,
          zeit_kommentar: true,
          funktion: true,
          dateis: {
            select: {
              datei_typ_id: true,
              id: true,
              datei_typ: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });
}
