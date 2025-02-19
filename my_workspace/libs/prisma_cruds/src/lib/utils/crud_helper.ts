import {
  mitarbeiters,
  vertrags,
  vertrags_arbeitszeits,
  vertrags_phases,
  vertrags_variantes,
  vertragsstuves
} from '@prisma/client';

export const getZeitraumkategorienInterval = (anfang: Date, ende: Date) => ({
  OR: [
    {
      AND: [{ anfang: null }, { ende: null }]
    },
    {
      OR: [
        {
          AND: [{ anfang: { gte: anfang } }, { anfang: { lt: ende } }]
        },
        {
          AND: [{ ende: { gte: anfang } }, { ende: { lt: ende } }]
        },
        {
          AND: [{ anfang: { lte: anfang } }, { ende: { gte: ende } }]
        },
        {
          AND: [{ anfang: { lte: ende } }, { ende: null }]
        },
        {
          AND: [{ anfang: null }, { ende: { gte: anfang } }]
        }
      ]
    }
  ]
});

export const whereMitarbeiterAktivNoPlatzhalter = (start: Date, end: Date) => ({
  aktiv: true,
  platzhalter: false,
  account_info: {
    isNot: null
  },
  vertrags: {
    some: {
      OR: [
        { anfang: { lte: start }, ende: { gte: start } },
        { anfang: { lte: end }, ende: { gte: end } },
        { anfang: { gte: start }, ende: { lte: end } }
      ],
      vertrags_phases: {
        some: {
          OR: [
            { von: { lte: start }, bis: { gte: start } },
            { von: { lte: end }, bis: { gte: end } },
            { von: { gte: start }, bis: { lte: end } }
          ]
        }
      },
      vertrags_arbeitszeits: {
        some: {
          OR: [
            { von: { lte: start }, bis: { gte: start } },
            { von: { lte: end }, bis: { gte: end } },
            { von: { gte: start }, bis: { lte: end } }
          ],
          vk: { gt: 0, lte: 1 },
          tage_woche: { gt: 0, lte: 7 }
        }
      }
    }
  }
});

export const whereRotationIn = (start: Date, end: Date) => ({
  OR: [
    { von: { lte: start }, bis: { gte: start } },
    { von: { lte: end }, bis: { gte: end } },
    { von: { gte: start }, bis: { lte: end } }
  ]
});

export const wherePlanBedarfIn = (start: Date, end: Date) => ({
  OR: [
    { anfang: { lte: start }, ende: { gte: start } },
    { anfang: { lte: end }, ende: { gte: end } },
    { anfang: { gte: start }, ende: { lte: end } }
  ]
});

export const getFraunhoferMitarbeiter = (start: Date, end: Date, teamIds: number[]) => ({
  where: {
    ...whereMitarbeiterAktivNoPlatzhalter(start, end),
    OR: [
      {
        einteilung_rotations: {
          some: {
            ...whereRotationIn(start, end),
            kontingents: {
              team_id: { in: teamIds }
            }
          }
        }
      },
      {
        einteilung_rotations: {
          none: { ...whereRotationIn(start, end) }
        },
        funktions: {
          is: {
            team_id: { in: teamIds }
          }
        }
      }
    ]
  },
  include: {
    dienstfreigabes: {
      include: {
        freigabestatuses: true
      }
    },
    einteilung_rotations: {
      where: {
        ...whereRotationIn(start, end)
      }
    },
    dienstwunsches: {
      include: {
        dienstkategories: {
          where: {
            poppix_name: {
              not: '0'
            }
          }
        }
      }
    },
    dienstratings: {
      include: {
        po_diensts: {
          where: {
            team_id: { in: teamIds }
          }
        }
      }
    },
    vertrags: {
      include: {
        vertrags_phases: {
          include: {
            vertragsstuves: {
              include: {
                vertrags_variantes: true
              }
            }
          }
        },
        vertrags_arbeitszeits: true
      }
    }
  }
});

export const getVertragArbeitszeitInMinutenAm = (
  mitarbeiter: {
    vertrags: ({
      vertrags_arbeitszeits: vertrags_arbeitszeits[];
      vertrags_phases: ({
        vertragsstuves:
          | ({
              vertrags_variantes: vertrags_variantes | null;
            } & vertragsstuves)
          | null;
      } & vertrags_phases)[];
    } & vertrags)[];
  } & mitarbeiters,
  tag: Date
) => {
  let arbeitszeit = 0;
  mitarbeiter.vertrags.find((v) => {
    let wochenstunden = 0;
    if (!v.anfang || !v.ende || v.anfang > tag || v.ende < tag) return false;
    v.vertrags_phases.find((p) => {
      if (!p.von || !p.bis || p.von > tag || p.bis < tag) return false;
      wochenstunden = p.vertragsstuves?.vertrags_variantes?.wochenstunden || 0;
      return wochenstunden > 0;
    });
    if (!wochenstunden) return false;
    const wochenMinuten = wochenstunden * 60;
    return !!v.vertrags_arbeitszeits.find((a) => {
      const vk = Number(a.vk) || 0;
      const tageWoche = Number(a.tage_woche) || 0;
      const notValidDate = !a.von || !a.bis || a.von > tag || a.bis < tag;
      const notValidVK = vk <= 0 || vk > 1;
      const notValidTageWoche = tageWoche <= 0 || tageWoche > 7;
      if (notValidDate || notValidVK || notValidTageWoche) return false;
      arbeitszeit = (vk * wochenMinuten) / tageWoche;
      return true;
    });
  });
  return arbeitszeit;
};

export const bedarfsEintragsIncludeMainInfosNoBlock = {
  schichts: {
    include: {
      arbeitszeittyps: true
    }
  },
  po_diensts: true,
  dienstbedarves: {
    include: {
      arbeitszeitverteilungs: {
        include: {
          pre_dienstgruppes: true
        }
      }
    }
  }
};
