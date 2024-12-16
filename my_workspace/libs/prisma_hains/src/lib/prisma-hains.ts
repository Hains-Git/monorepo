import { Prisma, PrismaClient } from '@prisma/client';

export const prismaDb: PrismaClient<Prisma.PrismaClientOptions, 'query'> = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
});

// db.$on('query', (e: any) => {
//   console.log('Params: ' + e.params);
//   console.log('Duration: ' + e.duration + 'ms');
// });

export function addBigIntToJSON() {
  (BigInt.prototype as any).toJSON = function () {
    return Number(this.toString());
  };
}

export function prismaHains(): PrismaClient<Prisma.PrismaClientOptions, 'query'> {
  addBigIntToJSON();
  return prismaDb;
}
