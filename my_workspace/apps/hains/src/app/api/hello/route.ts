import { Prisma, PrismaClient } from '@prisma/client';

const prisma: PrismaClient<Prisma.PrismaClientOptions, 'query'> =
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });

prisma.$on('query', (e: any) => {
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export async function GET(request: Request) {
  const bedarfsEintraege = await prisma.bedarfs_eintrags.findMany({
    include: {
      schichts: true
    },
    where: {
      tag: {
        gte: new Date('2024-05-01'),
        lte: new Date('2024-07-01')
      }
    }
  });
  const einteilungen = await prisma.diensteinteilungs.findMany({
    where: {
      tag: {
        gte: new Date('2024-05-01'),
        lte: new Date('2024-07-01')
      }
    }
  });
  return new Response(
    JSON.stringify({
      bedarfsEintraege,
      einteilungen
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
