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
          user_gruppes: {
            select: {
              gruppes: true
            }
          }
        }
      },
      mitarbeiter: {
        select: {
          id: true,
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
          },
          vertrags: {
            select: {
              id: true,
              anfang: true,
              ende: true,
              mitarbeiter_id: true,
              vertragstyp_id: true,
              kommentar: true,
              unbefristet: true,
              vertrags_phases: {
                select: {
                  id: true,
                  von: true,
                  bis: true,
                  vertrag_id: true,
                  vertragsstufe_id: true,
                  vertragsstuves: {
                    select: {
                      vertragsgruppes: true
                    }
                  }
                }
              },
              vertrags_arbeitszeits: true
            }
          }
        }
      }
    }
  });
}
