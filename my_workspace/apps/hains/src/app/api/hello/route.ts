import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
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
        lte: new Date('2024-05-01').toISOString().split('T')[0],
        gte: new Date('2024-07-01').toISOString().split('T')[0]
      }
    }
  });
  console.log(bedarfsEintraege.length, bedarfsEintraege[0]);
  return new Response(JSON.stringify(bedarfsEintraege), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
