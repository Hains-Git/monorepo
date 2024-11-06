import { getMonatsplanung } from '@my-workspace/prisma_hains';

export async function GET(request: Request) {
  // const bedarfsEintraege = await db.bedarfs_eintrags.findMany({
  //   include: {
  //     schichts: true
  //   },
  //   where: {
  //     tag: {
  //       gte: new Date('2024-05-01'),
  //       lte: new Date('2024-07-01')
  //     }
  //   }
  // });
  // const einteilungen = await db.diensteinteilungs.findMany({
  //   where: {
  //     tag: {
  //       gte: new Date('2024-05-01'),
  //       lte: new Date('2024-07-01')
  //     }
  //   }
  // });
  // return new Response(
  //   JSON.stringify({
  //     bedarfsEintraege,
  //     einteilungen
  //   }),
  //   {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }
  // );
  return new Response(JSON.stringify(getMonatsplanung(10)), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
