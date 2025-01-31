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
