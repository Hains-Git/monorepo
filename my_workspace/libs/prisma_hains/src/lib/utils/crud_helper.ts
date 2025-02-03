import { start } from 'repl';

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
